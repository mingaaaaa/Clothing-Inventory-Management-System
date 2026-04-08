"use client";

import { useAuthStore } from "@/stores/auth-store";

export default function DashboardPage() {
  const { user, menus } = useAuthStore();

  return (
    <div>
      <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">
        欢迎回来，{user?.realName || user?.username}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {menus.map((menu) => (
          <a
            key={menu.key}
            href={menu.path}
            className="rounded-xl border border-[#eaeaea] bg-white p-5 transition-shadow hover:shadow-md"
          >
            <h3 className="text-sm font-medium text-[#1a1a2e]">{menu.label}</h3>
            <p className="mt-1 text-xs text-[#999]">点击进入</p>
          </a>
        ))}
      </div>
    </div>
  );
}
