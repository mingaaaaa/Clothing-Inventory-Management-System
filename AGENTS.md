# AGENTS.md

## 文件定位

- 本文件是仓库级代理说明，适用于整个 monorepo。
- 子目录中的 `AGENTS.md` 会提供更具体的前端或后端约束；发生冲突时，以更靠近代码的文档为准。
- 对 Claude Code，根目录 `CLAUDE.md` 仅作为导入入口；主内容维护在本文件。

## 仓库结构

- `frontend/`: Next.js 16 + React 19 前端
- `backend/`: NestJS 11 + Prisma 后端
- `shared/`: 前后端共享类型与接口契约

## 工作原则

- 先读代码，再改文档或实现，不要根据 README 或目录名推断已有能力。
- 跨前后端的字段、枚举、响应结构调整，先改 `shared/`，再同步两端。
- 前端任务先读 `frontend/AGENTS.md`，后端任务先读 `backend/AGENTS.md`。
- 当前业务实现以认证、角色菜单、仪表盘骨架为主；不要把 README 中规划的模块当成已完成能力。
- 生成注释和回答均使用中文

## 常用命令

```bash
pnpm install

pnpm dev:backend
pnpm dev:frontend

pnpm build:shared
pnpm build:backend
pnpm build:frontend

pnpm --filter backend lint
pnpm --filter backend test
pnpm --filter backend test:e2e
```

- 默认端口：frontend `3000`，backend `4000`
- 数据库相关命令从 `backend/` 执行

## 跨端约束

- 共享包名为 `@clothing-inventory/shared`
- 成功响应统一为 `{ code, message, data }`
- 认证链路是当前系统核心：登录返回 `accessToken`、用户信息和菜单；刷新令牌走 httpOnly cookie
- 前端的 `auth_status` cookie 只用于路由体验控制，不是安全边界

## 目录指引

- 新增共享类型：`shared/src/types/`
- 新增前端页面：`frontend/src/app/`
- 新增前端状态或 API 封装：`frontend/src/stores/`、`frontend/src/lib/`
- 新增后端业务模块：`backend/src/<domain>/`
- 新增后端通用能力：`backend/src/common/`

## 验证要求

- 仅改 `shared/` 时，至少运行 `pnpm build:shared`
- 改前端时，至少运行 `pnpm build:frontend`
- 改后端时，至少运行 `pnpm build:backend`
- 改认证、控制器、DTO 或共享契约时，优先补跑受影响测试
