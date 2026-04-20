"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className="w-full max-w-sm transition-all duration-1000 ease-out-expo"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(24px)",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 rounded-full border-2 border-brand flex items-center justify-center">
            <div className="w-3.5 h-3.5 rounded-full bg-brand" />
          </div>
        </Link>

        {/* Card */}
        <div className="bg-card rounded-xl border p-8">
          <h1 className="text-2xl font-medium text-foreground text-center mb-2">
            Create an account
          </h1>
          <p className="text-muted-foreground text-center text-sm mb-8">
            Enter your details to get started
          </p>

          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="Your name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>

            <Button className="w-full">Create account</Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="text-foreground hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}