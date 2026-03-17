const request = require('supertest');
const createApp = require('../src/app');

let app, token;

beforeEach(async () => {
  app = createApp(':memory:');
  const res = await request(app)
    .post('/api/auth/register')
    .send({ username: 'testuser', password: 'password123', email: 'test@example.com' });
  token = res.body.token;
});

afterEach(() => {
  app.db.close();
});

describe('GET /api/user/profile', () => {
  it('should return user profile', async () => {
    const res = await request(app)
      .get('/api/user/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.username).toBe('testuser');
    expect(res.body.email).toBe('test@example.com');
    expect(res.body.password).toBeUndefined();
  });

  it('should reject without auth', async () => {
    const res = await request(app).get('/api/user/profile');
    expect(res.status).toBe(401);
  });
});

describe('PUT /api/user/profile', () => {
  it('should update email', async () => {
    const res = await request(app)
      .put('/api/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'new@example.com' });

    expect(res.status).toBe(200);
    expect(res.body.email).toBe('new@example.com');
  });

  it('should update password', async () => {
    await request(app)
      .put('/api/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: 'newpassword123' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'newpassword123' });

    expect(res.status).toBe(200);
  });

  it('should reject duplicate email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'other', password: 'password123', email: 'other@example.com' });

    const res = await request(app)
      .put('/api/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'other@example.com' });

    expect(res.status).toBe(409);
  });

  it('should reject short password', async () => {
    const res = await request(app)
      .put('/api/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: '123' });

    expect(res.status).toBe(400);
  });
});
