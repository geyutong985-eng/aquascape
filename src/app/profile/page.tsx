"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Heart, MapPin, Settings, ArrowRight } from "@/components/icons";
import { createSupabaseClient } from "@/lib/supabase/client";

const stats = [
  { label: "我的设计", value: "0", href: "/profile/designs", icon: Box },
  { label: "我的订单", value: "0", href: "/profile/orders", icon: Box },
  { label: "我的收藏", value: "0", href: "/profile/favorites", icon: Heart },
];

const menuItems = [
  { label: "收货地址", href: "/profile/addresses", icon: MapPin, desc: "管理收货地址" },
  { label: "设置", href: "/profile/settings", icon: Settings, desc: "账户设置" },
];

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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-foreground mb-1">
          欢迎回来，{userName}
        </h1>
        <p className="text-muted-foreground">
          管理你的设计和订单
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.href}
              href={stat.href}
              className="bg-card rounded-xl border p-4 hover:border-primary/30 transition-colors"
            >
              <Icon className="w-5 h-5 text-muted-foreground mb-2" />
              <p className="text-2xl font-medium text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Menu */}
      <div className="space-y-2">
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
    </div>
  );
}