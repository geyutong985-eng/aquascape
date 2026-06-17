"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, Close } from "@/components/icons";
import { UserAvatar } from "@/components/ui/user-avatar";
import { createSupabaseClient } from "@/lib/supabase/client";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string; user_metadata?: { name?: string; avatar_url?: string; picture?: string } } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseClient();

    // First try to get the session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "用户";
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const isGallery = pathname?.startsWith("/gallery");
  const isMembership = pathname?.startsWith("/membership");
  const navLinkClass = (active = false, extra = "") =>
    `${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"} transition-colors text-base font-semibold ${extra}`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm pt-2">
      <div className="max-w-7xl mx-auto px-4 md:px-9 h-16 flex items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <svg width="34" height="20" viewBox="0 0 387 217" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand">
            <g style={{mixBlendMode: 'overlay'}}>
              <path d="M13.3876 165.94C13.3876 165.94 58.3363 127.764 103.285 127.764C168.889 127.764 217.477 204.116 283.08 204.116C328.029 204.116 372.978 165.94 372.978 165.94" stroke="currentColor" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.3876 51.1167C13.3876 51.1167 58.3363 12.9404 103.285 12.9404C168.889 12.9404 217.477 89.2931 283.08 89.2931C328.029 89.2931 372.978 51.1167 372.978 51.1167" stroke="currentColor" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <g style={{mixBlendMode: 'overlay'}} opacity="0.5">
              <path d="M13.3876 165.94C13.3876 165.94 58.3363 127.764 103.285 127.764C168.889 127.764 217.477 204.116 283.08 204.116C328.029 204.116 372.978 165.94 372.978 165.94" stroke="currentColor" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.3876 51.1167C13.3876 51.1167 58.3363 12.9404 103.285 12.9404C168.889 12.9404 217.477 89.2931 283.08 89.2931C328.029 89.2931 372.978 51.1167 372.978 51.1167" stroke="currentColor" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
          </svg>
          <span className="text-lg text-brand font-semibold font-heading">Finscape</span>
        </Link>

        {/* Desktop Navigation - left aligned after logo */}
        <div className="hidden md:flex items-center gap-6 ml-8">
          <Link href="/gallery" className={navLinkClass(isGallery)}>灵感图库</Link>
          <Link href="/membership" className={navLinkClass(isMembership)}>会员方案</Link>
          <Link href="/#about" className="text-muted-foreground hover:text-foreground transition-colors text-base font-semibold">关于我们</Link>
          <Link href="/customize" className="text-muted-foreground hover:text-foreground transition-colors text-base font-semibold">开始设计</Link>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Desktop Auth - Loading or Authenticated */}
        <div className="hidden md:flex items-center gap-5">
          <Link href="/ask-ai" className="text-foreground hover:text-foreground transition-colors text-base font-normal bg-background/60 border border-border/80 rounded-md px-3 py-1.5">问问 AI</Link>

          {!loading && (
            <>
              {user ? (
                // Logged in - show user avatar and link to profile
                <Link href="/profile" className="flex items-center gap-2 text-sm">
                    <UserAvatar name={userName} email={user.email} avatarUrl={avatarUrl} className="w-8 h-8" />
                    <span className="text-foreground font-medium">{userName}</span>
                  </Link>
              ) : (
                // Not logged in - show login/register buttons
                <>
                  <Link href="/login" className="text-foreground hover:text-foreground transition-colors text-base font-normal bg-background/60 border border-border/80 rounded-md px-3 py-1.5">登录</Link>
                  <Link href="/register">
                    <Button size="default">
                      注册
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <Close className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border/30 md:hidden">
            <div className="flex flex-col p-4 gap-4">
              <Link href="/gallery" className={navLinkClass(isGallery, "py-2")} onClick={() => setMobileMenuOpen(false)}>灵感图库</Link>
              <Link href="/membership" className={navLinkClass(isMembership, "py-2")} onClick={() => setMobileMenuOpen(false)}>会员方案</Link>
              <Link href="/#about" className="text-muted-foreground hover:text-foreground transition-colors text-base font-semibold py-2" onClick={() => setMobileMenuOpen(false)}>关于我们</Link>
              <Link href="/customize" className="text-muted-foreground hover:text-foreground transition-colors text-base font-semibold py-2" onClick={() => setMobileMenuOpen(false)}>开始设计</Link>
              <div className="border-t border-border/30 my-2" />
              <Link href="/ask-ai" className="text-foreground transition-colors text-base font-normal bg-background/60 border border-border/80 rounded-md px-3 py-2" onClick={() => setMobileMenuOpen(false)}>问问 AI</Link>

              {!loading && (
                <>
                  {user ? (
                    <>
                      <div className="border-t border-border/30 my-2" />
                      <div className="flex items-center gap-2 py-2">
                        <UserAvatar name={userName} email={user.email} avatarUrl={avatarUrl} className="w-8 h-8" />
                        <span className="text-foreground font-medium">{userName}</span>
                      </div>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setMobileMenuOpen(false);
                        }}
                        className="text-foreground transition-colors text-base font-normal bg-background/60 border border-border/80 rounded-md px-3 py-2 w-full text-left"
                      >
                        退出登录
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="text-foreground transition-colors text-base font-normal bg-background/60 border border-border/80 rounded-md px-3 py-2" onClick={() => setMobileMenuOpen(false)}>登录</Link>
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full">
                          注册
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
