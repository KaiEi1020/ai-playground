const express = require('express');
const { authMiddleware } = require('../middleware/auth');

function createPostsRouter(db) {
  const router = express.Router();

  // GET /api/posts - list posts with pagination and category filter
  router.get('/', (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const category = req.query.category;

      let query = `SELECT p.*, u.username as authorName FROM posts p JOIN users u ON p.authorId = u.id`;
      let countQuery = `SELECT COUNT(*) as total FROM posts`;
      const params = [];
      const countParams = [];

      if (category) {
        query += ` WHERE p.category = ?`;
        countQuery += ` WHERE category = ?`;
        params.push(category);
        countParams.push(category);
      }

      query += ` ORDER BY p.pinned DESC, p.createdAt DESC LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const posts = db.prepare(query).all(...params);
      const { total } = db.prepare(countQuery).get(...countParams);

      res.json({
        posts,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  });

  // GET /api/posts/:id - get post detail with comments
  router.get('/:id', (req, res) => {
    try {
      const post = db.prepare(`SELECT p.*, u.username as authorName FROM posts p JOIN users u ON p.authorId = u.id WHERE p.id = ?`).get(req.params.id);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const comments = db.prepare(`SELECT c.*, u.username as authorName FROM comments c JOIN users u ON c.authorId = u.id WHERE c.postId = ? ORDER BY c.createdAt ASC`).all(req.params.id);

      res.json({ ...post, comments });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch post' });
    }
  });

  // POST /api/posts - create post
  router.post('/', authMiddleware, (req, res) => {
    try {
      const { title, content, category } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const result = db.prepare('INSERT INTO posts (title, content, authorId, category) VALUES (?, ?, ?, ?)').run(title, content, req.user.id, category || 'general');

      const post = db.prepare('SELECT p.*, u.username as authorName FROM posts p JOIN users u ON p.authorId = u.id WHERE p.id = ?').get(result.lastInsertRowid);

      res.status(201).json(post);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create post' });
    }
  });

  // PUT /api/posts/:id - edit post
  router.put('/:id', authMiddleware, (req, res) => {
    try {
      const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (post.authorId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const { title, content, category, pinned } = req.body;
      db.prepare('UPDATE posts SET title = COALESCE(?, title), content = COALESCE(?, content), category = COALESCE(?, category), pinned = COALESCE(?, pinned) WHERE id = ?')
        .run(title || null, content || null, category || null, pinned !== undefined ? (pinned ? 1 : 0) : null, req.params.id);

      const updated = db.prepare('SELECT p.*, u.username as authorName FROM posts p JOIN users u ON p.authorId = u.id WHERE p.id = ?').get(req.params.id);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update post' });
    }
  });

  // DELETE /api/posts/:id - delete post
  router.delete('/:id', authMiddleware, (req, res) => {
    try {
      const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (post.authorId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized' });
      }

      db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
      res.json({ message: 'Post deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete post' });
    }
  });

  // POST /api/posts/:id/comments - add comment
  router.post('/:id/comments', authMiddleware, (req, res) => {
    try {
      const post = db.prepare('SELECT id FROM posts WHERE id = ?').get(req.params.id);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const { content } = req.body;
      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }

      const result = db.prepare('INSERT INTO comments (content, postId, authorId) VALUES (?, ?, ?)').run(content, req.params.id, req.user.id);

      const comment = db.prepare('SELECT c.*, u.username as authorName FROM comments c JOIN users u ON c.authorId = u.id WHERE c.id = ?').get(result.lastInsertRowid);

      res.status(201).json(comment);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create comment' });
    }
  });

  return router;
}

module.exports = createPostsRouter;
