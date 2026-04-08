"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { logoutApi } from "@/lib/api";
import { UserRole } from "@clothing-inventory/shared";
import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  Store,
  Users,
  LogOut,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  Store,
  Users,
};

const ROLE_LABELS: Record<string, string> = {
  [UserRole.ADMIN]: "管理员",
  [UserRole.WAREHOUSE_STAFF]: "仓库员工",
  [UserRole.STORE_MANAGER]: "门店经理",
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { menus, user, clearAuth } = useAuthStore();

  async function handleLogout() {
    try {
      await logoutApi();
    } catch {
      // ignore
    }
    clearAuth();
    router.push("/login");
  }

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-[#eaeaea] bg-white">
      <div className="flex h-16 items-center gap-2 px-5 border-b border-[#f0f0f0]">
        <div className="h-2 w-2 rounded-full bg-[#6366f1]" />
        <span className="text-sm font-semibold text-foreground tracking-tight">
          仓库管理
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {menus.map((menu) => {
            const Icon = ICON_MAP[menu.icon || ""];
            const isActive = pathname === menu.path;
            return (
              <li key={menu.key}>
                <Link
                  href={menu.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-[#6366f1]/10 text-[#4f46e5] font-medium"
                      : "text-[#666] hover:bg-[#f5f5f5] hover:text-[#333]"
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4 shrink-0" />}
                  <span>{menu.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-[#f0f0f0] p-4">
        <div className="mb-3">
          <p className="text-sm font-medium text-foreground truncate">
            {user?.realName || user?.username}
          </p>
          <p className="text-xs text-[#999]">
            {ROLE_LABELS[user?.role ?? ""] ?? user?.role}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#999] transition-colors hover:bg-[#f5f5f5] hover:text-[#333]"
        >
          <LogOut className="h-4 w-4" />
          <span>退出登录</span>
        </button>
      </div>
    </aside>
  );
}
