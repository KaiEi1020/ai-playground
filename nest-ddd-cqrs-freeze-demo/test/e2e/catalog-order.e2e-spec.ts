import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { MarketingCampaignsService } from '../../src/modules/marketing/application/marketing-campaigns.service';
import { OrdersFacade } from '../../src/modules/orders/orders.facade';
import { UserFacade } from '../../src/modules/users/users.facade';
import { InMemoryAddressRepository } from '../../src/modules/addresses/infrastructure/repositories/in-memory-address.repository';
import { InMemoryProductRepository } from '../../src/modules/products/infrastructure/repositories/in-memory-product.repository';

describe('Catalog and order flow (e2e)', () => {
  let app: INestApplication;
  let usersFacade: UserFacade;
  let ordersFacade: OrdersFacade;
  let marketingCampaignsService: MarketingCampaignsService;
  let addressRepository: InMemoryAddressRepository;
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
    marketingCampaignsService = moduleRef.get(MarketingCampaignsService);
    addressRepository = moduleRef.get(InMemoryAddressRepository);
    productRepository = moduleRef.get(InMemoryProductRepository);
  });

  beforeEach(async () => {
    await ordersFacade.reset();
    await usersFacade.reset();
    await marketingCampaignsService.clear();
    await addressRepository.clear();
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

  it('creates product, address, and order with realistic payload', async () => {
    const adminToken = await login('admin', 'admin123');
    const operationsToken = await login('ops', 'ops123');

    const userResponse = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({})
      .expect(201);

    const userId = userResponse.body.id as string;

    const productResponse = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'iPhone 16 Pro',
        description: '旗舰手机，适合真实电商订单示例',
        categoryId: '11111111-1111-1111-1111-111111111111',
        variants: [
          {
            sku: 'IPHONE16PRO-256-BLACK',
            attributes: { color: 'black', storage: '256GB' },
            price: { amount: 8999, currency: 'CNY' },
            stockQuantity: 50,
          },
        ],
      })
      .expect(201);

    const variantId = productResponse.body.variants[0].id as string;

    await request(app.getHttpServer())
      .post('/addresses')
      .set('Authorization', `Bearer ${operationsToken}`)
      .send({
        userId,
        label: '家',
        receiverName: '张三',
        phoneNumber: '13800138000',
        province: '浙江省',
        city: '杭州市',
        district: '西湖区',
        street: '文三路 138 号',
        postalCode: '310000',
        isDefault: true,
      })
      .expect(201);

    const orderResponse = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${operationsToken}`)
      .send({
        userId,
        items: [
          {
            productId: productResponse.body.id,
            variantId,
            quantity: 2,
          },
        ],
        shippingAddress: {
          receiverName: '张三',
          phoneNumber: '13800138000',
          province: '浙江省',
          city: '杭州市',
          district: '西湖区',
          street: '文三路 138 号',
          postalCode: '310000',
        },
      })
      .expect(201);

    expect(orderResponse.body.items).toHaveLength(1);
    expect(orderResponse.body.items[0]).toMatchObject({
      productName: 'iPhone 16 Pro',
      sku: 'IPHONE16PRO-256-BLACK',
      quantity: 2,
      unitPrice: 8999,
      subtotal: 17998,
    });
    expect(orderResponse.body.totalAmount).toBe(17998);
    expect(orderResponse.body.shippingAddress.fullAddress).toContain('杭州市');
  });
});
