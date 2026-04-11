import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { OrdersFacade } from '../../src/modules/orders/orders.facade';
import { UserFacade } from '../../src/modules/users/users.facade';
import { ORDER_REPOSITORY, OrderRepository } from '../../src/modules/orders/domain/repositories/order.repository';
import {
  OrderAggregate,
  OrderStatus,
} from '../../src/modules/orders/domain/aggregates/order.aggregate';

describe('Freeze user saga (e2e)', () => {
  let app: INestApplication;
  let usersFacade: UserFacade;
  let ordersFacade: OrdersFacade;
  let orderRepository: OrderRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    usersFacade = moduleRef.get(UserFacade);
    ordersFacade = moduleRef.get(OrdersFacade);
    orderRepository = moduleRef.get(ORDER_REPOSITORY);
  });

  beforeEach(async () => {
    await ordersFacade.reset();
    await usersFacade.reset();
  });

  afterAll(async () => {
    await app.close();
  });

  it('freezes the user and stops only in-progress orders', async () => {
    const createUser = await request(app.getHttpServer())
      .post('/users')
      .send({});

    expect(createUser.status).toBe(201);
    const userId = createUser.body.id as string;

    const orderResponses = [];
    for (let index = 0; index < 4; index += 1) {
      orderResponses.push(
        await request(app.getHttpServer()).post('/orders').send({ userId }),
      );
    }

    const orderIds = orderResponses.map((response) => {
      expect(response.status).toBe(201);
      return response.body.id as string;
    });

    expect(orderResponses).toHaveLength(4);

    await request(app.getHttpServer())
      .post(`/orders/${orderIds[0]}/start`)
      .send()
      .expect(201);

    await request(app.getHttpServer())
      .post(`/orders/${orderIds[1]}/start`)
      .send()
      .expect(201);

    const completedOrder = OrderAggregate.rehydrate(
      orderIds[3],
      userId,
      OrderStatus.IN_PROGRESS,
      null,
    );
    completedOrder.complete();
    await orderRepository.save(completedOrder);

    const freezeResponse = await request(app.getHttpServer())
      .post(`/users/${userId}/freeze`)
      .send({});

    expect(freezeResponse.status).toBe(201);
    expect(freezeResponse.body).toMatchObject({
      id: userId,
      status: 'FROZEN',
    });

    const userResponse = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(200);

    expect(userResponse.body.status).toBe('FROZEN');

    const ordersResponse = await request(app.getHttpServer())
      .get('/orders')
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
