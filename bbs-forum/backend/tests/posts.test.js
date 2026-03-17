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

describe('POST /api/posts', () => {
  it('should create a post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Post', content: 'Hello world', category: 'tech' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Post');
    expect(res.body.category).toBe('tech');
    expect(res.body.authorName).toBe('testuser');
  });

  it('should reject without auth', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({ title: 'Test', content: 'Content' });

    expect(res.status).toBe(401);
  });

  it('should reject missing fields', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test' });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/posts', () => {
  beforeEach(async () => {
    for (let i = 1; i <= 15; i++) {
      await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: `Post ${i}`, content: `Content ${i}`, category: i <= 5 ? 'tech' : 'general' });
    }
  });

  it('should return paginated posts', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(res.body.posts.length).toBe(10);
    expect(res.body.pagination.total).toBe(15);
    expect(res.body.pagination.totalPages).toBe(2);
  });

  it('should return page 2', async () => {
    const res = await request(app).get('/api/posts?page=2');
    expect(res.body.posts.length).toBe(5);
  });

  it('should filter by category', async () => {
    const res = await request(app).get('/api/posts?category=tech');
    expect(res.body.posts.length).toBe(5);
    expect(res.body.pagination.total).toBe(5);
  });
});

describe('GET /api/posts/:id', () => {
  it('should return post with comments', async () => {
    const postRes = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test', content: 'Content' });

    await request(app)
      .post(`/api/posts/${postRes.body.id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Nice post!' });

    const res = await request(app).get(`/api/posts/${postRes.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Test');
    expect(res.body.comments.length).toBe(1);
    expect(res.body.comments[0].content).toBe('Nice post!');
  });

  it('should return 404 for missing post', async () => {
    const res = await request(app).get('/api/posts/999');
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/posts/:id', () => {
  let postId;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Original', content: 'Original content' });
    postId = res.body.id;
  });

  it('should update own post', async () => {
    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated');
  });

  it('should reject update by other user', async () => {
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({ username: 'other', password: 'password123', email: 'other@example.com' });

    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${regRes.body.token}`)
      .send({ title: 'Hacked' });

    expect(res.status).toBe(403);
  });

  it('should allow admin to update any post', async () => {
    app.db.prepare("INSERT INTO users (username, password, email, role) VALUES ('admin', 'hashed', 'admin@example.com', 'admin')").run();
    const jwt = require('jsonwebtoken');
    const { JWT_SECRET } = require('../src/middleware/auth');
    const adminToken = jwt.sign({ id: 2, username: 'admin', role: 'admin' }, JWT_SECRET);

    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Admin Updated', pinned: true });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Admin Updated');
    expect(res.body.pinned).toBe(1);
  });

  it('should return 404 for missing post', async () => {
    const res = await request(app)
      .put('/api/posts/999')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated' });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/posts/:id', () => {
  let postId;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'To Delete', content: 'Content' });
    postId = res.body.id;
  });

  it('should delete own post', async () => {
    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);

    const getRes = await request(app).get(`/api/posts/${postId}`);
    expect(getRes.status).toBe(404);
  });

  it('should reject delete by other user', async () => {
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({ username: 'other', password: 'password123', email: 'other@example.com' });

    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${regRes.body.token}`);

    expect(res.status).toBe(403);
  });

  it('should return 404 for missing post', async () => {
    const res = await request(app)
      .delete('/api/posts/999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});

describe('POST /api/posts/:id/comments', () => {
  let postId;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test', content: 'Content' });
    postId = res.body.id;
  });

  it('should create a comment', async () => {
    const res = await request(app)
      .post(`/api/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Great post!' });

    expect(res.status).toBe(201);
    expect(res.body.content).toBe('Great post!');
    expect(res.body.authorName).toBe('testuser');
  });

  it('should reject without auth', async () => {
    const res = await request(app)
      .post(`/api/posts/${postId}/comments`)
      .send({ content: 'No auth' });

    expect(res.status).toBe(401);
  });

  it('should reject empty content', async () => {
    const res = await request(app)
      .post(`/api/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it('should reject comment on non-existent post', async () => {
    const res = await request(app)
      .post('/api/posts/999/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Comment' });

    expect(res.status).toBe(404);
  });
});
