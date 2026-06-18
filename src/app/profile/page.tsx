"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Box, Heart, MapPin, Settings, Plus } from "@/components/icons";
import { createSupabaseClient } from "@/lib/supabase/client";

const stats = [
  { label: "我的设计", value: "0", href: "/profile/designs", icon: Box, accent: true },
  { label: "我的订单", value: "0", href: "/profile/orders", icon: Box, accent: false },
  { label: "我的收藏", value: "0", href: "/profile/favorites", icon: Heart, accent: false },
];

const menuItems = [
  { label: "收货地址", href: "/profile/addresses", icon: MapPin, desc: "管理收货地址" },
  { label: "设置", href: "/profile/settings", icon: Settings, desc: "账户设置" },
];

const EmptyState = ({ label, href }: { label: string; href: string }) => (
  <Link
    href={href}
    className="group relative overflow-hidden bg-card rounded-xl border border-dashed p-8 hover:border-brand/50 transition-all duration-300"
  >
    <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative flex flex-col items-center justify-center gap-3">
      <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <Plus className="w-6 h-6 text-brand" />
      </div>
      <p className="text-muted-foreground group-hover:text-foreground transition-colors">还没有{label}，点击创建</p>
    </div>
  </Link>
);

export default function ProfilePage() {
  const [user, setUser] = useState<{ email?: string; user_metadata?: { name?: string } } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">请先登录</p>
          <Link href="/login" className="text-primary hover:underline">
            前往登录
          </Link>
        </div>
      </div>
    );
  }

  const userName = user.user_metadata?.name || user.email?.split("@")[0] || "用户";

  return (
    <div className="max-w-3xl">
      {/* Arrow and title on same row */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/" className="p-2 hover:bg-accent rounded-md transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-medium text-foreground">个人中心</h1>
      </div>

      <header className="mb-12">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          欢迎回来，{userName}
        </h1>
        <p className="text-muted-foreground text-lg">
          管理你的设计和订单
        </p>
      </header>

      {/* Stats - 卡片大小变化 + 空状态 */}
      <section className="mb-12">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">概览</h2>
        <div className="grid grid-cols-3 auto-rows-fr gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isZero = stat.value === "0";

            if (isZero) {
              return (
                <EmptyState key={stat.href} label={stat.label} href={stat.href} />
              );
            }

            return (
              <Link
                key={stat.href}
                href={stat.href}
                className={`
                  bg-card rounded-xl border p-4 hover:border-brand/50 transition-all duration-300
                  hover:shadow-lg hover:shadow-brand/5
                  ${index === 0 ? 'row-span-2' : ''}
                `}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center mb-3
                  ${stat.accent ? 'bg-brand/10' : 'bg-primary/10'}
                `}>
                  <Icon className={`w-5 h-5 ${stat.accent ? 'text-brand' : 'text-foreground'}`} />
                </div>
                <p className="text-2xl font-medium text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Menu */}
      <section className="mt-12">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">快捷操作</h2>
        <div className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 bg-card rounded-xl border p-4 hover:border-primary/30 transition-colors"
              >
                <Icon className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-foreground font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
