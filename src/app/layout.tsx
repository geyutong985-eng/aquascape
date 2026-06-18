import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const harmonyOSSansSC = localFont({
  src: "../../public/fonts/HarmonyOS_Sans_SC.ttf",
  variable: "--font-harmonyos-sans-sc",
  weight: "100 900",
  display: "swap",
  fallback: ["Alibaba PuHuiTi", "Microsoft YaHei", "PingFang SC", "sans-serif"],
});

const alibabaPuHuiTi = localFont({
  src: [
    {
      path: "../../public/fonts/AlibabaPuHuiTi-3-55-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/AlibabaPuHuiTi-3-65-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/AlibabaPuHuiTi-3-75-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-alibaba-puhuiti",
  display: "swap",
  fallback: ["Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Finscape - 定制你的理想鱼缸造景",
  description: "用 AI 辅助设计鱼缸造景，实时预览 3D 效果，并通过 3D 打印交付你的专属作品。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`h-full antialiased ${harmonyOSSansSC.variable} ${alibabaPuHuiTi.variable}`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
