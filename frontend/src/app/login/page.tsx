"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
      {/* ── Left Panel: Premium Dark ── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-[#0a0f1e]">
        {/* Animated mesh gradient */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-[hsl(245,75%,60%,0.08)] blur-[120px] animate-[meshDrift1_12s_ease-in-out_infinite]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[hsl(280,65%,55%,0.06)] blur-[100px] animate-[meshDrift2_15s_ease-in-out_infinite]" />
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-[hsl(260,70%,58%,0.05)] blur-[80px] animate-[meshDrift3_18s_ease-in-out_infinite]" />
        </div>

        {/* Geometric grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M60 0H0v60" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating accent lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-[10%] w-[1px] h-[40%] bg-gradient-to-b from-transparent via-white/10 to-transparent animate-[floatLine_20s_ease-in-out_infinite]" />
          <div className="absolute top-1/3 left-[45%] w-[1px] h-[50%] bg-gradient-to-b from-transparent via-white/[0.06] to-transparent animate-[floatLine_25s_ease-in-out_infinite_3s]" />
          <div className="absolute top-1/6 left-[75%] w-[1px] h-[35%] bg-gradient-to-b from-transparent via-white/[0.08] to-transparent animate-[floatLine_18s_ease-in-out_infinite_6s]" />
        </div>

        {/* Diamond decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] opacity-[0.04]">
          <div className="absolute inset-0 rotate-45 border border-white/40 rounded-sm" />
          <div className="absolute inset-8 rotate-45 border border-white/30 rounded-sm" />
          <div className="absolute inset-16 rotate-45 border border-white/20 rounded-sm" />
        </div>

        {/* Brand content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
              </svg>
            </div>
            <div>
              <span className="text-white/60 text-[10px] tracking-[0.4em] uppercase font-medium block">
                Inventory System
              </span>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-1">
              <h1 className="text-5xl xl:text-7xl font-light text-white leading-[1.1] tracking-tight">
                服装仓库
                <br />
                <span className="text-gradient-primary font-normal">管理系统</span>
              </h1>
            </div>
            <p className="text-white/30 text-sm max-w-xs leading-relaxed tracking-wide font-light">
              高效管理库存流转，精准掌控每一件商品的入库与出库，赋能门店运营。
            </p>

            {/* Feature highlights */}
            <div className="flex gap-8 pt-2">
              <div className="space-y-1">
                <div className="text-2xl font-light text-white/80">360°</div>
                <div className="text-[10px] text-white/25 uppercase tracking-widest">全链路管理</div>
              </div>
              <div className="w-px bg-white/10" />
              <div className="space-y-1">
                <div className="text-2xl font-light text-white/80">实时</div>
                <div className="text-[10px] text-white/25 uppercase tracking-widest">数据同步</div>
              </div>
              <div className="w-px bg-white/10" />
              <div className="space-y-1">
                <div className="text-2xl font-light text-white/80">多店</div>
                <div className="text-[10px] text-white/25 uppercase tracking-widest">统一调度</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white/15 text-[10px] tracking-widest uppercase">
            <div className="h-px w-8 bg-white/10" />
            v1.0
          </div>
        </div>
      </div>

      {/* ── Right Panel: Login Form ── */}
      <div className="flex flex-1 items-center justify-center bg-background relative overflow-hidden px-6 py-12">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.015]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.5" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="w-full max-w-[400px] relative z-10 animate-fade-up">
          {/* Mobile-only brand */}
          <div className="lg:hidden mb-10 text-center">
            <div className="inline-flex h-12 w-12 rounded-2xl gradient-primary items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
              </svg>
            </div>
            <h1 className="text-2xl font-light tracking-tight">
              服装仓库<span className="text-gradient-primary font-normal">管理系统</span>
            </h1>
          </div>

          {/* Form header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-6 rounded-full gradient-primary" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">
              欢迎登录
            </h2>
            <p className="mt-2 text-sm text-muted-foreground tracking-wide">
              请输入您的账号信息
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200/60 bg-red-50/80 backdrop-blur-sm px-4 py-3 text-sm text-destructive animate-[fadeUp_0.3s_ease-out]">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs font-medium tracking-wide">用户名</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                autoComplete="username"
                className="h-11 rounded-xl border-border/60 bg-white/50 backdrop-blur-sm px-4 transition-all duration-200 focus-visible:bg-white focus-visible:border-primary/30 focus-visible:ring-primary/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium tracking-wide">密码</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                autoComplete="current-password"
                className="h-11 rounded-xl border-border/60 bg-white/50 backdrop-blur-sm px-4 transition-all duration-200 focus-visible:bg-white focus-visible:border-primary/30 focus-visible:ring-primary/10"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl gradient-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {loading ? "登录中..." : "登 录"}
            </Button>
          </form>

          {/* Footer hint */}
          <p className="mt-8 text-center text-xs text-muted-foreground/60 tracking-wide">
            如需账号请联系管理员
          </p>
        </div>
      </div>

      {/* Keyframe animations */}
      <style jsx global>{`
        @keyframes meshDrift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes meshDrift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 30px) scale(1.08); }
          66% { transform: translate(30px, -20px) scale(0.92); }
        }
        @keyframes meshDrift3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -30px); }
        }
        @keyframes floatLine {
          0%, 100% { opacity: 0.5; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(20px); }
        }
      `}</style>
    </div>
  );
}
