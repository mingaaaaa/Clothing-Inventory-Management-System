<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## 作用域

- 本文件只描述 `frontend/` 目录下的规则。
- 仓库级约束见根目录 `AGENTS.md`。

## 技术栈

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Zustand
- Axios
- `@clothing-inventory/shared`

## 当前页面与结构

- 登录页：`src/app/login/page.tsx`
- 受保护区域：`src/app/dashboard/`
- 布局组件：`src/components/layout/`
- API 封装：`src/lib/api.ts`
- Axios 实例与刷新逻辑：`src/lib/axios.ts`
- 认证状态：`src/stores/auth-store.ts`
- 路由中间件：`src/middleware.ts`

## 前端认证约束

- `auth_status` cookie 只用于 Next.js middleware 的跳转体验，不是安全边界。
- 真正的鉴权与角色控制在后端。
- `useAuthStore` 会持久化 `accessToken`、`user`、`menus`。
- Axios 响应拦截器在 401 时会串行刷新 token；修改登录、刷新、退出流程时不要破坏队列机制。
- 菜单来自后端返回的 `menus`，不要在前端单独维护另一套角色菜单映射。

## 开发约定

- 新页面优先放在 `src/app/` 下，遵循 App Router 目录结构。
- 共享接口字段和类型不要在前端本地重复定义，优先从 `@clothing-inventory/shared` 引入。
- 如果接口契约变化，先改 `shared/` 和 `backend/`，再改前端调用。
- 现有视觉风格已经有明确方向，新增页面尽量沿用当前配色、间距和组件层级，不要突然切成另一套后台模板风格。

## 验证建议

- 至少运行 `pnpm build:frontend`
- 改登录或鉴权链路时，手动回归 `/login`、`/dashboard`、刷新 token 和退出登录
