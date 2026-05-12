"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, Close, User } from "@/components/icons";
import { createSupabaseClient } from "@/lib/supabase/client";

export function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string; user_metadata?: { name?: string } } | null>(null);
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

  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "User";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm pt-2">
      <div className="max-w-7xl mx-auto px-4 md:px-9 h-16 flex items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full border-2 border-brand flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-3 h-3 rounded-full bg-brand" />
          </div>
          <span className="text-lg text-foreground font-semibold">Aquascape</span>
        </Link>

        {/* Desktop Navigation - left aligned after logo */}
        <div className="hidden md:flex items-center gap-6 ml-8">
          <Link href="#showcase" className="text-muted-foreground hover:text-foreground transition-colors text-base font-semibold">Gallery</Link>
          <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors text-base font-semibold">About</Link>
          <Link href="/customize" className="text-muted-foreground hover:text-foreground transition-colors text-base font-semibold">Design</Link>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Desktop Auth - Loading or Authenticated */}
        <div className="hidden md:flex items-center gap-5">
          <Link href="/ask-ai" className="text-foreground hover:text-foreground transition-colors text-base font-normal bg-background/60 border border-border/80 rounded-md px-3 py-1.5">Ask AI</Link>

          {!loading && (
            <>
              {user ? (
                // Logged in - show user avatar and sign out
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-foreground" />
                    </div>
                    <span className="text-foreground font-medium">{userName}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-muted-foreground hover:text-foreground transition-colors text-base font-normal"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                // Not logged in - show login/register buttons
                <>
                  <Link href="/login" className="text-foreground hover:text-foreground transition-colors text-base font-normal bg-background/60 border border-border/80 rounded-md px-3 py-1.5">Sign in</Link>
                  <Link href="/register">
                    <Button size="default">
                      Sign up
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
              <Link href="#showcase" className="text-muted-foreground hover:text-foreground transition-colors text-base font-semibold py-2" onClick={() => setMobileMenuOpen(false)}>Gallery</Link>
              <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors text-base font-semibold py-2" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <Link href="/customize" className="text-muted-foreground hover:text-foreground transition-colors text-base font-semibold py-2" onClick={() => setMobileMenuOpen(false)}>Design</Link>
              <div className="border-t border-border/30 my-2" />
              <Link href="/ask-ai" className="text-foreground transition-colors text-base font-normal bg-background/60 border border-border/80 rounded-md px-3 py-2" onClick={() => setMobileMenuOpen(false)}>Ask AI</Link>

              {!loading && (
                <>
                  {user ? (
                    <>
                      <div className="border-t border-border/30 my-2" />
                      <div className="flex items-center gap-2 py-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-foreground" />
                        </div>
                        <span className="text-foreground font-medium">{userName}</span>
                      </div>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setMobileMenuOpen(false);
                        }}
                        className="text-foreground transition-colors text-base font-normal bg-background/60 border border-border/80 rounded-md px-3 py-2 w-full text-left"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="text-foreground transition-colors text-base font-normal bg-background/60 border border-border/80 rounded-md px-3 py-2" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full">
                          Sign up
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