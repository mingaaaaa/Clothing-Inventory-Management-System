"use client";

import { useAuthStore } from "@/stores/auth-store";
import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  Store,
  Users,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  Store,
  Users,
};

const CARD_GRADIENTS = [
  "from-indigo-500/10 via-violet-500/5 to-transparent",
  "from-emerald-500/10 via-teal-500/5 to-transparent",
  "from-amber-500/10 via-orange-500/5 to-transparent",
  "from-rose-500/10 via-pink-500/5 to-transparent",
  "from-cyan-500/10 via-sky-500/5 to-transparent",
  "from-fuchsia-500/10 via-purple-500/5 to-transparent",
];

const ICON_COLORS = [
  "text-indigo-500 bg-indigo-50",
  "text-emerald-500 bg-emerald-50",
  "text-amber-500 bg-amber-50",
  "text-rose-500 bg-rose-50",
  "text-cyan-500 bg-cyan-50",
  "text-fuchsia-500 bg-fuchsia-50",
];

export default function DashboardPage() {
  const { user, menus } = useAuthStore();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome hero */}
      <div className="relative mb-8 p-8 rounded-2xl bg-white premium-shadow overflow-hidden animate-fade-up">
        <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-primary/5 via-primary/[0.02] to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-linear-to-tr from-primary/3 to-transparent rounded-tr-full" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-8 rounded-full gradient-primary" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            欢迎回来，<span className="text-gradient-primary">{user?.realName || user?.username}</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            选择一个模块开始工作
          </p>
        </div>
      </div>

      {/* Menu cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {menus.map((menu, index) => {
          const Icon = ICON_MAP[menu.icon || ""];
          return (
            <a
              key={menu.key}
              href={menu.path}
              className="group relative rounded-2xl bg-white premium-shadow p-6 transition-all duration-300 hover:-translate-y-1 hover:premium-shadow-lg overflow-hidden animate-fade-up"
              style={{ animationDelay: `${(index + 1) * 80}ms` }}
            >
              {/* Gradient bg on hover */}
              <div className={`absolute inset-0 bg-linear-to-br ${CARD_GRADIENTS[index % CARD_GRADIENTS.length]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] gradient-accent-bar opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                {Icon && (
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${ICON_COLORS[index % ICON_COLORS.length]} mb-4 transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="h-5 w-5" />
                  </div>
                )}
                <h3 className="text-sm font-semibold tracking-tight">{menu.label}</h3>
                <p className="mt-1 text-xs text-muted-foreground">点击进入</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
