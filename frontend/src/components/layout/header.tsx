"use client";

import { useAuthStore } from "@/stores/auth-store";
import { usePathname } from "next/navigation";
import { Store, LayoutDashboard, ChevronRight } from "lucide-react";

const PAGE_TITLES: Record<string, { title: string; icon: React.ComponentType<{ className?: string }> }> = {
  "/dashboard": { title: "仪表盘", icon: LayoutDashboard },
  "/dashboard/stores": { title: "门店管理", icon: Store },
};

export default function Header() {
  const { user } = useAuthStore();
  const pathname = usePathname();

  const pageInfo = PAGE_TITLES[pathname] || { title: "仪表盘", icon: LayoutDashboard };
  const PageIcon = pageInfo.icon;

  return (
    <header className="flex h-16 items-center justify-between bg-white/70 backdrop-blur-xl border-b border-border/50 px-6 sticky top-0 z-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <PageIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">首页</span>
        <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
        <span className="text-sm font-medium">{pageInfo.title}</span>
      </div>

      {/* User profile */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground hidden sm:block">
          {user?.realName || user?.username}
        </span>
        <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center text-xs font-semibold text-white shadow-md shadow-primary/15">
          {(user?.realName || user?.username || "?").charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
