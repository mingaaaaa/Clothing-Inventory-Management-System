# AGENTS.md

## 作用域

- 本文件只描述 `backend/` 目录下的规则。
- 仓库级约束见根目录 `AGENTS.md`。

## 技术栈

- NestJS 11
- Prisma
- SQLite（开发环境）
- JWT + Passport
- `@clothing-inventory/shared`

## 当前实现重点

- 已实现模块核心是 `auth/`
- 已接入 Prisma、全局鉴权、统一响应格式
- 健康检查在 `src/app.controller.ts`
- 商品、库存、入库、出库、门店管理等业务模块尚未真正落地，不要假设对应 service/controller 已存在

## 全局约束

- 所有接口统一带 `/api` 前缀，由 `src/main.ts` 设置
- 全局启用 `ValidationPipe`
- 全局启用 `HttpExceptionFilter`，错误响应统一为 `{ code, message, data: null }`
- 全局启用 `TransformInterceptor`，成功响应统一为 `{ code, message, data }`
- `JwtAuthGuard` 与 `RolesGuard` 通过 `APP_GUARD` 全局注册

## 鉴权规则

- 匿名接口必须显式加 `@Public()`
- 需要角色控制时使用 `@Roles(...)`
- 当前认证主链路在 `src/auth/`：
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/profile`
- Access Token 通过响应体返回
- Refresh Token 通过 httpOnly cookie 传递，并在数据库中以 SHA-256 哈希形式存储

## Prisma 与数据

- Prisma schema 在 `prisma/schema.prisma`
- 当前主要模型：`User`、`RefreshToken`、`Menu`、`RoleMenu`、`Store`
- seed 在 `prisma/seed.ts`
- 测试账号：
- `admin / admin123`
- `staff / staff123`
- `manager / manager123`

## 开发约定

- 新增业务模块优先按 NestJS 常规结构放在 `src/<domain>/`
- DTO 使用 `class-validator`
- 涉及跨端字段、枚举或响应结构时，优先同步修改 `shared/`
- 不要绕过全局拦截器和过滤器手写另一套响应结构，除非明确要重构整套接口约定

## 验证建议

- 至少运行 `pnpm build:backend`
- 改 DTO、控制器、鉴权或 Prisma 逻辑时，优先再跑 `pnpm --filter backend test`
- 改数据库结构时，补 migration，并检查 seed 是否需要同步更新
