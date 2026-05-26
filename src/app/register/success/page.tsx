"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/layouts";

interface RegisterSuccessPageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function RegisterSuccessPage(props: RegisterSuccessPageProps) {
  const searchParams = await props.searchParams;
  const email = searchParams.email || "";

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8">
          <BrandLogo centered />
        </div>

        {/* Card */}
        <div className="bg-card rounded-xl border p-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-medium text-foreground text-center mb-2">
            Check your email
          </h1>
          <p className="text-muted-foreground text-center text-sm mb-2">
            We&apos;ve sent a verification link to
          </p>
          <p className="text-foreground text-center text-sm font-medium mb-6">
            {email}
          </p>
          <p className="text-muted-foreground text-center text-sm">
            Please verify your email to continue.
          </p>

          <Link href="/" className="mt-8 block">
            <Button className="w-full">
              Back to home
            </Button>
          </Link>
        </div>

        {/* Back to login */}
        <div className="mt-6 text-center">
          <Link href="/login" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
            ← Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
