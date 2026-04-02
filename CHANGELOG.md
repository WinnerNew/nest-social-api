更新日志
### 0.0.2 (2026-04-02)


### 新增

* 添加 Prisma 数据库模型和配置 ([885cf4a](https://github.com/WinnerNew/nest-social-api/commit/885cf4a79545713c0737069ceeb62516e70a4c9e))
* 添加认证模块（注册、登录、JWT） ([494f5bc](https://github.com/WinnerNew/nest-social-api/commit/494f5bc64690a480630e111130eec4a7424c68db))
* 添加帖子模块 ([2fd1fc0](https://github.com/WinnerNew/nest-social-api/commit/2fd1fc013412453bb39276c7a7efc17778460951))
* 添加通用工具和守卫 ([66eb7fc](https://github.com/WinnerNew/nest-social-api/commit/66eb7fc25a04656c595f4844466640297ad98f08))
* 添加通知模块 ([fc900d8](https://github.com/WinnerNew/nest-social-api/commit/fc900d850698c6b57a504a9e340a74f6db33a925))
* 添加消息模块 ([c1759f0](https://github.com/WinnerNew/nest-social-api/commit/c1759f0280924b796bce428179c0652d17f3b4b7))
* 添加应用入口和主模块 ([838a13e](https://github.com/WinnerNew/nest-social-api/commit/838a13e40465761b5bd87e7b209b803c265affe0))
* 添加用户模块 ([b1ea24f](https://github.com/WinnerNew/nest-social-api/commit/b1ea24fc59ef995e154f58bf765ba3dd557fea42))


### 修复

* 为 JWT 令牌添加过期时间设置 ([15a4ab5](https://github.com/WinnerNew/nest-social-api/commit/15a4ab59cd4ddd7f2afdb43af883bdbbdabe2803))


### 构建

* 初始化项目配置 ([ffd0a23](https://github.com/WinnerNew/nest-social-api/commit/ffd0a2307a2b17c2994446b7c78b9a275c2c5ee6))
* 添加 ESLint 和 NestJS CLI 配置 ([af2318a](https://github.com/WinnerNew/nest-social-api/commit/af2318ac6df63e6c8ed3b31c1e6cf6add9bd6bea))
* 添加 package-lock.json 文件 ([ea19002](https://github.com/WinnerNew/nest-social-api/commit/ea190027288af15ae576f2de036a87004c91ec06))
* 添加 TypeScript 配置 ([9fada94](https://github.com/WinnerNew/nest-social-api/commit/9fada940799fd0f4435842b85bc602548fe8a02b))


### 重构

* 移除 JWT 过期时间重复配置，使用模块级别统一配置 ([35de2f5](https://github.com/WinnerNew/nest-social-api/commit/35de2f57779e070fc64a6f089d7d0f1cdf774b6c))
* 优化代码逻辑和性能 ([0b8e898](https://github.com/WinnerNew/nest-social-api/commit/0b8e898f41fe91ab1fcb3347e9a28c7c9b54efeb))


### 文档

* 更新 SECURITY.md 中的安全漏洞报告邮箱 ([9f9c967](https://github.com/WinnerNew/nest-social-api/commit/9f9c9679d724398085e75fa064c62b0d24ec73e5))
* 添加符合 GitHub 规范的版本控制文件 ([357c8e8](https://github.com/WinnerNew/nest-social-api/commit/357c8e8dca049f117271da23b3355ffe72ff235e))

## [0.0.1] - 2026-04-02

### 新增
- 初始化项目结构
- 实现 NestJS 框架集成
- 配置 Prisma ORM 和 MySQL 数据库
- 实现 JWT 认证系统
  - 用户注册
  - 用户登录
  - 获取当前用户信息
- 实现用户模块
  - 获取用户列表
  - 获取用户详情
  - 获取当前用户信息
- 实现帖子模块
  - 创建帖子
  - 获取帖子列表
- 实现消息模块
  - 发送消息
  - 获取消息列表
- 实现通知模块
  - 获取通知列表
- 配置 Swagger API 文档
- 配置 ESLint 代码检查
- 添加 CORS 支持
- 添加全局异常处理
- 添加请求验证管道
- 实现根路由处理器

### 修复
- 修复 JWT 令牌过期时间配置重复问题
- 统一使用模块级别的 JWT 配置

### 文档
- 添加 README.md 项目文档
- 添加 .gitignore 文件
- 添加贡献指南 (CONTRIBUTING.md)
- 添加行为准则 (CODE_OF_CONDUCT.md)
- 添加安全政策 (SECURITY.md)
- 添加 MIT 许可证 (LICENSE)

### 数据库
- 初始化数据库表结构
- 创建用户表 (users)
- 创建帖子表 (posts)
- 创建消息表 (messages)
- 创建通知表 (notifications)
- 添加必要的索引和关系

---

## 版本说明

### 版本格式
- **主版本号**：不兼容的 API 修改
- **次版本号**：向下兼容的功能性新增
- **修订号**：向下兼容的问题修正

### 变更类型
- `新增`：新功能
- `变更`：现有功能的变更
- `弃用`：即将移除的功能
- `移除`：已移除的功能
- `修复`：bug 修复
- `安全`：安全相关的修复