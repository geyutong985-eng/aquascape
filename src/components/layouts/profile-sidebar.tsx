"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { User, Box, Heart, MapPin, Settings, LogOut, Menu, Close } from "@/components/icons";
import { createSupabaseClient } from "@/lib/supabase/client";
import { UserAvatar } from "@/components/ui/user-avatar";

const navItems = [
  { href: "/profile", label: "个人中心", icon: User },
  { href: "/profile/designs", label: "我的设计", icon: Box },
  { href: "/profile/orders", label: "我的订单", icon: Box },
  { href: "/profile/favorites", label: "我的收藏", icon: Heart },
  { href: "/profile/addresses", label: "收货地址", icon: MapPin },
  { href: "/profile/settings", label: "设置", icon: Settings },
];

export function ProfileSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string; user_metadata?: { name?: string; avatar_url?: string; picture?: string } } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async (onSuccess?: () => void) => {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
    onSuccess?.();
  };

  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "用户";
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  return (
    <>
      <button
        className="md:hidden fixed top-2 left-4 z-50 p-2 bg-background border rounded-md"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="菜单"
      >
        {mobileMenuOpen ? <Close className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside
        className={`
          fixed top-0 left-0 bottom-0 w-56 bg-background/90 backdrop-blur-sm border-r z-40
          transform transition-transform duration-300 ease-out-expo
          md:translate-x-0
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-9 h-16 flex items-center pt-4">
          <Link href="/" className="flex items-center gap-3 group">
            <svg width="34" height="20" viewBox="0 0 387 217" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand">
              <g style={{ mixBlendMode: "overlay" }}>
                <path d="M13.3876 165.94C13.3876 165.94 58.3363 127.764 103.285 127.764C168.889 127.764 217.477 204.116 283.08 204.116C328.029 204.116 372.978 165.94 372.978 165.94" stroke="currentColor" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.3876 51.1167C13.3876 51.1167 58.3363 12.9404 103.285 12.9404C168.889 12.9404 217.477 89.2931 283.08 89.2931C328.029 89.2931 372.978 51.1167 372.978 51.1167" stroke="currentColor" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round" />
              </g>
              <g style={{ mixBlendMode: "overlay" }} opacity="0.5">
                <path d="M13.3876 165.94C13.3876 165.94 58.3363 127.764 103.285 127.764C168.889 127.764 217.477 204.116 283.08 204.116C328.029 204.116 372.978 165.94 372.978 165.94" stroke="currentColor" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.3876 51.1167C13.3876 51.1167 58.3363 12.9404 103.285 12.9404C168.889 12.9404 217.477 89.2931 283.08 89.2931C328.029 89.2931 372.978 51.1167 372.978 51.1167" stroke="currentColor" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </svg>
            <span className="text-lg text-brand font-semibold font-heading">Finscape</span>
          </Link>
        </div>

        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <UserAvatar name={userName} email={user?.email} avatarUrl={avatarUrl} className="w-10 h-10" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/profile" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200
                  ${isActive
                    ? "bg-primary/10 text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <LogOut className="w-4 h-4" />
                退出登录
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>确定要退出登录吗？</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction onClick={() => { handleSignOut(() => { setMobileMenuOpen(false); router.push("/"); }); }}>
                  确定退出
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
