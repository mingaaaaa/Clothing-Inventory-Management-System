"use client";

import { useAuthStore } from "@/stores/auth-store";

export default function Header() {
  const { user } = useAuthStore();

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#eaeaea] bg-white px-6">
      <h1 className="text-base font-semibold text-[#1a1a2e]">仪表盘</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-[#666]">
          {user?.realName || user?.username}
        </span>
        <div className="h-8 w-8 rounded-full bg-[#6366f1]/10 flex items-center justify-center text-xs font-medium text-[#6366f1]">
          {(user?.realName || user?.username || "?").charAt(0)}
        </div>
      </div>
    </header>
  );
}
