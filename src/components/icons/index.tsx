/**
 * Hugeicons 图标组件封装
 * 正确用法：导入具体图标 + HugeiconsIcon
 */

import { forwardRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRightIcon,
  ArrowDownIcon,
  ArrowDiagonalIcon,
  ArrowUpRight01Icon,
  EyeIcon,
  SparklesIcon,
  FactoryIcon,
  CubeIcon,
  HomeIcon,
  MenuIcon,
  UserIcon,
  PenToolIcon,
  MagicWandIcon,
} from "@hugeicons/core-free-icons";

// ============ 预定义图标导出 ============

export const ArrowRight = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={ArrowRightIcon} {...props} />
);
ArrowRight.displayName = "ArrowRight";

export const ArrowDown = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={ArrowDownIcon} {...props} />
);
ArrowDown.displayName = "ArrowDown";

export const ArrowUpRight = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={ArrowUpRight01Icon} {...props} />
);
ArrowUpRight.displayName = "ArrowUpRight";

export const ArrowDiagonal = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={ArrowDiagonalIcon} {...props} />
);
ArrowDiagonal.displayName = "ArrowDiagonal";

export const ArrowTurnRight = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={ArrowRightIcon} {...props} />
);
ArrowTurnRight.displayName = "ArrowTurnRight";

export const Eye = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={EyeIcon} {...props} />
);
Eye.displayName = "Eye";

export const Sparkles = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={SparklesIcon} {...props} />
);
Sparkles.displayName = "Sparkles";

export const Factory = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={FactoryIcon} {...props} />
);
Factory.displayName = "Factory";

export const Cube = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={CubeIcon} {...props} />
);
Cube.displayName = "Cube";

export const PenTool = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={PenToolIcon} {...props} />
);
PenTool.displayName = "PenTool";

export const MagicWand = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={MagicWandIcon} {...props} />
);
MagicWand.displayName = "MagicWand";

export const Home = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={HomeIcon} {...props} />
);
Home.displayName = "Home";

export const Menu = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={MenuIcon} {...props} />
);
Menu.displayName = "Menu";

export const Close = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={MenuIcon} {...props} />
);
Close.displayName = "Close";

export const User = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={UserIcon} {...props} />
);
User.displayName = "User";

export const Users = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={UserIcon} {...props} />
);
Users.displayName = "Users";

// 双箭头（用于 marquee hover）
export const DoubleArrowRight = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={ArrowRightIcon} {...props} />
);
DoubleArrowRight.displayName = "DoubleArrowRight";