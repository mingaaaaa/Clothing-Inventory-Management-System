"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { logoutApi } from "@/lib/api";
import { UserRole } from "@clothing-inventory/shared";
import { Button } from "@/components/ui/button";
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
    <aside className="flex h-screen w-64 flex-col bg-sidebar-background border-r border-sidebar-border relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-[hsl(245,40%,18%,0.3)] via-transparent to-[hsl(260,30%,12%,0.2)] pointer-events-none" />

      {/* Logo area */}
      <div className="relative z-10 flex h-18 items-center gap-3 px-6 border-b border-white/6">
        <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
          </svg>
        </div>
        <div>
          <span className="text-sm font-semibold text-sidebar-foreground tracking-tight block">
            仓库管理
          </span>
          <span className="text-[10px] text-sidebar-foreground/30 tracking-[0.2em] uppercase">
            Inventory
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex-1 overflow-y-auto px-3 py-5">
        <div className="text-[10px] text-sidebar-foreground/25 uppercase tracking-[0.2em] font-medium px-3 mb-3">
          导航菜单
        </div>
        <ul className="space-y-1">
          {menus.map((menu) => {
            const Icon = ICON_MAP[menu.icon || ""];
            const isActive = pathname === menu.path;
            return (
              <li key={menu.key}>
                <Link
                  href={menu.path}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 relative ${
                    isActive
                      ? "text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground/90 hover:bg-white/4"
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl gradient-primary opacity-100 shadow-lg shadow-primary/20" />
                  )}
                  {Icon && (
                    <span className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-lg transition-colors duration-200 ${isActive ? "bg-white/20" : "group-hover:bg-white/6"}`}>
                      <Icon className="h-4 w-4 shrink-0" />
                    </span>
                  )}
                  <span className="relative z-10 font-medium">{menu.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="relative z-10 border-t border-white/6 p-4">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center text-xs font-semibold text-white shadow-md shadow-primary/20 shrink-0">
            {(user?.realName || user?.username || "?").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.realName || user?.username}
            </p>
            <p className="text-[11px] text-sidebar-foreground/35">
              {ROLE_LABELS[user?.role ?? ""] ?? user?.role}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-sidebar-foreground/40 hover:text-red-400 hover:bg-white/4 rounded-xl transition-colors duration-200"
        >
          <LogOut className="h-4 w-4 mr-2" />
          退出登录
        </Button>
      </div>
    </aside>
  );
}
