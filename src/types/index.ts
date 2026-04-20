/**
 * Aquascape 类型定义
 * 集中管理项目中复用的接口类型
 */

/** 展示作品项目 */
export interface ShowcaseItem {
  id: number;
  title: string;
  style: string;
  author: string;
  height: "tall" | "medium" | "short";
}

/** 功能特性项目 */
export interface FeatureItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}

/** 导航链接 */
export interface NavLink {
  label: string;
  href: string;
}

/** 按钮变体 */
export type ButtonVariant = "default" | "brand" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "stroke";

/** 按钮尺寸 */
export type ButtonSize = "default" | "sm" | "lg" | "xl" | "2xl" | "icon" | "icon-lg" | "icon-xl";