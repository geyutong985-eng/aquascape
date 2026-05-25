"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Lock, LogOut } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { createSupabaseClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string; user_metadata?: { name?: string } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [savedName, setSavedName] = useState(""); // Track what we've successfully saved
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      const initialName = session?.user?.user_metadata?.name || "";
      setName(initialName);
      setSavedName(initialName);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.updateUser({ data: { name } });

    if (error) {
      alert(error.message);
    } else {
      setSavedName(name); // Update what we've saved
    }
    setSaving(false);
  };

  // Determine button state
  const hasChanges = name !== savedName;
  const buttonDisabled = !hasChanges || saving;

  const handleSignOut = async () => {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/profile" className="p-2 hover:bg-accent rounded-md transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-medium text-foreground">设置</h1>
          <p className="text-sm text-muted-foreground">管理你的账户设置</p>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-card rounded-xl border p-4 mb-4">
        <h2 className="font-medium text-foreground mb-4">账户信息</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">显示名称</Label>
            <Input
              id="name"
              placeholder="你的名称"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>邮箱</Label>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>{user?.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={hasChanges ? handleSave : undefined}
              variant={hasChanges ? "default" : "outline"}
            >
              {saving ? "保存中..." : hasChanges ? "保存" : "已保存"}
            </Button>
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="bg-card rounded-xl border p-4 mb-4">
        <h2 className="font-medium text-foreground mb-4">密码</h2>
        <p className="text-sm text-muted-foreground mb-4">
          点击下方按钮跳转到密码重置页面
        </p>
        <Link href="https://supabase.com/dashboard/auth/settings" target="_blank">
          <Button variant="outline">
            <Lock className="w-4 h-4 mr-2" />
            在 Supabase 修改密码
          </Button>
        </Link>
      </div>

      {/* Sign Out */}
      <div className="bg-card rounded-xl border p-4">
        <h2 className="font-medium text-foreground mb-4">退出登录</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="hover:bg-red-500 hover:text-white transition-colors">
              <LogOut className="w-4 h-4 mr-2" />
              退出登录
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确定要退出登录吗？</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={handleSignOut}>
                确定退出
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}