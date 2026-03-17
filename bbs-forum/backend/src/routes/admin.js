const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

function createAdminRouter(db) {
  const router = express.Router();

  router.use(authMiddleware);
  router.use(adminMiddleware);

  // GET /api/admin/stats
  router.get('/stats', (req, res) => {
    try {
      const users = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
      const posts = db.prepare('SELECT COUNT(*) as count FROM posts').get().count;
      const comments = db.prepare('SELECT COUNT(*) as count FROM comments').get().count;
      res.json({ users, posts, comments });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  // GET /api/admin/users
  router.get('/users', (req, res) => {
    try {
      const users = db.prepare('SELECT id, username, email, role, banned, createdAt FROM users').all();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  // PUT /api/admin/users/:id/ban
  router.put('/users/:id/ban', (req, res) => {
    try {
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.role === 'admin') {
        return res.status(400).json({ error: 'Cannot ban an admin' });
      }

      const newBanned = user.banned ? 0 : 1;
      db.prepare('UPDATE users SET banned = ? WHERE id = ?').run(newBanned, req.params.id);

      const updated = db.prepare('SELECT id, username, email, role, banned, createdAt FROM users WHERE id = ?').get(req.params.id);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update user ban status' });
    }
  });

  return router;
}

module.exports = createAdminRouter;
