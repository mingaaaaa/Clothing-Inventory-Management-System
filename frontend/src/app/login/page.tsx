"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("请输入用户名和密码");
      return;
    }

    setLoading(true);
    try {
      const res = await loginApi({ username, password });
      setAuth(res.data);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "登录失败，请检查用户名和密码";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* ── Left Panel: Decorative ── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-[#0b1120]">
        {/* Woven-textile grid pattern */}
        <div className="absolute inset-0">
          <svg className="absolute inset-0 h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="weave" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 20h40M20 0v40" stroke="#c9a96e" strokeWidth="0.5" fill="none" />
                <rect x="8" y="8" width="24" height="24" rx="1" fill="none" stroke="#c9a96e" strokeWidth="0.3" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#weave)" />
          </svg>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1120] via-[#111b33] to-[#0b1120]" />

        {/* Animated accent lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 h-[200%] w-[1px] bg-gradient-to-b from-transparent via-[#c9a96e]/20 to-transparent animate-[drift_20s_ease-in-out_infinite]" />
          <div className="absolute -top-1/2 left-[30%] h-[200%] w-[1px] bg-gradient-to-b from-transparent via-[#c9a96e]/10 to-transparent animate-[drift_25s_ease-in-out_infinite_2s]" />
          <div className="absolute -top-1/2 left-[60%] h-[200%] w-[1px] bg-gradient-to-b from-transparent via-[#c9a96e]/15 to-transparent animate-[drift_18s_ease-in-out_infinite_4s]" />
        </div>

        {/* Brand content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[2px] w-8 bg-[#c9a96e]" />
              <span className="text-[#c9a96e]/70 text-xs tracking-[0.3em] uppercase font-light">
                Warehouse System
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl xl:text-6xl font-light text-white/90 leading-[1.15] tracking-tight">
              服装仓库
              <br />
              <span className="text-[#c9a96e]">管理系统</span>
            </h1>
            <p className="text-white/40 text-sm max-w-sm leading-relaxed tracking-wide">
              高效管理库存流转，精准掌控每一件商品的入库与出库，赋能门店运营。
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-white/20 text-xs">
              <div className="h-[1px] w-12 bg-white/10" />
              <span>v1.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Login Form ── */}
      <div className="flex flex-1 items-center justify-center bg-[#fafaf9] px-6 py-12">
        <div className="w-full max-w-[380px]">
          {/* Mobile-only brand */}
          <div className="lg:hidden mb-10 text-center">
            <h1 className="text-2xl font-light text-[#1a1a2e] tracking-tight">
              服装仓库<span className="text-[#6366f1]">管理系统</span>
            </h1>
          </div>

          {/* Form header */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#1a1a2e] tracking-tight">
              欢迎登录
            </h2>
            <p className="mt-1.5 text-sm text-[#888] tracking-wide">
              请输入您的账号信息
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 animate-[fadeSlideIn_0.3s_ease-out]">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="block text-xs font-medium text-[#555] tracking-wide"
              >
                用户名
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                autoComplete="username"
                className="block w-full rounded-lg border border-[#e0ddd8] bg-white px-4 py-3 text-sm text-[#1a1a2e] placeholder:text-[#bbb] outline-none transition-all duration-200 focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-[#555] tracking-wide"
              >
                密码
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                autoComplete="current-password"
                className="block w-full rounded-lg border border-[#e0ddd8] bg-white px-4 py-3 text-sm text-[#1a1a2e] placeholder:text-[#bbb] outline-none transition-all duration-200 focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative flex w-full items-center justify-center gap-2 rounded-lg bg-[#4f46e5] px-4 py-3 text-sm font-medium text-white tracking-wide transition-all duration-200 hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "登录中..." : "登 录"}
            </button>
          </form>

          {/* Footer hint */}
          <p className="mt-8 text-center text-xs text-[#bbb] tracking-wide">
            如需账号请联系管理员
          </p>
        </div>
      </div>

      {/* Keyframe animations */}
      <style jsx global>{`
        @keyframes drift {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(30px); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
