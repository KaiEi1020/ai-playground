import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { OrdersFacade } from '../../src/modules/orders/orders.facade';
import { ORDER_REPOSITORY, OrderRepository } from '../../src/modules/orders/domain/repositories/order.repository';
import {
  OrderAggregate,
  OrderStatus,
} from '../../src/modules/orders/domain/aggregates/order.aggregate';
import { UserFacade } from '../../src/modules/users/users.facade';
import { MarketingCampaignsService } from '../../src/modules/marketing/application/marketing-campaigns.service';
import { InMemoryProductRepository } from '../../src/modules/products/infrastructure/repositories/in-memory-product.repository';
import { OrderItem } from '../../src/modules/orders/domain/value-objects/order-item.vo';
import { ShippingAddress } from '../../src/modules/orders/domain/value-objects/shipping-address.vo';

describe('Freeze user saga (e2e)', () => {
  let app: INestApplication;
  let usersFacade: UserFacade;
  let ordersFacade: OrdersFacade;
  let orderRepository: OrderRepository;
  let marketingCampaignsService: MarketingCampaignsService;
  let productRepository: InMemoryProductRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();

    usersFacade = moduleRef.get(UserFacade);
    ordersFacade = moduleRef.get(OrdersFacade);
    orderRepository = moduleRef.get(ORDER_REPOSITORY);
    marketingCampaignsService = moduleRef.get(MarketingCampaignsService);
    productRepository = moduleRef.get(InMemoryProductRepository);
  });

  beforeEach(async () => {
    await ordersFacade.reset();
    await usersFacade.reset();
    await marketingCampaignsService.clear();
    await productRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  async function login(username: string, password: string): Promise<string> {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username, password })
      .expect(201);

    return response.body.accessToken as string;
  }

  it('freezes the user and stops only in-progress orders', async () => {
    const adminToken = await login('admin', 'admin123');
    const operationsToken = await login('ops', 'ops123');

    const createUser = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});

    expect(createUser.status).toBe(201);
    const userId = createUser.body.id as string;

    const productResponse = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Demo Product',
        description: 'Used in saga regression test',
        categoryId: '22222222-2222-2222-2222-222222222222',
        variants: [
          {
            sku: 'DEMOPRODUCT-001',
            attributes: { color: 'black' },
            price: { amount: 100, currency: 'CNY' },
            stockQuantity: 100,
          },
        ],
      })
      .expect(201);

    const variantId = productResponse.body.variants[0].id as string;

    const orderResponses = [];
    for (let index = 0; index < 4; index += 1) {
      orderResponses.push(
        await request(app.getHttpServer())
          .post('/orders')
          .set('Authorization', `Bearer ${operationsToken}`)
          .send({
            userId,
            items: [
              {
                productId: productResponse.body.id,
                variantId,
                quantity: 1,
              },
            ],
            shippingAddress: {
              receiverName: '张三',
              phoneNumber: '13800138000',
              province: '浙江省',
              city: '杭州市',
              district: '西湖区',
              street: '测试路 1 号',
              postalCode: '310000',
            },
          }),
      );
    }

    const orderIds = orderResponses.map((response) => {
      expect(response.status).toBe(201);
      return response.body.id as string;
    });

    expect(orderResponses).toHaveLength(4);

    await request(app.getHttpServer())
      .post(`/orders/${orderIds[0]}/start`)
      .set('Authorization', `Bearer ${operationsToken}`)
      .send()
      .expect(201);

    await request(app.getHttpServer())
      .post(`/orders/${orderIds[1]}/start`)
      .set('Authorization', `Bearer ${operationsToken}`)
      .send()
      .expect(201);

    const completedOrder = OrderAggregate.rehydrate(
      orderIds[3],
      userId,
      orderResponses[3].body.items.map(
        (item: {
          productId: string;
          variantId: string;
          productName: string;
          sku: string;
          unitPrice: number;
          quantity: number;
        }) =>
          new OrderItem(
            item.productId,
            item.variantId,
            item.productName,
            item.sku,
            item.unitPrice,
            item.quantity,
          ),
      ),
      new ShippingAddress(
        orderResponses[3].body.shippingAddress.receiverName,
        orderResponses[3].body.shippingAddress.phoneNumber,
        orderResponses[3].body.shippingAddress.province,
        orderResponses[3].body.shippingAddress.city,
        orderResponses[3].body.shippingAddress.district,
        orderResponses[3].body.shippingAddress.street,
        orderResponses[3].body.shippingAddress.postalCode,
      ),
      OrderStatus.IN_PROGRESS,
      null,
    );
    completedOrder.complete();
    await orderRepository.save(completedOrder);

    const freezeResponse = await request(app.getHttpServer())
      .post(`/users/${userId}/freeze`)
      .set('Authorization', `Bearer ${operationsToken}`)
      .send({});

    expect(freezeResponse.status).toBe(201);
    expect(freezeResponse.body).toMatchObject({
      id: userId,
      status: 'FROZEN',
    });

    const userResponse = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${operationsToken}`)
      .expect(200);

    expect(userResponse.body.status).toBe('FROZEN');

    const ordersResponse = await request(app.getHttpServer())
      .get('/orders')
      .set('Authorization', `Bearer ${operationsToken}`)
      .query({ userId })
      .expect(200);

    expect(ordersResponse.body).toEqual([
      expect.objectContaining({ id: orderIds[0], status: 'STOPPED' }),
      expect.objectContaining({ id: orderIds[1], status: 'STOPPED' }),
      expect.objectContaining({ id: orderIds[2], status: 'CREATED' }),
      expect.objectContaining({ id: orderIds[3], status: 'COMPLETED' }),
    ]);

    expect(ordersResponse.body[0].stopReason).toContain(userId);
    expect(ordersResponse.body[1].stopReason).toContain(userId);
    expect(ordersResponse.body[2].stopReason).toBeNull();
    expect(ordersResponse.body[3].stopReason).toBeNull();
  });
});
