/**
 * Finscape 类型定义
 * 集中管理项目中复用的接口类型
 */

/** 展示作品项目 */
export interface ShowcaseItem {
  id: string;
  title: string;
  style: string;
  author: string;
  height: "tall" | "medium" | "short";
  priceMin?: number;
  priceMax?: number;
  materials?: string[];
  colors?: DesignColor[];
  modelCount?: number;
  coverImage?: string;
}

export type DesignAuthorType = "official" | "user";

export interface TankSize {
  length: number;
  width: number;
  height: number;
}

export interface DesignColor {
  name: string;
  value: string;
}

export interface DesignModel {
  name: string;
  tags: string[];
  price: number;
  material: string;
  color: DesignColor;
  modelPath?: string;
}

export interface Design {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  galleryImages: string[];
  author: string;
  authorType: DesignAuthorType;
  isFeatured: boolean;
  isPublic: boolean;
  style: string;
  height: "tall" | "medium" | "short";
  tankSize: TankSize;
  models: DesignModel[];
  materials: string[];
  colors: DesignColor[];
  priceMin: number;
  priceMax: number;
  viewCount: number;
  createdAt: string;
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
