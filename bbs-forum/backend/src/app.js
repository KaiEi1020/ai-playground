const express = require('express');
const cors = require('cors');
const createDb = require('./db');
const createAuthRouter = require('./routes/auth');
const createPostsRouter = require('./routes/posts');
const createUserRouter = require('./routes/user');
const createAdminRouter = require('./routes/admin');

function createApp(dbPath) {
  const app = express();
  const db = createDb(dbPath);

  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', createAuthRouter(db));
  app.use('/api/posts', createPostsRouter(db));
  app.use('/api/user', createUserRouter(db));
  app.use('/api/admin', createAdminRouter(db));

  app.db = db;
  return app;
}

module.exports = createApp;
