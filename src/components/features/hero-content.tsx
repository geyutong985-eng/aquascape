"use client";

import { ReactNode, useEffect, useState } from "react";

interface HeroContentProps {
  children: ReactNode;
}

export function HeroContent({ children }: HeroContentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="transition-all duration-700 ease-out-expo"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(20px)",
      }}
    >
      {children}
    </div>
  );
}