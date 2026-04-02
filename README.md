# Social Media API

这是一个基于 NestJS 和 Prisma 的社交媒体应用程序后端 API。

## 技术栈

- **框架**: NestJS
- **数据库**: MySQL
- **ORM**: Prisma
- **认证**: JWT (JSON Web Token)
- **API 文档**: Swagger
- **验证**: class-validator
- **密码加密**: bcryptjs

## 功能特性

- 用户注册和登录
- JWT 认证
- 用户管理
- 帖子管理（创建、获取）
- 消息管理
- 通知管理
- API 文档（Swagger）

## 安装步骤

1. 克隆项目
```bash
git clone <repository-url>
cd nextjs-prisma
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量

项目已包含 `.env` 文件，请根据你的数据库配置修改以下环境变量：

```env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
JWT_SECRET="your-secret-key"
PORT=3001
```

4. 生成 Prisma Client
```bash
npx prisma generate
```

5. 运行数据库迁移
```bash
npx prisma migrate dev --name init
```

## 运行项目

### 开发模式
```bash
npm run start:dev
```

### 生产模式
```bash
npm run build
npm run start:prod
```

### 调试模式
```bash
npm run start:debug
```

## API 文档

启动项目后，访问以下地址查看 API 文档：

```
http://localhost:3001/api/docs
```

## API 端点

### 根路由
- `GET /` - 获取 API 信息

### 认证 (Auth)
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息（需要认证）

### 用户 (User)
- `GET /api/user` - 获取所有用户
- `GET /api/user/me` - 获取当前用户信息（需要认证）
- `GET /api/user/:id` - 根据ID获取用户信息

### 帖子 (Post)
- `GET /api/post` - 获取所有帖子
- `POST /api/post` - 创建帖子（需要认证）

### 消息 (Message)
- `GET /api/message` - 获取当前用户的消息（需要认证）
- `POST /api/message` - 发送消息（需要认证）

### 通知 (Notification)
- `GET /api/notification` - 获取当前用户的通知（需要认证）

## 数据库模型

### User（用户）
- id: String (主键)
- username: String (唯一)
- handle: String (唯一)
- avatar: String
- bio: String (可选)
- location: String (可选)
- website: String (可选)
- password: String
- followers: Int
- following: Int
- createdAt: DateTime
- updatedAt: DateTime

### Post（帖子）
- id: String (主键)
- content: String
- image: String (可选)
- likesCount: Int
- repostsCount: Int
- repliesCount: Int
- createdAt: DateTime
- updatedAt: DateTime
- userId: String (外键)
- parentId: String (可选，用于回复)

### Message（消息）
- id: String (主键)
- content: String
- createdAt: DateTime
- userId: String (外键)
- chatId: String (外键)

### Notification（通知）
- id: String (主键)
- type: String
- postId: String (可选)
- messageId: String (可选)
- actorId: String (外键)
- recipientId: String (外键)
- read: Boolean
- createdAt: DateTime

### Like（点赞）
- id: String (主键)
- userId: String (外键)
- postId: String (外键)
- createdAt: DateTime

### Repost（转发）
- id: String (主键)
- userId: String (外键)
- postId: String (外键)
- createdAt: DateTime

### Follow（关注）
- id: String (主键)
- followerId: String (外键)
- followingId: String (外键)
- createdAt: DateTime

### Chat（聊天）
- id: String (主键)
- unreadCount: Int
- createdAt: DateTime
- updatedAt: DateTime
- user1Id: String (外键)
- user2Id: String (外键)

## 开发脚本

```bash
# 编译项目
npm run build

# 格式化代码
npm run format

# 运行 ESLint 检查
npm run lint

# 运行测试
npm run test

# 运行测试并生成覆盖率报告
npm run test:cov

# 运行端到端测试
npm run test:e2e
```

## 项目结构

```
src/
├── common/
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   └── utils/
│       ├── jwt.strategy.ts
│       ├── prisma.module.ts
│       └── prisma.service.ts
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       └── register.dto.ts
│   ├── user/
│   │   ├── user.controller.ts
│   │   ├── user.module.ts
│   │   └── user.service.ts
│   ├── post/
│   │   ├── post.controller.ts
│   │   ├── post.module.ts
│   │   ├── post.service.ts
│   │   └── dto/
│   │       └── create-post.dto.ts
│   ├── message/
│   │   ├── message.controller.ts
│   │   ├── message.module.ts
│   │   ├── message.service.ts
│   │   └── dto/
│   │       └── create-message.dto.ts
│   └── notification/
│       ├── notification.controller.ts
│       ├── notification.module.ts
│       └── notification.service.ts
├── app.controller.ts
├── app.module.ts
└── main.ts
```

## 许可证

UNLICENSED
