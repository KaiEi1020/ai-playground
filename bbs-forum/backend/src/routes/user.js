const express = require('express');
const bcrypt = require('bcrypt');
const { authMiddleware } = require('../middleware/auth');

function createUserRouter(db) {
  const router = express.Router();

  // GET /api/user/profile
  router.get('/profile', authMiddleware, (req, res) => {
    try {
      const user = db.prepare('SELECT id, username, email, role, createdAt FROM users WHERE id = ?').get(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  });

  // PUT /api/user/profile
  router.put('/profile', authMiddleware, async (req, res) => {
    try {
      const { email, password } = req.body;

      if (email) {
        const existing = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, req.user.id);
        if (existing) {
          return res.status(409).json({ error: 'Email already in use' });
        }
        db.prepare('UPDATE users SET email = ? WHERE id = ?').run(email, req.user.id);
      }

      if (password) {
        if (password.length < 6) {
          return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }
        const hashed = await bcrypt.hash(password, 10);
        db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashed, req.user.id);
      }

      const user = db.prepare('SELECT id, username, email, role, createdAt FROM users WHERE id = ?').get(req.user.id);
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  return router;
}

module.exports = createUserRouter;
