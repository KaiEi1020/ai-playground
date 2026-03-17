---
active: true
iteration: 1
session_id: 
max_iterations: 150
completion_promise: "BBS_SYSTEM_COMPLETE"
started_at: "2026-03-17T06:29:55Z"
---


请从零开始构建一个完整的 BBS 论坛系统，使用 TDD 方式开发。

项目结构要求：
- backend/ 目录：Express API 服务器
- frontend/ 目录：React 前端应用
- 两个目录都有各自的测试

后端功能要求：
- 使用 Express 框架
- SQLite 数据存储（better-sqlite3）
- JWT 用户认证（jsonwebtoken + bcrypt）
- 用户表：id、username、password、email、role、createdAt
- 帖子表：id、title、content、authorId、category、pinned、createdAt
- 评论表：id、content、postId、authorId、createdAt

后端 API 端点：
- POST /api/auth/register - 用户注册
- POST /api/auth/login - 用户登录
- GET /api/posts - 获取帖子列表（分页、分类筛选）
- GET /api/posts/:id - 获取帖子详情
- POST /api/posts - 发布帖子（需登录）
- PUT /api/posts/:id - 编辑帖子（作者或管理员）
- DELETE /api/posts/:id - 删除帖子（作者或管理员）
- POST /api/posts/:id/comments - 发表评论（需登录）
- GET /api/user/profile - 获取个人信息（需登录）
- PUT /api/user/profile - 更新个人信息（需登录）
- GET /api/admin/stats - 管理员统计（需管理员）
- GET /api/admin/users - 用户列表（需管理员）
- PUT /api/admin/users/:id/ban - 封禁用户（需管理员）

前端页面要求：
- /login - 登录页
- /register - 注册页
- / - 首页（帖子列表）
- /post/:id - 帖子详情
- /new - 发布帖子
- /profile - 个人中心
- /admin - 管理后台（需管理员权限）

管理后台功能：
- 用户管理（查看、封禁、解封）
- 帖子管理（查看、删除、置顶）
- 评论管理（查看、删除）
- 系统统计（用户数、帖子数、评论数）

TDD 要求：
- 先写测试，后写代码
- 每个功能都要有对应的测试
- 后端使用 Jest，API 测试要覆盖所有端点
- 前端使用 Vitest，组件测试要覆盖主要功能
- 认证中间件要有测试

验收标准：
- 运行 npm test（后端）全部通过
- 运行 npm test（前端）全部通过
- 前端可以正常启动并使用
- 后端 API 可以正常响应
- 普通用户和管理员权限正确隔离
- 代码通过 ESLint 检查

完成后输出：<promise>BBS_SYSTEM_COMPLETE</promise>

