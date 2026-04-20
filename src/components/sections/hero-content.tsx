/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";

interface HeroContentProps {
  children: React.ReactNode;
}

export function HeroContent({ children }: HeroContentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="transition-all duration-1000 ease-out-expo"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(24px)",
      }}
    >
      {children}
    </div>
  );
}