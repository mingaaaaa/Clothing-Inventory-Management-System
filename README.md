# 服装仓库管理系统

Clothing Inventory Management System - 基于 NestJS + Next.js 的全栈仓库管理平台。

## 功能模块

| 模块 | 说明 | 状态 |
|------|------|------|
| 人员登录及权限校验 | JWT 认证、RBAC 角色菜单控制 | ✅ 已完成 |
| 商品管理 | SKU、种类、面料等管理 | 🔲 待开发 |
| 订单管理 | 入库/出库订单（独立页面） | 🔲 待开发 |
| 门店管理 | 门店信息、坐标、库存 | 🔲 待开发 |

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 16 (App Router) + React 19 + TypeScript |
| 后端 | NestJS 11 + TypeScript |
| 数据库 | SQLite (开发) / PostgreSQL (部署) |
| ORM | Prisma |
| 样式 | Tailwind CSS |
| 状态管理 | Zustand |
| HTTP 客户端 | Axios |
| 包管理 | pnpm (Monorepo) |

## 项目结构

```
├── backend/                 # NestJS 后端
│   ├── prisma/
│   │   ├── schema.prisma    # 数据库模型
│   │   └── seed.ts          # 初始数据
│   └── src/
│       ├── auth/            # 认证模块
│       ├── common/          # 守卫、装饰器、拦截器、过滤器
│       └── main.ts          # 入口文件
├── frontend/                # Next.js 前端
│   └── src/
│       ├── app/             # 页面路由 (App Router)
│       ├── components/      # UI 组件
│       ├── stores/          # Zustand 状态
│       ├── lib/             # Axios、API、常量
│       └── middleware.ts    # 路由保护
└── shared/                  # 共享类型包 (@clothing-inventory/shared)
    └── src/
        ├── types/           # TS 类型定义
        └── index.ts         # Barrel export
```

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 安装

```bash
# 克隆项目
git clone https://github.com/mingaaaaa/Clothing-Inventory-Management-System.git
cd Clothing-Inventory-Management-System

# 安装依赖
pnpm install

# 初始化数据库 (migration + seed)
cd backend
npx prisma migrate dev
```

### 启动开发服务器

```bash
# 根目录分别启动
pnpm dev:backend    # http://localhost:4000
pnpm dev:frontend   # http://localhost:3000
```

### 测试账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | admin123 | 管理员 |
| staff | staff123 | 仓库员工 |
| manager | manager123 | 门店经理 |

## 认证架构

- **双 Token 策略**: Access Token (15min, localStorage) + Refresh Token (7d, httpOnly Cookie)
- **角色**: ADMIN / WAREHOUSE_STAFF / STORE_MANAGER
- **菜单权限**: Menu + RoleMenu 表映射，不同角色看到不同菜单
- **API 前缀**: `/api`
- **受保护路由**: 全局 JwtAuthGuard，使用 `@Public()` 装饰器跳过

### API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/login | 登录 |
| POST | /api/auth/refresh | 刷新 Token |
| POST | /api/auth/logout | 登出 |
| GET | /api/auth/profile | 获取当前用户信息 |
| GET | /api/health | 健康检查 |

## 数据库模型

- **User** - 用户（角色、状态、关联门店）
- **RefreshToken** - 刷新令牌（哈希存储、支持撤销）
- **Menu** - 菜单项（支持层级结构）
- **RoleMenu** - 角色-菜单映射
- **Store** - 门店（地址、坐标）

## 命名规范

- 组件文件: PascalCase (如 `LoginForm.tsx`)
- 工具文件: camelCase (如 `utils.ts`)
- 常量: UPPER_SNAKE_CASE (如 `REFRESH_COOKIE_OPTIONS`)
- 样式: Tailwind utility classes

## 环境变量

### 后端 (`backend/.env`)

```
DATABASE_URL=file:./dev.db
JWT_ACCESS_SECRET=<your-secret>
JWT_REFRESH_SECRET=<your-secret>
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

### 前端 (`frontend/.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 部署说明

切换到 PostgreSQL 只需修改两处：

1. `backend/prisma/schema.prisma` 中 `provider = "postgresql"`
2. `backend/.env` 中 `DATABASE_URL=postgresql://...`

然后执行 `npx prisma migrate deploy`。业务代码无需修改。
