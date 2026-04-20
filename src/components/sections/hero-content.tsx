/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";

interface HeroContentProps {
  children: React.ReactNode;
}

export function HeroContent({ children }: HeroContentProps) {
  // 初始化时设为 true，避免 hydration 不匹配
  // useEffect 仅用于确保客户端挂载后更新
  const [mounted, setMounted] = useState(true);

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