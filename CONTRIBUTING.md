# 贡献指南

感谢您对 nest-social-api 项目的关注！我们欢迎任何形式的贡献。

## 如何贡献

### 报告问题

如果您发现了 bug 或有功能建议，请：

1. 检查 [Issues](https://github.com/WinnerNew/nest-social-api/issues) 确保问题尚未被报告
2. 创建新的 Issue，使用清晰的标题和详细的描述
3. 提供复现步骤、预期行为和实际行为
4. 包含相关的错误日志和环境信息

### 提交代码

1. **Fork 仓库**
   ```bash
   git clone https://github.com/your-username/nest-social-api.git
   cd nest-social-api
   ```

2. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **进行更改**
   - 遵循现有的代码风格
   - 添加必要的测试
   - 更新相关文档

4. **提交更改**
   ```bash
   git add .
   git commit -m "feat: 添加新功能描述"
   ```

5. **推送到分支**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **创建 Pull Request**
   - 提供清晰的 PR 标题和描述
   - 引用相关的 Issue
   - 确保所有测试通过
   - 等待代码审查

## 开发规范

### 代码风格

- 使用 TypeScript 进行类型定义
- 遵循 ESLint 配置的代码规范
- 使用 Prettier 格式化代码
- 添加有意义的注释

### 提交信息规范

使用 Conventional Commits 规范：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整（不影响功能）
- `refactor:` 重构（既不是新功能也不是修复）
- `test:` 添加测试
- `chore:` 构建过程或辅助工具的变动

示例：
```bash
git commit -m "feat: 添加用户关注功能"
git commit -m "fix: 修复 JWT 令牌过期时间配置"
```

### 分支命名

- `feature/` - 新功能
- `fix/` - bug 修复
- `docs/` - 文档更新
- `refactor/` - 代码重构
- `test/` - 测试相关

## 开发环境设置

1. **安装依赖**
   ```bash
   npm install
   ```

2. **配置环境变量**
   ```bash
   cp .env.example .env
   # 编辑 .env 文件，填入必要的配置
   ```

3. **运行数据库迁移**
   ```bash
   npx prisma migrate dev
   ```

4. **启动开发服务器**
   ```bash
   npm run start:dev
   ```

5. **运行测试**
   ```bash
   npm run test
   ```

6. **代码检查**
   ```bash
   npm run lint
   ```

## 代码审查

所有 Pull Request 都需要经过代码审查。审查者会检查：

- 代码质量和风格
- 功能实现的正确性
- 测试覆盖率
- 文档完整性
- 安全性考虑

## 行为准则

请遵守我们的 [行为准则](CODE_OF_CONDUCT.md)，确保社区环境友好和包容。

## 获取帮助

如果您有任何问题：

- 查看 [README.md](README.md) 了解项目基本信息
- 查看 [Issues](https://github.com/WinnerNew/nest-social-api/issues) 寻找类似问题
- 创建新的 Issue 提问

## 许可证

通过贡献代码，您同意您的贡献将在 MIT 许可证下发布。