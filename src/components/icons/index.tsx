/**
 * Hugeicons 图标组件封装
 * 正确用法：导入具体图标 + HugeiconsIcon
 */

import { forwardRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeftIcon,
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
  FavouriteIcon,
  LocationIcon,
  Settings01Icon,
  LogoutIcon,
  CheckmarkCircle01Icon,
  Delete01Icon,
  Edit01Icon,
  Add01Icon,
  MailIcon,
  LockIcon,
  ArchiveIcon,
} from "@hugeicons/core-free-icons";

// ============ 预定义图标导出 ============

export const ArrowLeft = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={ArrowLeftIcon} {...props} />
);
ArrowLeft.displayName = "ArrowLeft";

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

export const Heart = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={FavouriteIcon} {...props} />
);
Heart.displayName = "Heart";

export const MapPin = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={LocationIcon} {...props} />
);
MapPin.displayName = "MapPin";

export const Settings = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={Settings01Icon} {...props} />
);
Settings.displayName = "Settings";

export const LogOut = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={LogoutIcon} {...props} />
);
LogOut.displayName = "LogOut";

export const Box = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={ArchiveIcon} {...props} />
);
Box.displayName = "Box";

export const Check = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={CheckmarkCircle01Icon} {...props} />
);
Check.displayName = "Check";

export const Trash = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={Delete01Icon} {...props} />
);
Trash.displayName = "Trash";

export const Edit = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={Edit01Icon} {...props} />
);
Edit.displayName = "Edit";

export const Plus = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={Add01Icon} {...props} />
);
Plus.displayName = "Plus";

export const Mail = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={MailIcon} {...props} />
);
Mail.displayName = "Mail";

export const Lock = forwardRef<SVGSVGElement, { className?: string }>((props, ref) =>
  <HugeiconsIcon ref={ref} icon={LockIcon} {...props} />
);
Lock.displayName = "Lock";