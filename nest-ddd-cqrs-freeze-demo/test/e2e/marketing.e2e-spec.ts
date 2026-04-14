import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { MarketingCampaignsService } from '../../src/modules/marketing/application/marketing-campaigns.service';
import { OrdersFacade } from '../../src/modules/orders/orders.facade';
import { UserFacade } from '../../src/modules/users/users.facade';

describe('Marketing campaigns (e2e)', () => {
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

  it('allows marketing role to create and activate campaign', async () => {
    const marketingToken = await login('marketing', 'marketing123');

    const createResponse = await request(app.getHttpServer())
      .post('/marketing-campaigns')
      .set('Authorization', `Bearer ${marketingToken}`)
      .send({ name: 'Referral Blitz', description: 'Invite new users' })
      .expect(201);

    const campaignId = createResponse.body.id as string;
    expect(createResponse.body.status).toBe('DRAFT');

    const activateResponse = await request(app.getHttpServer())
      .post(`/marketing-campaigns/${campaignId}/activate`)
      .set('Authorization', `Bearer ${marketingToken}`)
      .send({})
      .expect(201);

    expect(activateResponse.body.status).toBe('ACTIVE');
    expect(activateResponse.body.activatedBy).toBe('00000000-0000-0000-0000-000000000003');
  });

  it('allows viewer to read but not create campaign', async () => {
    const marketingToken = await login('marketing', 'marketing123');
    const viewerToken = await login('viewer', 'viewer123');

    await request(app.getHttpServer())
      .post('/marketing-campaigns')
      .set('Authorization', `Bearer ${marketingToken}`)
      .send({ name: 'Referral Blitz', description: 'Invite new users' })
      .expect(201);

    await request(app.getHttpServer())
      .get('/marketing-campaigns')
      .set('Authorization', `Bearer ${viewerToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .post('/marketing-campaigns')
      .set('Authorization', `Bearer ${viewerToken}`)
      .send({ name: 'Blocked', description: 'Should fail' })
      .expect(403);
  });
});
