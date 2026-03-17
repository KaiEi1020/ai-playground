const jwt = require('jsonwebtoken');
const { authMiddleware, adminMiddleware, JWT_SECRET } = require('../src/middleware/auth');

describe('authMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  it('should reject request without token', () => {
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('should reject invalid token', () => {
    req.headers.authorization = 'Bearer invalidtoken';
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('should accept valid token and set req.user', () => {
    const token = jwt.sign({ id: 1, username: 'test', role: 'user' }, JWT_SECRET);
    req.headers.authorization = `Bearer ${token}`;
    authMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user.id).toBe(1);
    expect(req.user.username).toBe('test');
  });

  it('should reject request without Bearer prefix', () => {
    const token = jwt.sign({ id: 1, username: 'test', role: 'user' }, JWT_SECRET);
    req.headers.authorization = token;
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe('adminMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  it('should reject non-admin user', () => {
    req.user = { id: 1, role: 'user' };
    adminMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('should allow admin user', () => {
    req.user = { id: 1, role: 'admin' };
    adminMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should reject request without user', () => {
    adminMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
