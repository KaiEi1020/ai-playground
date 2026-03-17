const request = require('supertest');
const jwt = require('jsonwebtoken');
const createApp = require('../src/app');
const { JWT_SECRET } = require('../src/middleware/auth');
const bcrypt = require('bcrypt');

let app, adminToken, userToken;

beforeEach(async () => {
  app = createApp(':memory:');

  // Create admin user directly
  const hashedPw = await bcrypt.hash('admin123', 10);
  app.db.prepare("INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, 'admin')").run('admin', hashedPw, 'admin@example.com');
  adminToken = jwt.sign({ id: 1, username: 'admin', role: 'admin' }, JWT_SECRET);

  // Create regular user
  const res = await request(app)
    .post('/api/auth/register')
    .send({ username: 'normaluser', password: 'password123', email: 'user@example.com' });
  userToken = res.body.token;
});

afterEach(() => {
  app.db.close();
});

describe('GET /api/admin/stats', () => {
  it('should return stats for admin', async () => {
    // Create some posts and comments
    await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'Post 1', content: 'Content' });

    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.users).toBe(2);
    expect(res.body.posts).toBe(1);
    expect(res.body.comments).toBe(0);
  });

  it('should reject non-admin', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });

  it('should reject without auth', async () => {
    const res = await request(app).get('/api/admin/stats');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/admin/users', () => {
  it('should return all users for admin', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].password).toBeUndefined();
  });

  it('should reject non-admin', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });
});

describe('PUT /api/admin/users/:id/ban', () => {
  it('should ban a user', async () => {
    const userId = app.db.prepare("SELECT id FROM users WHERE username = 'normaluser'").get().id;

    const res = await request(app)
      .put(`/api/admin/users/${userId}/ban`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.banned).toBe(1);
  });

  it('should unban a user (toggle)', async () => {
    const userId = app.db.prepare("SELECT id FROM users WHERE username = 'normaluser'").get().id;
    app.db.prepare('UPDATE users SET banned = 1 WHERE id = ?').run(userId);

    const res = await request(app)
      .put(`/api/admin/users/${userId}/ban`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.banned).toBe(0);
  });

  it('should not ban admin', async () => {
    const res = await request(app)
      .put('/api/admin/users/1/ban')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(400);
  });

  it('should return 404 for non-existent user', async () => {
    const res = await request(app)
      .put('/api/admin/users/999/ban')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });

  it('should reject non-admin', async () => {
    const res = await request(app)
      .put('/api/admin/users/1/ban')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });
});
