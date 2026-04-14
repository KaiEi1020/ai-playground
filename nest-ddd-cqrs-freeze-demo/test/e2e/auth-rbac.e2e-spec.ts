import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { MarketingCampaignsService } from '../../src/modules/marketing/application/marketing-campaigns.service';
import { OrdersFacade } from '../../src/modules/orders/orders.facade';
import { UserFacade } from '../../src/modules/users/users.facade';

describe('Auth and RBAC (e2e)', () => {
  let app: INestApplication;
  let usersFacade: UserFacade;
  let ordersFacade: OrdersFacade;
  let marketingCampaignsService: MarketingCampaignsService;

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
  });

  beforeEach(async () => {
    await ordersFacade.reset();
    await usersFacade.reset();
    await marketingCampaignsService.clear();
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

  it('rejects protected routes without token', async () => {
    await request(app.getHttpServer())
      .get('/orders')
      .query({ userId: '00000000-0000-0000-0000-000000000001' })
      .expect(401);
  });

  it('rejects viewer when freezing user', async () => {
    const adminToken = await login('admin', 'admin123');
    const viewerToken = await login('viewer', 'viewer123');

    const createUserResponse = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});

    const userId = createUserResponse.body.id as string;

    await request(app.getHttpServer())
      .post(`/users/${userId}/freeze`)
      .set('Authorization', `Bearer ${viewerToken}`)
      .send({})
      .expect(403);
  });

  it('allows operations to freeze user', async () => {
    const adminToken = await login('admin', 'admin123');
    const operationsToken = await login('ops', 'ops123');

    const createUserResponse = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({})
      .expect(201);

    const userId = createUserResponse.body.id as string;

    await request(app.getHttpServer())
      .post(`/users/${userId}/freeze`)
      .set('Authorization', `Bearer ${operationsToken}`)
      .send({})
      .expect(201);

    const userResponse = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${operationsToken}`)
      .expect(200);

    expect(userResponse.body.status).toBe('FROZEN');
  });

  it('limits marketing routes by role', async () => {
    const marketingToken = await login('marketing', 'marketing123');
    const operationsToken = await login('ops', 'ops123');

    const createCampaignResponse = await request(app.getHttpServer())
      .post('/marketing-campaigns')
      .set('Authorization', `Bearer ${marketingToken}`)
      .send({ name: 'Spring Growth', description: 'Acquire new users' })
      .expect(201);

    expect(createCampaignResponse.body.status).toBe('DRAFT');

    await request(app.getHttpServer())
      .get('/marketing-campaigns')
      .set('Authorization', `Bearer ${operationsToken}`)
      .expect(403);
  });
});
