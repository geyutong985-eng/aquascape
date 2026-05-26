"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandLogo } from "@/components/layouts";
import { createSupabaseClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createSupabaseClient();

    try {
      // Step 1: Check if user exists by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // If sign in succeeds, user already exists
      if (!signInError) {
        // Already logged in from the check, just redirect to home
        router.push("/");
        return;
      }

      // Sign in failed - check if it's "user doesn't exist" or "wrong password"
      const errorMsg = signInError.message.toLowerCase();

      if (errorMsg.includes("invalid")) {
        // "Invalid login credentials" - could mean:
        // 1. User exists but password is wrong
        // 2. User doesn't exist at all
        // We can't distinguish, but this is fine - proceed with signup
        // If user exists, Supabase will return an error (handled below)
      }

      // Step 2: Try to sign up
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      // Handle signUp errors (like duplicate email)
      if (signUpError) {
        const signupErrorMsg = signUpError.message.toLowerCase();
        const errorCode = signUpError.code;

        if (errorCode === "user_already_exists" ||
            signupErrorMsg.includes("user already") ||
            signupErrorMsg.includes("already exists") ||
            signupErrorMsg.includes("already been taken") ||
            signupErrorMsg.includes("duplicate") ||
            signupErrorMsg.includes("already registered") ||
            signupErrorMsg.includes("email address is already")) {
          setError("This email is already registered. Please sign in instead.");
        } else {
          setError(signUpError.message);
        }
        setLoading(false);
        return;
      }

      // If no user returned, something went wrong
      if (!data?.user) {
        setError("Unable to create account. Please try again.");
        setLoading(false);
        return;
      }

      // Success - check if email verification is needed
      if (!data.session) {
        router.push(`/register/success?email=${encodeURIComponent(email)}`);
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <BrandLogo centered />
        </div>

        <div className="bg-card rounded-xl border p-8">
          <h1 className="text-2xl font-medium text-foreground text-center mb-2">
            Create an account
          </h1>
          <p className="text-muted-foreground text-center text-sm mb-8">
            Enter your details to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="text-sm">
                <p className="text-destructive">{error}</p>
                {error.includes("already registered") && (
                  <Link href="/login" className="text-foreground hover:underline mt-2 block">
                    Go to sign in →
                  </Link>
                )}
              </div>
            )}

            <Button className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="text-foreground hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
