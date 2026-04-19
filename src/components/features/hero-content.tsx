"use client";

import { ReactNode } from "react";

interface HeroContentProps {
  children: ReactNode;
}

export function HeroContent({ children }: HeroContentProps) {
  return (
    <div className="animate-float">
      {children}
    </div>
  );
}