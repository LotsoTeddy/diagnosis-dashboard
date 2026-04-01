# 认证配置指南

## 1. 配置环境变量

创建 `.env.local` 文件并添加以下内容：

```bash
# Authentication Configuration
AUTH_USERNAME=admin
AUTH_PASSWORD=your_secure_password_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=OufT+4mTfeAKVAWhDfJv+M6orfzVi6nD0ZsXKMzPKgU=

# 生产环境需要改为实际域名
# NEXTAUTH_URL=https://your-domain.com
```

## 2. 设置用户名和密码

在 `.env.local` 文件中：
- `AUTH_USERNAME`: 设置登录用户名
- `AUTH_PASSWORD`: 设置登录密码

**安全建议**：
- 使用强密码（至少 12 位，包含大小写字母、数字和特殊字符）
- 不要在代码仓库中提交 `.env.local` 文件
- 生产环境使用不同的密码

## 3. 启动应用

```bash
npm run dev
```

访问 http://localhost:3001 将自动跳转到登录页面。

## 4. 登录

使用您在 `.env.local` 中配置的用户名和密码登录系统。
