"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import {
  ArrowLeft,
  CheckCircle2,
  CircleDollarSign,
  Crown,
  Download,
  Maximize2,
  Minimize2,
  Lock,
  MessageSquareText,
  Move3D,
  PackagePlus,
  Rotate3D,
  RotateCcw,
  Save,
  Send,
  ShoppingCart,
  Sparkles,
  SquareDashedMousePointer,
  StretchHorizontal,
  Trash2,
  Undo2,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createCheckoutDraftId, saveCheckoutDraft } from "@/lib/checkout"

const ThreeCanvas = dynamic(() => import("@/components/3d/editor-canvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        <p className="text-sm text-muted-foreground">正在加载 3D 鱼缸预览...</p>
      </div>
    </div>
  ),
})

const ModelCardPreview = dynamic(() => import("@/components/3d/model-card-preview"), {
  ssr: false,
  loading: () => <PackagePlus className="h-8 w-8 text-brand/70" />,
})

type MembershipTier = "free" | "vip" | "svip"

type CatalogModel = {
  name: string
  tags: string[]
  price: number
  modelPath?: string
  previewImage?: string
  requiredTier?: Exclude<MembershipTier, "free">
  desc?: string
  materialHint?: string
  tankHint?: string
}

type StyleGroup = {
  name: string
  models: CatalogModel[]
  requiredTier?: Exclude<MembershipTier, "free">
  desc?: string
}

const CURRENT_MEMBERSHIP: MembershipTier = "free"
const membershipRank: Record<MembershipTier, number> = { free: 0, vip: 1, svip: 2 }
const membershipLabel: Record<Exclude<MembershipTier, "free">, string> = { vip: "VIP", svip: "SVIP" }
const membershipDesc: Record<Exclude<MembershipTier, "free">, string> = {
  vip: "开通 VIP 解锁全部会员模型，并优先体验新模型。",
  svip: "升级 SVIP 解锁高级收藏模型、限量款优先购和定制服务。",
}

function canAccessTier(requiredTier?: Exclude<MembershipTier, "free">) {
  if (!requiredTier) return true
  return membershipRank[CURRENT_MEMBERSHIP] >= membershipRank[requiredTier]
}

const styleGroups: StyleGroup[] = [
  {
    name: "神秘洞穴",
    models: [
      {
        name: "幽灵脸洞",
        tags: [
          "穿行",
          "躲藏"
        ],
        price: 89,
        modelPath: "/models/mysterious-caves/ghost-face-cave/model.glb",
        previewImage: "/models/mysterious-caves/ghost-face-cave/preview.png"
      },
      {
        name: "怪兽洞穴",
        tags: [
          "躲藏",
          "堆叠"
        ],
        price: 99,
        modelPath: "/models/mysterious-caves/monster-cave/model.glb",
        previewImage: "/models/mysterious-caves/monster-cave/preview.png"
      },
      {
        name: "表情凹陷块",
        tags: [
          "点缀",
          "躲藏"
        ],
        price: 79,
        modelPath: "/models/mysterious-caves/expression-recess-block/model.glb",
        previewImage: "/models/mysterious-caves/expression-recess-block/preview.png"
      },
      {
        name: "多孔洞洞穴 1",
        tags: [
          "穿行",
          "躲藏"
        ],
        price: 109,
        modelPath: "/models/mysterious-caves/multi-hole-cave-1/model.glb",
        previewImage: "/models/mysterious-caves/multi-hole-cave-1/preview.png"
      },
      {
        name: "多孔洞洞穴 2",
        tags: [
          "穿行",
          "躲藏"
        ],
        price: 109,
        modelPath: "/models/mysterious-caves/multi-hole-cave-2/model.glb",
        previewImage: "/models/mysterious-caves/multi-hole-cave-2/preview.png"
      },
      {
        name: "悬空桥洞",
        tags: [
          "穿行",
          "悬挂"
        ],
        price: 119,
        modelPath: "/models/mysterious-caves/suspended-bridge-cave/model.glb",
        previewImage: "/models/mysterious-caves/suspended-bridge-cave/preview.png"
      }
    ]
  },
  {
    name: "轻盈典雅",
    models: [
      {
        name: "圆润曲块",
        tags: [
          "点缀",
          "堆叠"
        ],
        price: 69,
        modelPath: "/models/light-elegance/rounded-curve-block/model.glb",
        previewImage: "/models/light-elegance/rounded-curve-block/preview.png"
      },
      {
        name: "抽象花瓣形",
        tags: [
          "点缀",
          "悬挂"
        ],
        price: 88,
        modelPath: "/models/light-elegance/abstract-petal/model.glb",
        previewImage: "/models/light-elegance/abstract-petal/preview.png"
      },
      {
        name: "泡泡造型",
        tags: [
          "点缀",
          "躲藏"
        ],
        price: 76,
        modelPath: "/models/light-elegance/bubble-form/model.glb",
        previewImage: "/models/light-elegance/bubble-form/preview.png"
      },
      {
        name: "小巧雕塑体块",
        tags: [
          "点缀"
        ],
        price: 66,
        modelPath: "/models/light-elegance/small-sculptural-block/model.glb",
        previewImage: "/models/light-elegance/small-sculptural-block/preview.png"
      }
    ]
  },
  {
    name: "几何艺术",
    models: [
      {
        name: "环体拱门",
        tags: [
          "穿行",
          "点缀"
        ],
        price: 98,
        modelPath: "/models/geometric-art/ring-arch/model.glb",
        previewImage: "/models/geometric-art/ring-arch/preview.png"
      },
      {
        name: "波纹墙",
        tags: [
          "躲藏",
          "悬挂"
        ],
        price: 95,
        modelPath: "/models/geometric-art/ripple-wall/model.glb",
        previewImage: "/models/geometric-art/ripple-wall/preview.png"
      },
      {
        name: "网格塔",
        tags: [
          "堆叠",
          "躲藏"
        ],
        price: 105,
        modelPath: "/models/geometric-art/grid-tower/model.glb",
        previewImage: "/models/geometric-art/grid-tower/preview.png"
      },
      {
        name: "柱阵块",
        tags: [
          "堆叠",
          "点缀"
        ],
        price: 86,
        modelPath: "/models/geometric-art/column-array-block/model.glb",
        previewImage: "/models/geometric-art/column-array-block/preview.png"
      }
    ]
  },
  {
    name: "自然有机",
    models: [
      {
        name: "扭曲枝条",
        tags: [
          "悬挂",
          "点缀"
        ],
        price: 92,
        modelPath: "/models/organic-nature/twisted-branch/model.glb",
        previewImage: "/models/organic-nature/twisted-branch/preview.png"
      },
      {
        name: "贝壳洞",
        tags: [
          "躲藏",
          "穿行"
        ],
        price: 89,
        modelPath: "/models/organic-nature/shell-cave/model.glb",
        previewImage: "/models/organic-nature/shell-cave/preview.png"
      },
      {
        name: "珊瑚骨架",
        tags: [
          "穿行",
          "点缀"
        ],
        price: 118,
        modelPath: "/models/organic-nature/coral-skeleton/model.glb",
        previewImage: "/models/organic-nature/coral-skeleton/preview.png"
      },
      {
        name: "菌菇洞",
        tags: [
          "躲藏",
          "堆叠"
        ],
        price: 96,
        modelPath: "/models/organic-nature/mushroom-cave/model.glb",
        previewImage: "/models/organic-nature/mushroom-cave/preview.png"
      }
    ]
  },
  {
    name: "微型遗迹",
    models: [
      {
        name: "小型拱门",
        tags: [
          "穿行",
          "点缀"
        ],
        price: 82,
        modelPath: "/models/miniature-ruins/small-arch/model.glb",
        previewImage: "/models/miniature-ruins/small-arch/preview.png"
      },
      {
        name: "塔尖模块",
        tags: [
          "堆叠",
          "点缀"
        ],
        price: 78,
        modelPath: "/models/miniature-ruins/spire-module/model.glb",
        previewImage: "/models/miniature-ruins/spire-module/preview.png"
      },
      {
        name: "断桥残柱",
        tags: [
          "穿行",
          "堆叠"
        ],
        price: 104,
        modelPath: "/models/miniature-ruins/broken-bridge-column/model.glb",
        previewImage: "/models/miniature-ruins/broken-bridge-column/preview.png"
      },
      {
        name: "石碑遗迹块",
        tags: [
          "点缀",
          "躲藏"
        ],
        price: 86,
        modelPath: "/models/miniature-ruins/stone-tablet-ruin/model.glb",
        previewImage: "/models/miniature-ruins/stone-tablet-ruin/preview.png"
      }
    ]
  },
  {
    name: "极简现代",
    models: [
      {
        name: "单体大块",
        tags: [
          "躲藏",
          "堆叠"
        ],
        price: 88,
        modelPath: "/models/minimal-modern/single-large-block/model.glb",
        previewImage: "/models/minimal-modern/single-large-block/preview.png"
      },
      {
        name: "留洞雕塑",
        tags: [
          "穿行",
          "点缀"
        ],
        price: 108,
        modelPath: "/models/minimal-modern/hollow-sculpture/model.glb",
        previewImage: "/models/minimal-modern/hollow-sculpture/preview.png"
      },
      {
        name: "曲面体块",
        tags: [
          "点缀",
          "堆叠"
        ],
        price: 94,
        modelPath: "/models/minimal-modern/curved-surface-block/model.glb",
        previewImage: "/models/minimal-modern/curved-surface-block/preview.png"
      },
      {
        name: "悬浮体块",
        tags: [
          "悬挂",
          "点缀"
        ],
        price: 112,
        modelPath: "/models/minimal-modern/floating-block/model.glb",
        previewImage: "/models/minimal-modern/floating-block/preview.png"
      }
    ]
  },
  {
    name: "生态仿真升级",
    requiredTier: "vip",
    desc: "更精细、更仿真、更大型的生态主景模型。",
    models: [
      { name: "超仿真岩石 A型", tags: ["仿真", "主景"], price: 139, requiredTier: "vip", desc: "高细节仿真岩石，纹理丰富自然", materialHint: "低反光哑光 / 高强度尼龙", tankHint: "60cm+" },
      { name: "超仿真岩石 B型", tags: ["仿真", "组合"], price: 129, requiredTier: "vip", desc: "中型仿真岩石，适合组合", materialHint: "低反光哑光", tankHint: "45cm+" },
      { name: "仿真流木", tags: ["自然", "主景"], price: 159, requiredTier: "vip", desc: "仿真沉木纹理，可做主景", materialHint: "自然木纹", tankHint: "60cm+" },
      { name: "仿真枯木", tags: ["自然", "造景"], price: 149, requiredTier: "vip", desc: "枯死木纹理，造型独特", materialHint: "自然木纹", tankHint: "45cm+" },
      { name: "仿真石块组合", tags: ["组合", "拼接"], price: 129, requiredTier: "vip", desc: "5-8块小型仿真石，可自由拼接", materialHint: "低反光哑光", tankHint: "30cm+" },
      { name: "巨型珊瑚骨架", tags: ["大型", "焦点"], price: 199, requiredTier: "vip", desc: "大型仿真珊瑚，震撼视觉", materialHint: "基础塑料质感 / 哑光树脂", tankHint: "90cm+" },
      { name: "巨型树枝造型", tags: ["大型", "自然"], price: 209, requiredTier: "vip", desc: "超大扭曲树枝，可做主景焦点", materialHint: "自然木纹 / 低反光哑光", tankHint: "90cm+" },
      { name: "大型贝壳组合", tags: ["仿真", "组合"], price: 189, requiredTier: "vip", desc: "仿真巨型贝壳，精致细节", materialHint: "哑光树脂", tankHint: "60cm+" },
      { name: "远古化石块", tags: ["化石", "点缀"], price: 159, requiredTier: "vip", desc: "仿真古生物化石残骸", materialHint: "低反光哑光", tankHint: "60cm+" },
      { name: "微缩山体", tags: ["山体", "主景"], price: 199, requiredTier: "vip", desc: "仿真小山，可做主景", materialHint: "低反光哑光", tankHint: "90cm+" },
      { name: "微缩岛屿", tags: ["岛屿", "场景"], price: 179, requiredTier: "vip", desc: "小型岛屿造型，带沙滩效果", materialHint: "低反光哑光 / 自然木纹", tankHint: "60cm+" },
      { name: "微型火山口", tags: ["火山", "焦点"], price: 139, requiredTier: "vip", desc: "仿真小型火山，可做焦点", materialHint: "哑光树脂", tankHint: "45cm+" },
      { name: "溶洞入口", tags: ["穿行", "主景"], price: 179, requiredTier: "vip", desc: "大型溶洞造型，内部可穿行", materialHint: "低反光哑光", tankHint: "60cm+" },
    ],
  },
  {
    name: "功能性组件",
    requiredTier: "vip",
    desc: "兼具庇护、繁殖、喂食和维护价值的功能模型。",
    models: [
      { name: "多功能躲避屋", tags: ["庇护", "多入口"], price: 119, requiredTier: "vip", desc: "多个入口，内部空间大", materialHint: "低反光哑光 / 哑光树脂", tankHint: "45cm+" },
      { name: "分层庇护所", tags: ["庇护", "分层"], price: 139, requiredTier: "vip", desc: "2-3层结构，可供多鱼种使用", materialHint: "低反光哑光", tankHint: "60cm+" },
      { name: "天然洞穴窝", tags: ["庇护", "仿真"], price: 109, requiredTier: "vip", desc: "仿真天然洞穴造型", materialHint: "低反光哑光", tankHint: "45cm+" },
      { name: "珊瑚缝隙群", tags: ["小鱼", "庇护"], price: 99, requiredTier: "vip", desc: "多个细小缝隙，适合小型鱼", materialHint: "基础塑料质感", tankHint: "30cm+" },
      { name: "繁殖洞穴", tags: ["繁殖", "私密"], price: 118, requiredTier: "vip", desc: "私密空间，促进鱼只繁殖", materialHint: "低反光哑光", tankHint: "45cm+" },
      { name: "产卵基座", tags: ["繁殖", "基座"], price: 98, requiredTier: "vip", desc: "专为产卵鱼设计的光滑基座", materialHint: "哑光树脂", tankHint: "45cm+" },
      { name: "幼鱼庇护网", tags: ["幼鱼", "保护"], price: 128, requiredTier: "vip", desc: "底部镂空结构，保护幼鱼", materialHint: "高强度尼龙", tankHint: "30cm+" },
      { name: "隔离繁殖盒", tags: ["繁殖", "隔离"], price: 158, requiredTier: "vip", desc: "可组合的繁殖隔离区", materialHint: "哑光树脂", tankHint: "60cm+" },
      { name: "自动喂食器底座", tags: ["喂食", "配件"], price: 89, requiredTier: "vip", desc: "配合自动喂食器使用的底座", materialHint: "基础塑料质感", tankHint: "任意" },
      { name: "食物扩散器", tags: ["喂食", "扩散"], price: 86, requiredTier: "vip", desc: "让食物均匀扩散的结构", materialHint: "基础塑料质感", tankHint: "45cm+" },
      { name: "换水辅助器", tags: ["维护", "导流"], price: 79, requiredTier: "vip", desc: "方便换水的导流结构", materialHint: "基础塑料质感", tankHint: "任意" },
      { name: "滤材支架", tags: ["维护", "支撑"], price: 118, requiredTier: "vip", desc: "多层结构滤材支撑架", materialHint: "高强度尼龙", tankHint: "60cm+" },
    ],
  },
  {
    name: "节日限定系列",
    requiredTier: "vip",
    desc: "春节、圣诞、万圣节和七夕主题限定模型。",
    models: [
      { name: "锦鲤跃龙门", tags: ["春节", "吉祥"], price: 168, requiredTier: "vip", desc: "锦鲤跳跃造型，吉祥寓意", materialHint: "珠光质感 / 梦幻渐变" },
      { name: "元宝山", tags: ["春节", "财运"], price: 138, requiredTier: "vip", desc: "元宝造型假山，聚财寓意", materialHint: "低反光哑光" },
      { name: "红灯笼串", tags: ["春节", "悬挂"], price: 118, requiredTier: "vip", desc: "小型红灯笼串，可悬挂", materialHint: "珠光质感" },
      { name: "祥云底座", tags: ["春节", "底座"], price: 108, requiredTier: "vip", desc: "祥云纹饰底座，吉祥如意", materialHint: "低反光哑光" },
      { name: "圣诞树礁石", tags: ["圣诞", "礁石"], price: 138, requiredTier: "vip", desc: "树形珊瑚礁石造型", materialHint: "珠光质感 / 基础塑料质感" },
      { name: "雪人礁石", tags: ["圣诞", "点缀"], price: 128, requiredTier: "vip", desc: "可爱雪人造型", materialHint: "基础塑料质感" },
      { name: "礼物宝箱", tags: ["圣诞", "宝箱"], price: 148, requiredTier: "vip", desc: "仿真宝箱，可打开", materialHint: "低反光哑光 / 哑光树脂" },
      { name: "驯鹿角珊瑚", tags: ["圣诞", "珊瑚"], price: 128, requiredTier: "vip", desc: "驯鹿角形态的珊瑚造型", materialHint: "自然木纹" },
      { name: "南瓜洞穴", tags: ["万圣节", "躲藏"], price: 128, requiredTier: "vip", desc: "南瓜造型的恐怖洞穴", materialHint: "低反光哑光" },
      { name: "骷髅堡垒", tags: ["万圣节", "城堡"], price: 158, requiredTier: "vip", desc: "小型骷髅城堡骨架", materialHint: "低反光哑光 / 哑光树脂" },
      { name: "幽灵海域", tags: ["万圣节", "半透明"], price: 148, requiredTier: "vip", desc: "漂浮幽灵装饰件", materialHint: "半透明玻璃感" },
      { name: "女巫帽子", tags: ["万圣节", "焦点"], price: 108, requiredTier: "vip", desc: "女巫帽造型，可做焦点", materialHint: "低反光哑光" },
      { name: "鹊桥相会", tags: ["七夕", "桥"], price: 158, requiredTier: "vip", desc: "仿真鹊桥造型", materialHint: "珠光质感" },
      { name: "爱心珊瑚", tags: ["七夕", "点缀"], price: 118, requiredTier: "vip", desc: "心形珊瑚装饰", materialHint: "珠光质感 / 哑光树脂" },
      { name: "月亮椅", tags: ["七夕", "休憩"], price: 128, requiredTier: "vip", desc: "月牙形休闲椅", materialHint: "珠光质感" },
      { name: "浪漫礁石群", tags: ["七夕", "组合"], price: 138, requiredTier: "vip", desc: "心形石头组合", materialHint: "低反光哑光" },
    ],
  },
  {
    name: "文化主题场景",
    requiredTier: "vip",
    desc: "中式、日式、东南亚和欧洲古典场景模型。",
    models: [
      { name: "微缩石桥", tags: ["中式", "桥"], price: 158, requiredTier: "vip", desc: "中式石拱桥，可做主景", materialHint: "低反光哑光", tankHint: "60cm+" },
      { name: "亭台楼阁", tags: ["中式", "建筑"], price: 198, requiredTier: "vip", desc: "小型中式亭子模型", materialHint: "低反光哑光", tankHint: "90cm+" },
      { name: "枯山水景", tags: ["日式", "套景"], price: 178, requiredTier: "vip", desc: "日式枯山水微缩景观", materialHint: "低反光哑光 / 自然木纹", tankHint: "60cm+" },
      { name: "竹丛", tags: ["中式", "背景"], price: 128, requiredTier: "vip", desc: "仿真竹子群，可做背景", materialHint: "自然木纹", tankHint: "45cm+" },
      { name: "鲤鱼跃龙门", tags: ["中式", "大型"], price: 229, requiredTier: "vip", desc: "大型锦鲤与龙门组合", materialHint: "珠光质感 / 低反光哑光", tankHint: "90cm+" },
      { name: "枯山水石组", tags: ["日式", "组合"], price: 148, requiredTier: "vip", desc: "白色砂石与岩石组合", materialHint: "低反光哑光", tankHint: "45cm+" },
      { name: "禅意石灯笼", tags: ["日式", "点缀"], price: 108, requiredTier: "vip", desc: "小型石灯笼造型", materialHint: "低反光哑光", tankHint: "45cm+" },
      { name: "竹制鸟居", tags: ["日式", "鸟居"], price: 148, requiredTier: "vip", desc: "仿真竹制红色鸟居", materialHint: "自然木纹", tankHint: "60cm+" },
      { name: "枯枝松树", tags: ["日式", "背景"], price: 158, requiredTier: "vip", desc: "仿真日本松树造型", materialHint: "自然木纹", tankHint: "60cm+" },
      { name: "茶道石组", tags: ["日式", "石组"], price: 128, requiredTier: "vip", desc: "仿真茶道用石组", materialHint: "低反光哑光", tankHint: "45cm+" },
      { name: "佛塔", tags: ["东南亚", "建筑"], price: 168, requiredTier: "vip", desc: "东南亚佛塔造型", materialHint: "低反光哑光", tankHint: "60cm+" },
      { name: "木栈桥", tags: ["东南亚", "桥"], price: 148, requiredTier: "vip", desc: "东南亚水上栈桥", materialHint: "自然木纹", tankHint: "60cm+" },
      { name: "大象石雕", tags: ["东南亚", "雕塑"], price: 128, requiredTier: "vip", desc: "小型大象石雕", materialHint: "低反光哑光", tankHint: "45cm+" },
      { name: "莲花底座", tags: ["东南亚", "底座"], price: 98, requiredTier: "vip", desc: "莲花造型装饰", materialHint: "珠光质感", tankHint: "30cm+" },
      { name: "罗马柱群", tags: ["欧洲", "组合"], price: 168, requiredTier: "vip", desc: "仿真罗马柱，可组合", materialHint: "低反光哑光", tankHint: "60cm+" },
      { name: "欧式凉亭", tags: ["欧洲", "建筑"], price: 198, requiredTier: "vip", desc: "小型欧式凉亭", materialHint: "低反光哑光", tankHint: "90cm+" },
      { name: "城堡废墟", tags: ["欧洲", "遗迹"], price: 218, requiredTier: "vip", desc: "欧洲城堡残骸造型", materialHint: "低反光哑光", tankHint: "90cm+" },
      { name: "喷泉雕塑", tags: ["欧洲", "雕塑"], price: 168, requiredTier: "vip", desc: "欧式喷泉中心装饰", materialHint: "哑光树脂", tankHint: "60cm+" },
    ],
  },
  {
    name: "收藏艺术系列",
    requiredTier: "svip",
    desc: "经典建筑、艺术雕塑和完整场景套组。",
    models: [
      { name: "比萨斜塔", tags: ["建筑", "限量"], price: 269, requiredTier: "svip", desc: "微缩版比萨斜塔，经典倾斜造型", materialHint: "低反光哑光", tankHint: "90cm+" },
      { name: "罗马斗兽场", tags: ["建筑", "大型"], price: 329, requiredTier: "svip", desc: "微缩罗马斗兽场，震撼壮观", materialHint: "低反光哑光", tankHint: "120cm+" },
      { name: "悉尼歌剧院", tags: ["建筑", "收藏"], price: 299, requiredTier: "svip", desc: "经典贝壳造型建筑", materialHint: "珠光质感", tankHint: "90cm+" },
      { name: "埃菲尔铁塔", tags: ["建筑", "焦点"], price: 329, requiredTier: "svip", desc: "经典铁塔造型，可做主景焦点", materialHint: "基础塑料质感", tankHint: "120cm+" },
      { name: "金字塔", tags: ["建筑", "古老"], price: 249, requiredTier: "svip", desc: "微缩金字塔，神秘古老", materialHint: "低反光哑光", tankHint: "90cm+" },
      { name: "吴哥窟", tags: ["建筑", "寺庙"], price: 299, requiredTier: "svip", desc: "高棉风格寺庙建筑", materialHint: "低反光哑光", tankHint: "90cm+" },
      { name: "泰姬陵", tags: ["建筑", "白色"], price: 299, requiredTier: "svip", desc: "经典白色圆顶建筑", materialHint: "珠光质感", tankHint: "90cm+" },
      { name: "长城烽火台", tags: ["建筑", "中式"], price: 238, requiredTier: "svip", desc: "微缩长城烽火台段", materialHint: "低反光哑光", tankHint: "60cm+" },
      { name: "帕特农神庙", tags: ["建筑", "希腊"], price: 289, requiredTier: "svip", desc: "希腊神庙经典柱式", materialHint: "低反光哑光", tankHint: "90cm+" },
      { name: "圣家族大教堂", tags: ["建筑", "高迪"], price: 359, requiredTier: "svip", desc: "高迪经典建筑造型", materialHint: "珠光质感 / 低反光哑光", tankHint: "120cm+" },
      { name: "思想者礁石", tags: ["艺术", "雕塑"], price: 289, requiredTier: "svip", desc: "复刻罗丹思想者造型", materialHint: "哑光树脂", tankHint: "60cm+" },
      { name: "维纳斯雕像", tags: ["艺术", "雕像"], price: 289, requiredTier: "svip", desc: "仿真断臂维纳斯雕像", materialHint: "哑光树脂", tankHint: "60cm+" },
      { name: "大卫剑", tags: ["艺术", "雕塑"], price: 229, requiredTier: "svip", desc: "仿真大卫剑造型", materialHint: "哑光树脂", tankHint: "45cm+" },
      { name: "狮身人面像", tags: ["艺术", "古埃及"], price: 299, requiredTier: "svip", desc: "经典狮身人面像造型", materialHint: "低反光哑光", tankHint: "90cm+" },
      { name: "自由女神像", tags: ["艺术", "建筑"], price: 309, requiredTier: "svip", desc: "微缩版自由女神像", materialHint: "珠光质感", tankHint: "90cm+" },
      { name: "胜利女神像", tags: ["艺术", "雕塑"], price: 269, requiredTier: "svip", desc: "经典胜利女神船首像", materialHint: "珠光质感", tankHint: "60cm+" },
      { name: "沉思者雕塑", tags: ["艺术", "冥想"], price: 219, requiredTier: "svip", desc: "冥想姿态的雕塑", materialHint: "哑光树脂", tankHint: "45cm+" },
      { name: "莲花座", tags: ["艺术", "底座"], price: 198, requiredTier: "svip", desc: "佛陀莲花座造型", materialHint: "珠光质感", tankHint: "45cm+" },
      { name: "沉船遗迹套组", tags: ["套组", "沉船"], price: 399, requiredTier: "svip", desc: "沉船主体、珊瑚、宝箱和鱼锚的完整海底场景", tankHint: "90cm+" },
      { name: "海盗船套组", tags: ["套组", "海盗"], price: 429, requiredTier: "svip", desc: "海盗船、船帆、船长室和炮台组合", tankHint: "90cm+" },
      { name: "失落城堡套组", tags: ["套组", "城堡"], price: 469, requiredTier: "svip", desc: "城堡主体、塔楼、石桥和护城河底座", tankHint: "120cm+" },
      { name: "日式枯山水套组", tags: ["套组", "禅意"], price: 359, requiredTier: "svip", desc: "枯山水底座、白砂石、枯石和松树", tankHint: "60cm+" },
      { name: "中式园林套组", tags: ["套组", "中式"], price: 429, requiredTier: "svip", desc: "石桥、亭子、假山和锦鲤的完整中式场景", tankHint: "90cm+" },
      { name: "古罗马广场套组", tags: ["套组", "罗马"], price: 489, requiredTier: "svip", desc: "罗马柱、斗兽场、喷泉和雕塑组合", tankHint: "120cm+" },
    ],
  },
  {
    name: "季节限定系列",
    requiredTier: "vip",
    desc: "春夏秋冬应季造景主题模型。",
    models: [
      { name: "樱花树枝", tags: ["春季", "主景"], price: 138, requiredTier: "vip", desc: "仿真樱花树枝，可做主景", materialHint: "自然木纹 / 珠光质感", tankHint: "45cm+" },
      { name: "樱花礁石", tags: ["春季", "礁石"], price: 128, requiredTier: "vip", desc: "粉色樱花点缀的礁石", materialHint: "低反光哑光 + 珠光质感", tankHint: "60cm+" },
      { name: "春日神社", tags: ["春季", "建筑"], price: 168, requiredTier: "vip", desc: "微缩日式春日神社", materialHint: "低反光哑光", tankHint: "60cm+" },
      { name: "蝴蝶飞舞", tags: ["春季", "悬挂"], price: 98, requiredTier: "vip", desc: "仿真蝴蝶装饰，可悬挂", materialHint: "珠光质感", tankHint: "30cm+" },
      { name: "贝壳沙滩", tags: ["夏季", "底座"], price: 148, requiredTier: "vip", desc: "大型贝壳组合沙滩底座", materialHint: "低反光哑光", tankHint: "60cm+" },
      { name: "椰子树", tags: ["夏季", "背景"], price: 138, requiredTier: "vip", desc: "仿真椰子树，可做背景", materialHint: "自然木纹", tankHint: "60cm+" },
      { name: "沙滩伞", tags: ["夏季", "点缀"], price: 98, requiredTier: "vip", desc: "小型沙滩遮阳伞", materialHint: "珠光质感", tankHint: "45cm+" },
      { name: "海星礁石", tags: ["夏季", "礁石"], price: 108, requiredTier: "vip", desc: "五臂海星造型礁石", materialHint: "珠光质感", tankHint: "45cm+" },
      { name: "寄居蟹", tags: ["夏季", "仿真"], price: 98, requiredTier: "vip", desc: "仿真寄居蟹装饰", materialHint: "哑光树脂", tankHint: "30cm+" },
      { name: "红叶枫树", tags: ["秋季", "背景"], price: 148, requiredTier: "vip", desc: "仿真红叶枫树造型", materialHint: "自然木纹", tankHint: "60cm+" },
      { name: "秋实礁石", tags: ["秋季", "礁石"], price: 118, requiredTier: "vip", desc: "秋季果实造型礁石", materialHint: "哑光树脂", tankHint: "45cm+" },
      { name: "落叶底座", tags: ["秋季", "底座"], price: 138, requiredTier: "vip", desc: "仿真落叶铺成的底座", materialHint: "自然木纹", tankHint: "60cm+" },
      { name: "松果松枝", tags: ["秋季", "自然"], price: 118, requiredTier: "vip", desc: "仿真松果和松枝组合", materialHint: "自然木纹", tankHint: "45cm+" },
      { name: "雪松", tags: ["冬季", "背景"], price: 148, requiredTier: "vip", desc: "覆雪松树造型", materialHint: "自然木纹 + 基础塑料质感", tankHint: "60cm+" },
      { name: "冰晶洞穴", tags: ["冬季", "洞穴"], price: 158, requiredTier: "vip", desc: "仿真冰晶覆盖的洞穴", materialHint: "半透明玻璃感", tankHint: "60cm+" },
      { name: "滑雪小屋", tags: ["冬季", "建筑"], price: 168, requiredTier: "vip", desc: "微缩冬季小屋", materialHint: "低反光哑光", tankHint: "60cm+" },
      { name: "冰屋", tags: ["冬季", "建筑"], price: 128, requiredTier: "vip", desc: "仿真爱斯基摩冰屋", materialHint: "半透明玻璃感", tankHint: "45cm+" },
    ],
  },
  {
    name: "水族活体配套",
    requiredTier: "vip",
    desc: "针对短鲷、灯鱼、斗鱼和底栖鱼的专属福利模型。",
    models: [
      { name: "短鲷庇护所", tags: ["短鲷", "庇护"], price: 118, requiredTier: "vip", desc: "小型洞穴加开阔活动区，专为短鲷设计", materialHint: "低反光哑光", tankHint: "短鲷、鼠鱼" },
      { name: "鲷螺壳", tags: ["短鲷", "繁殖"], price: 98, requiredTier: "vip", desc: "仿真蜷螺壳，提供私密繁殖空间", materialHint: "哑光树脂", tankHint: "短鲷、南美短鲷" },
      { name: "沉木躲避洞", tags: ["短鲷", "沉木"], price: 128, requiredTier: "vip", desc: "沉木与洞穴组合，适合缸内造景", materialHint: "自然木纹", tankHint: "各类短鲷" },
      { name: "产卵管道", tags: ["短鲷", "产卵"], price: 88, requiredTier: "vip", desc: "窄长管道设计，专为短鲷产卵", materialHint: "哑光树脂", tankHint: "短鲷" },
      { name: "密集水草区", tags: ["灯鱼", "躲藏"], price: 108, requiredTier: "vip", desc: "细小缝隙设计，适合灯鱼躲藏", materialHint: "自然木纹", tankHint: "红莲灯、三色灯" },
      { name: "灯鱼庇护所", tags: ["灯鱼", "社区"], price: 108, requiredTier: "vip", desc: "多入口小型社区结构", materialHint: "低反光哑光", tankHint: "各类灯鱼" },
      { name: "浮游性水草", tags: ["灯鱼", "水草"], price: 98, requiredTier: "vip", desc: "仿真水草，提供灯鱼栖息地", materialHint: "自然木纹", tankHint: "各类灯鱼" },
      { name: "群游广场", tags: ["灯鱼", "开阔"], price: 118, requiredTier: "vip", desc: "开阔空间设计，适合群游鱼", materialHint: "低反光哑光", tankHint: "红鼻剪刀等" },
      { name: "斗鱼泡巢基座", tags: ["斗鱼", "繁殖"], price: 98, requiredTier: "vip", desc: "配合泡巢产卵的基座结构", materialHint: "哑光树脂", tankHint: "泰国斗鱼、将军斗鱼" },
      { name: "叶片庇护所", tags: ["斗鱼", "休息"], price: 108, requiredTier: "vip", desc: "仿真大叶片结构，提供休息点", materialHint: "哑光树脂", tankHint: "斗鱼、迷宫鱼" },
      { name: "私密洞穴", tags: ["斗鱼", "领地"], price: 98, requiredTier: "vip", desc: "单入口设计，减少领地冲突", materialHint: "低反光哑光", tankHint: "斗鱼、国斗" },
      { name: "展示平台", tags: ["斗鱼", "展示"], price: 98, requiredTier: "vip", desc: "开阔平台供斗鱼展示", materialHint: "哑光树脂", tankHint: "斗鱼" },
      { name: "异型木", tags: ["底栖", "清藻"], price: 128, requiredTier: "vip", desc: "仿真异型木，提供清藻区域", materialHint: "自然木纹", tankHint: "各类异型鱼" },
      { name: "矿质洞穴", tags: ["底栖", "矿质"], price: 118, requiredTier: "vip", desc: "富含矿物质的岩石结构", materialHint: "低反光哑光", tankHint: "蓝眼皇冠豹等" },
      { name: "根茎躲避所", tags: ["底栖", "躲藏"], price: 128, requiredTier: "vip", desc: "树根状结构，提供大面积躲藏", materialHint: "自然木纹", tankHint: "各类底栖鱼" },
      { name: "滤食平台", tags: ["底栖", "滤食"], price: 118, requiredTier: "vip", desc: "多层结构设计，适合滤食性鱼类", materialHint: "低反光哑光", tankHint: "各类底栖鱼" },
      { name: "短鲷繁殖套组", tags: ["套组", "短鲷"], price: 258, requiredTier: "vip", desc: "鲷螺壳、产卵管道与沉木躲避洞组合", tankHint: "短鲷繁殖缸" },
      { name: "灯鱼群游套组", tags: ["套组", "灯鱼"], price: 248, requiredTier: "vip", desc: "密集水草区、群游广场与浮游性水草组合", tankHint: "灯鱼为主缸" },
      { name: "斗鱼展示套组", tags: ["套组", "斗鱼"], price: 238, requiredTier: "vip", desc: "泡巢基座、叶片庇护所与展示平台组合", tankHint: "斗鱼单养缸" },
      { name: "底栖生态套组", tags: ["套组", "底栖"], price: 278, requiredTier: "vip", desc: "异型木、矿质洞穴与根茎躲避所组合", tankHint: "异型鱼/底栖缸" },
    ],
  },
  {
    name: "教育科普系列",
    requiredTier: "vip",
    desc: "史前海洋生物、珍稀物种和科普展示套组。",
    models: [
      { name: "鹦鹉螺", tags: ["古生代", "科普"], price: 138, requiredTier: "vip", desc: "经典古生代鹦鹉螺造型", materialHint: "哑光树脂", tankHint: "60cm+" },
      { name: "三叶虫礁石", tags: ["古生代", "礁石"], price: 118, requiredTier: "vip", desc: "仿真三叶虫形态礁石", materialHint: "低反光哑光", tankHint: "45cm+" },
      { name: "海百合", tags: ["古生代", "背景"], price: 138, requiredTier: "vip", desc: "仿真海百合造型，可做背景", materialHint: "自然木纹", tankHint: "60cm+" },
      { name: "角石", tags: ["古生代", "直壳"], price: 128, requiredTier: "vip", desc: "古生代鹦鹉螺近亲，直壳造型", materialHint: "哑光树脂", tankHint: "60cm+" },
      { name: "笔石", tags: ["古生代", "悬挂"], price: 108, requiredTier: "vip", desc: "仿真笔石悬挂形态", materialHint: "哑光树脂", tankHint: "45cm+" },
      { name: "仿真蛇颈龙", tags: ["中生代", "恐龙"], price: 198, requiredTier: "vip", desc: "小型蛇颈龙造型，脖子修长", materialHint: "哑光树脂", tankHint: "90cm+" },
      { name: "仿真沧龙", tags: ["中生代", "恐龙"], price: 198, requiredTier: "vip", desc: "中型沧龙造型，凶猛姿态", materialHint: "哑光树脂", tankHint: "90cm+" },
      { name: "鱼龙", tags: ["中生代", "流线"], price: 168, requiredTier: "vip", desc: "仿真鱼龙造型，流线型", materialHint: "哑光树脂", tankHint: "60cm+" },
      { name: "海洋恐龙蛋", tags: ["中生代", "摆设"], price: 108, requiredTier: "vip", desc: "仿真恐龙蛋，可做摆设", materialHint: "哑光树脂", tankHint: "45cm+" },
      { name: "菊石", tags: ["中生代", "螺旋"], price: 108, requiredTier: "vip", desc: "仿真菊石外壳，经典螺旋", materialHint: "哑光树脂", tankHint: "45cm+" },
      { name: "中华鲟", tags: ["珍稀", "科普"], price: 188, requiredTier: "vip", desc: "仿真中华鲟，珍稀保护物种", materialHint: "哑光树脂", tankHint: "90cm+" },
      { name: "海马群", tags: ["珍稀", "群组"], price: 148, requiredTier: "vip", desc: "仿真海马群，可附着在礁石上", materialHint: "哑光树脂", tankHint: "45cm+" },
      { name: "海龟", tags: ["珍稀", "仿真"], price: 168, requiredTier: "vip", desc: "仿真海龟，悠闲姿态", materialHint: "哑光树脂", tankHint: "90cm+" },
      { name: "锯鳐", tags: ["珍稀", "独特"], price: 178, requiredTier: "vip", desc: "仿真锯鳐，独特锯嘴造型", materialHint: "低反光哑光", tankHint: "90cm+" },
      { name: "魔鬼鱼", tags: ["珍稀", "缸壁"], price: 168, requiredTier: "vip", desc: "仿真魔鬼鱼，可贴在缸壁", materialHint: "哑光树脂", tankHint: "90cm+" },
      { name: "古生代海洋套组", tags: ["套组", "古生代"], price: 328, requiredTier: "vip", desc: "鹦鹉螺、三叶虫礁石、海百合和菊石组合" },
      { name: "中生代海洋套组", tags: ["套组", "中生代"], price: 398, requiredTier: "vip", desc: "蛇颈龙、沧龙、鱼龙和海洋恐龙蛋组合" },
      { name: "珍稀物种套组", tags: ["套组", "珍稀"], price: 368, requiredTier: "vip", desc: "中华鲟、海马群、海龟和锯鳐组合" },
      { name: "海洋进化套组", tags: ["套组", "进化"], price: 388, requiredTier: "vip", desc: "鹦鹉螺、菊石、沧龙和海龟组合" },
    ],
  },
  {
    name: "互动玩具系列",
    requiredTier: "svip",
    desc: "发光组件与场景联动模型，适合做高阶互动主题缸。",
    models: [
      { name: "月球", tags: ["发光","点缀"], price: 239, requiredTier: "svip", desc: "月球造型发光组件，可作为夜景焦点", materialHint: "半透明树脂 / 夜光材料", tankHint: "60cm+", modelPath: "/models/interactive-toys/glowing-moon/model.glb", previewImage: "/models/interactive-toys/glowing-moon/preview.png" },
      { name: "洞壁", tags: ["发光","背景"], price: 249, requiredTier: "svip", desc: "可贴合背景的洞壁发光组件", materialHint: "半透明树脂 / 哑光树脂", tankHint: "60cm+", modelPath: "/models/interactive-toys/glowing-cave-wall/model.glb", previewImage: "/models/interactive-toys/glowing-cave-wall/preview.png" },
      { name: "珊瑚", tags: ["发光","珊瑚"], price: 259, requiredTier: "svip", desc: "发光珊瑚装饰，适合作为局部亮点", materialHint: "夜光材料 / 哑光树脂", tankHint: "45cm+", modelPath: "/models/interactive-toys/glowing-coral/model.glb", previewImage: "/models/interactive-toys/glowing-coral/preview.png" },
      { name: "礁石", tags: ["发光","礁石"], price: 259, requiredTier: "svip", desc: "发光礁石组件，适合与基础造景组合", materialHint: "半透明树脂 / 低反光哑光", tankHint: "45cm+", modelPath: "/models/interactive-toys/glowing-reef/model.glb", previewImage: "/models/interactive-toys/glowing-reef/preview.png" },
      { name: "摇曳海草", tags: ["联动","水草"], price: 189, requiredTier: "svip", desc: "随水流产生视觉动态的海草造型", materialHint: "柔性树脂 / 自然木纹", tankHint: "45cm+", modelPath: "/models/interactive-toys/swaying-seagrass/model.glb", previewImage: "/models/interactive-toys/swaying-seagrass/preview.png" },
      { name: "旋转摩天轮", tags: ["联动","旋转"], price: 269, requiredTier: "svip", desc: "可作为中心趣味点的旋转摩天轮造型", materialHint: "哑光树脂 / 高强度尼龙", tankHint: "60cm+", modelPath: "/models/interactive-toys/rotating-ferris-wheel/model.glb", previewImage: "/models/interactive-toys/rotating-ferris-wheel/preview.png" },
      { name: "浮动气泡群", tags: ["联动","气泡"], price: 229, requiredTier: "svip", desc: "仿真气泡群，适合营造轻盈水流感", materialHint: "半透明玻璃感", tankHint: "需水流驱动", modelPath: "/models/interactive-toys/floating-bubbles/model.glb", previewImage: "/models/interactive-toys/floating-bubbles/preview.png" },
      { name: "海盗船残骸", tags: ["联动","沉船"], price: 289, requiredTier: "svip", desc: "海盗船残骸场景件，可组合成探索主题", materialHint: "低反光哑光 / 自然木纹", tankHint: "90cm+", modelPath: "/models/interactive-toys/pirate-ship-wreck/model.glb", previewImage: "/models/interactive-toys/pirate-ship-wreck/preview.png" }
    ],
  }
]

const printMaterials = [
  { name: "丝光PLA", desc: "丝缎光泽、低层纹", fit: "轻盈典雅、神秘洞穴" },
  { name: "渐变PLA", desc: "色彩渐变、梦幻层次", fit: "轻盈典雅、极简现代" },
  { name: "哑光PLA", desc: "沉稳厚重、低反光", fit: "神秘洞穴、微型遗迹" },
  { name: "光滑PLA", desc: "高光泽、镜面感", fit: "几何艺术、极简现代" },
  { name: "哑光树脂", desc: "高端精细、薄壁友好", fit: "所有风格展示件" },
  { name: "PA12尼龙", desc: "工业强度、耐用", fit: "大件/承重部件" },
  { name: "仿木PLA", desc: "自然纹理、温润木质", fit: "自然有机、微型遗迹" },
  { name: "半透明树脂", desc: "透光柔和、玻璃感", fit: "极简现代、几何艺术" },
]

const colorGroups = [
  { name: "莫兰迪灰", colors: ["灰豆绿", "灰蓝", "灰紫", "灰粉", "灰棕", "灰黄"], swatches: ["#9baa95", "#8d9fac", "#aaa0b8", "#c5a4a9", "#a4958d", "#beb48d"] },
  { name: "浅色系", colors: ["象牙白", "奶油白", "浅暖灰", "浅粉", "浅蓝", "浅绿"], swatches: ["#f4efe4", "#f5ead2", "#d8d4ca", "#e7c6cc", "#c9dceb", "#cce2d3"] },
  { name: "中灰系", colors: ["青灰", "暖泥灰", "冷杉灰", "中灰绿", "中灰蓝"], swatches: ["#7f9294", "#9a8f82", "#697774", "#718579", "#6f8190"] },
  { name: "深灰系", colors: ["深炭灰", "磨砂黑", "深空灰", "深咖啡", "深墨绿"], swatches: ["#343434", "#111111", "#444a50", "#3a2d27", "#213a32"] },
  { name: "自然色", colors: ["抹茶绿", "雾霾蓝", "脏橘色", "松石绿", "苔藓绿"], swatches: ["#8da568", "#88a6b5", "#c7774d", "#3d9d9a", "#5e7446"] },
  { name: "马卡龙色", colors: ["薄荷绿", "樱花粉", "奶油黄", "蜜桃橙", "薰衣草紫"], swatches: ["#b9ead7", "#f5bccb", "#f8dfa0", "#f4b28f", "#c9b7e8"] },
  { name: "高级色", colors: ["镏金色", "玫瑰金", "星空银", "电镀蓝"], swatches: ["#c99a3d", "#b97868", "#c6ccd2", "#3b6fb6"] },
]

const viewPresets = [
  { id: "front", label: "正面", face: "front" },
  { id: "back", label: "背面", face: "back" },
  { id: "left", label: "左侧", face: "left" },
  { id: "right", label: "右侧", face: "right" },
  { id: "top", label: "顶视", face: "top" },
  { id: "perspective", label: "透视", face: "corner" },
] as const

type ViewPresetId = (typeof viewPresets)[number]["id"]
type ViewCubeRotation = { x: number; y: number }

function ViewCube({
  value,
  rotation,
  onChange,
}: {
  value: ViewPresetId
  rotation: ViewCubeRotation
  onChange: (value: ViewPresetId) => void
}) {
  const cubeTransform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
  const oppositePreset: Partial<Record<ViewPresetId, ViewPresetId>> = {
    front: "back",
    back: "front",
    left: "right",
    right: "left",
  }
  const choosePreset = (target: ViewPresetId) => {
    onChange(value === target ? oppositePreset[target] ?? target : target)
  }
  const faceClass = "absolute flex h-12 w-12 items-center justify-center border border-white/80 bg-white/82 shadow-sm backdrop-blur-sm cursor-pointer transition-colors hover:bg-white"

  return (
    <div
      className="relative h-24 w-24 rounded-2xl border border-white/70 bg-white/60 shadow-lg backdrop-blur-sm"
      style={{ perspective: "520px" }}
      aria-label="视角立方体"
    >
      <div
        className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 "
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="relative h-12 w-12 transition-transform duration-300"
          style={{ transformStyle: "preserve-3d", transform: cubeTransform }}
        >
          <button type="button" onPointerDown={(event) => event.stopPropagation()} title="正面 / 再点切背面" aria-label="切换到正面，再次点击切换到背面" onClick={() => choosePreset("front")} className={`${faceClass} ${value === "front" ? "bg-neutral-950 text-white" : "text-neutral-700"}`} style={{ transform: "translateZ(24px)" }} />
          <button type="button" onPointerDown={(event) => event.stopPropagation()} title="背面 / 再点切正面" aria-label="切换到背面，再次点击切换到正面" onClick={() => choosePreset("back")} className={`${faceClass} ${value === "back" ? "bg-neutral-950 text-white" : "text-neutral-700"}`} style={{ transform: "rotateY(180deg) translateZ(24px)" }} />
          <button type="button" onPointerDown={(event) => event.stopPropagation()} title="右侧 / 再点切左侧" aria-label="切换到右侧，再次点击切换到左侧" onClick={() => choosePreset("right")} className={`${faceClass} ${value === "right" ? "bg-neutral-950 text-white" : "text-neutral-700"}`} style={{ transform: "rotateY(90deg) translateZ(24px)" }} />
          <button type="button" onPointerDown={(event) => event.stopPropagation()} title="左侧 / 再点切右侧" aria-label="切换到左侧，再次点击切换到右侧" onClick={() => choosePreset("left")} className={`${faceClass} ${value === "left" ? "bg-neutral-950 text-white" : "text-neutral-700"}`} style={{ transform: "rotateY(-90deg) translateZ(24px)" }} />
          <button type="button" onPointerDown={(event) => event.stopPropagation()} title="顶视" aria-label="切换到顶视" onClick={() => choosePreset("top")} className={`${faceClass} ${value === "top" ? "bg-neutral-950 text-white" : "text-neutral-700"}`} style={{ transform: "rotateX(90deg) translateZ(24px)" }} />
          <button type="button" onPointerDown={(event) => event.stopPropagation()} title="透视" aria-label="切换到透视" onClick={() => choosePreset("perspective")} className={`${faceClass} ${value === "perspective" ? "bg-neutral-950 text-white" : "text-neutral-700"}`} style={{ transform: "rotateX(-90deg) translateZ(24px)" }} />
        </div>
      </div>
    </div>
  )
}

const transformModes = [
  { id: "select", label: "框选", icon: SquareDashedMousePointer },
  { id: "translate", label: "移动", icon: Move3D },
  { id: "scale", label: "缩放", icon: StretchHorizontal },
  { id: "rotate", label: "旋转", icon: Rotate3D },
] as const

type TankSize = {
  length: number
  width: number
  height: number
}

const DEFAULT_TANK_SIZE: TankSize = { length: 60, width: 30, height: 35 }
const TANK_SIZE_STORAGE_KEY = "finscape:tank-size"

type AddedModel = {
  id: string
  name: string
  material: string
  color: string
  price: number
  x: number
  y: number
  z: number
  scale: number
  scaleX: number
  scaleY: number
  scaleZ: number
  rotationY: number
  modelPath?: string
  bounds?: {
    halfX: number
    halfZ: number
    height: number
  }
}

function isEditableShortcutTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return Boolean(target.closest("input, textarea, select, [contenteditable='true']"))
}

function cloneModelSnapshot(model: AddedModel): AddedModel {
  return {
    ...model,
    bounds: model.bounds ? { ...model.bounds } : undefined,
  }
}

function getModelFootprint(model: AddedModel) {
  const scale = model.scale
  const halfX = (model.bounds?.halfX ?? 1.6) * scale * model.scaleX * 0.95
  const halfZ = (model.bounds?.halfZ ?? 1.6) * scale * model.scaleZ * 0.95
  const height = (model.bounds?.height ?? 7) * scale * model.scaleY * 0.98
  return { halfX, halfZ, height }
}

function getProjectedFootprint(model: AddedModel) {
  const bounds = getModelFootprint(model)
  const cos = Math.abs(Math.cos(model.rotationY))
  const sin = Math.abs(Math.sin(model.rotationY))
  return {
    halfX: bounds.halfX * cos + bounds.halfZ * sin,
    halfZ: bounds.halfX * sin + bounds.halfZ * cos,
  }
}

function getCollisionAxes(model: AddedModel) {
  const cos = Math.cos(model.rotationY)
  const sin = Math.sin(model.rotationY)
  return [
    { x: cos, z: sin },
    { x: -sin, z: cos },
  ]
}

function collisionRadius(model: AddedModel, axis: { x: number; z: number }) {
  const bounds = getModelFootprint(model)
  const [axisX, axisZ] = getCollisionAxes(model)
  return bounds.halfX * Math.abs(axis.x * axisX.x + axis.z * axisX.z)
    + bounds.halfZ * Math.abs(axis.x * axisZ.x + axis.z * axisZ.z)
}

function modelsWouldOverlap(a: AddedModel, b: AddedModel, padding = 0.02) {
  const aBox = getModelFootprint(a)
  const bBox = getModelFootprint(b)
  const overlapY = a.y < b.y + bBox.height + padding && b.y < a.y + aBox.height + padding
  if (!overlapY) return false

  const delta = { x: b.x - a.x, z: b.z - a.z }
  return [...getCollisionAxes(a), ...getCollisionAxes(b)].every((axis) => {
    const distance = Math.abs(delta.x * axis.x + delta.z * axis.z)
    return distance < collisionRadius(a, axis) + collisionRadius(b, axis) + padding
  })
}

function fitsInsideTank(model: AddedModel, tankSize: TankSize) {
  const bounds = getProjectedFootprint(model)
  const halfLength = tankSize.length * 0.8 * 0.5 - bounds.halfX - 0.4
  const halfWidth = tankSize.width * 0.8 * 0.5 - bounds.halfZ - 0.4
  const maxY = tankSize.height * 0.8 - getModelFootprint(model).height - 0.4
  return Math.abs(model.x) <= halfLength && Math.abs(model.z) <= halfWidth && model.y <= maxY
}

function findPastePosition(model: AddedModel, placedModels: AddedModel[], tankSize: TankSize) {
  const maxSearchDistance = Math.max(tankSize.length, tankSize.width) * 0.8
  const radialStep = 0.8
  const directionCount = 24

  for (let distance = radialStep; distance <= maxSearchDistance; distance += radialStep) {
    for (let index = 0; index < directionCount; index += 1) {
      const angle = (Math.PI * 2 * index) / directionCount
      const candidate = {
        ...model,
        x: model.x + Math.cos(angle) * distance,
        z: model.z + Math.sin(angle) * distance,
      }
      if (fitsInsideTank(candidate, tankSize) && !placedModels.some((item) => modelsWouldOverlap(candidate, item))) {
        return candidate
      }
    }
  }

  return null
}

export default function EditorPage() {
  const router = useRouter()
  const [tankSize, setTankSize] = useState<TankSize>(DEFAULT_TANK_SIZE)
  const [tankSizeReady, setTankSizeReady] = useState(false)
  const [activeStyle, setActiveStyle] = useState("极简现代")
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null)
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([])
  const [chatInput, setChatInput] = useState("")
  const [aiOpen, setAiOpen] = useState(false)
  const [transformMode, setTransformMode] = useState<(typeof transformModes)[number]["id"]>("translate")
  const [viewPreset, setViewPreset] = useState<ViewPresetId>("perspective")
  const [viewCubeRotation, setViewCubeRotation] = useState<ViewCubeRotation>({ x: -28, y: -38 })
  const [isEditorExpanded, setIsEditorExpanded] = useState(false)
  const [editorNotice, setEditorNotice] = useState<string | null>(null)
  const [history, setHistory] = useState<AddedModel[][]>([])
  const transformHistoryLocked = useRef(false)
  const transformHistoryTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const editorNoticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const copiedModels = useRef<AddedModel[]>([])
  const [hoverPreview, setHoverPreview] = useState<null | {
    model: CatalogModel
    x: number
    y: number
  }>(null)
  const modelIdCounter = useRef(0)
  const [models, setModels] = useState<AddedModel[]>([])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const storedSize = window.localStorage.getItem(TANK_SIZE_STORAGE_KEY)
    let parsedStoredSize: Partial<TankSize> = {}
    try {
      parsedStoredSize = storedSize ? JSON.parse(storedSize) as Partial<TankSize> : {}
    } catch {
      window.localStorage.removeItem(TANK_SIZE_STORAGE_KEY)
    }
    const nextSize = {
      length: Number(params.get("length") ?? parsedStoredSize.length),
      width: Number(params.get("width") ?? parsedStoredSize.width),
      height: Number(params.get("height") ?? parsedStoredSize.height),
    }
    const isValid = Object.values(nextSize).every((value) => Number.isFinite(value) && value > 0)
    if (!isValid) {
      router.replace("/customize")
      return
    }
    window.localStorage.setItem(TANK_SIZE_STORAGE_KEY, JSON.stringify(nextSize))
    queueMicrotask(() => {
      setTankSize(nextSize)
      setTankSizeReady(true)
    })
  }, [router])

  const activeGroup = styleGroups.find((group) => group.name === activeStyle) ?? styleGroups[0]
  const selectedModel = models.find((model) => model.id === selectedModelId) ?? null
  const total = models.reduce((sum, model) => sum + model.price, 0)

  const startCheckout = () => {
    if (models.length === 0) {
      showEditorNotice("请先添加模型再下单")
      return
    }
    saveCheckoutDraft({
      id: createCheckoutDraftId(),
      source: "editor",
      createdAt: new Date().toISOString(),
      tankSize,
      items: models.map((model) => ({
        id: model.id,
        name: model.name,
        material: model.material,
        color: model.color,
        price: model.price,
        scale: model.scale,
        scaleX: model.scaleX,
        scaleY: model.scaleY,
        scaleZ: model.scaleZ,
        modelPath: model.modelPath,
      })),
    })
    router.push("/checkout?source=editor")
  }

  const pushHistory = (snapshot: AddedModel[] = models) => {
    setHistory((current) => [...current.slice(-24), snapshot.map((model) => ({ ...model }))])
  }

  const undo = () => {
    setHistory((current) => {
      const previous = current.at(-1)
      if (!previous) return current
      setModels(previous.map((model) => ({ ...model })))
        const nextSelectedId = previous.some((model) => model.id === selectedModelId) ? selectedModelId : previous.at(-1)?.id ?? null
      setSelectedModelId(nextSelectedId)
      setSelectedModelIds(nextSelectedId ? [nextSelectedId] : [])
      return current.slice(0, -1)
    })
  }

  const commitModels = (updater: (current: AddedModel[]) => AddedModel[]) => {
    setModels((current) => {
      setHistory((historyItems) => [...historyItems.slice(-24), current.map((model) => ({ ...model }))])
      return updater(current)
    })
  }

  const recordTransformHistory = (snapshot: AddedModel[]) => {
    if (!transformHistoryLocked.current) {
      transformHistoryLocked.current = true
      setHistory((current) => [...current.slice(-24), snapshot.map((model) => ({ ...model }))])
    }
    if (transformHistoryTimer.current) clearTimeout(transformHistoryTimer.current)
    transformHistoryTimer.current = setTimeout(() => {
      transformHistoryLocked.current = false
      transformHistoryTimer.current = null
    }, 350)
  }

  const addModel = (model: CatalogModel) => {
    modelIdCounter.current += 1
    const nextModel: AddedModel = {
      id: `${model.name}-${modelIdCounter.current}`,
      name: model.name,
      material: "丝光PLA",
      color: "暖泥灰",
      price: model.price,
      x: (models.length % 3 - 1) * 10,
      y: 1.25,
      z: Math.floor(models.length / 3) * 7 - 4,
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
      rotationY: 0,
      modelPath: model.modelPath,
    }
    commitModels((current) => [...current, nextModel])
    setSelectedModelId(nextModel.id)
    setSelectedModelIds([nextModel.id])
  }

  const updateSelected = (patch: Partial<AddedModel>) => {
    if (!selectedModel) return
    commitModels((current) => current.map((model) => model.id === selectedModel.id ? { ...model, ...patch } : model))
  }

  const copySelection = () => {
    const selectedIds = selectedModelIds.length ? selectedModelIds : selectedModelId ? [selectedModelId] : []
    if (!selectedIds.length) return
    const selectedSet = new Set(selectedIds)
    copiedModels.current = models.filter((model) => selectedSet.has(model.id)).map(cloneModelSnapshot)
  }

  const showEditorNotice = (message: string) => {
    setEditorNotice(message)
    if (editorNoticeTimer.current) clearTimeout(editorNoticeTimer.current)
    editorNoticeTimer.current = setTimeout(() => {
      setEditorNotice(null)
      editorNoticeTimer.current = null
    }, 1800)
  }

  const pasteSelection = () => {
    if (!copiedModels.current.length) return
    const pastedIds: string[] = []

    commitModels((current) => {
      const nextModels = [...current]
      copiedModels.current.forEach((model) => {
        const positioned = findPastePosition(cloneModelSnapshot(model), nextModels, tankSize)
        if (!positioned) return

        modelIdCounter.current += 1
        const id = model.name + "-copy-" + modelIdCounter.current
        pastedIds.push(id)
        nextModels.push({ ...positioned, id })
      })
      return nextModels
    })

    if (!pastedIds.length) {
      showEditorNotice("哎呀，模型放不下了")
      return
    }
    setSelectedModelIds(pastedIds)
    setSelectedModelId(pastedIds.at(-1) ?? null)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isShortcut = event.metaKey || event.ctrlKey
      if (!isShortcut || event.altKey || isEditableShortcutTarget(event.target)) return
      const key = event.key.toLowerCase()

      if (key === "z") {
        event.preventDefault()
        undo()
        return
      }

      if (key === "c") {
        event.preventDefault()
        copySelection()
        return
      }

      if (key === "v") {
        event.preventDefault()
        pasteSelection()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [models, selectedModelId, selectedModelIds, history])

  useEffect(() => {
    return () => {
      if (editorNoticeTimer.current) clearTimeout(editorNoticeTimer.current)
    }
  }, [])

  const canUseColor = (material: string, groupName: string, colorName: string) => {
    if (material === "仿木PLA") return false
    if (material === "半透明树脂") return false
    if (material === "PA12尼龙") return groupName === "深灰系" || colorName === "磨砂黑"
    return true
  }

  if (!tankSizeReady) {
    return <main className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">正在读取鱼缸尺寸...</main>
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1680px] items-center gap-4 px-4 md:px-8">
          <Link href="/" className="inline-flex items-center gap-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
          <div className="h-5 w-px bg-border" />
          <div>
            <p className="text-sm font-semibold tracking-widest text-brand">FINSCAPE EDITOR</p>
            <p className="text-xs text-muted-foreground">模型库 · 3D 鱼缸 · 材质清单</p>
          </div>
          <div className="ml-auto hidden items-center gap-2 md:flex">
            <Button variant="outline" size="sm" disabled={history.length === 0} onClick={undo}><Undo2 className="h-4 w-4" />撤销</Button>
            <Button variant="outline" size="sm" disabled><RotateCcw className="h-4 w-4" />重做</Button>
            <Button variant="outline" size="sm"><Save className="h-4 w-4" />保存</Button>
            <Button size="sm"><Download className="h-4 w-4" />导出</Button>
          </div>
        </div>
      </header>

      <div className="grid min-h-screen grid-cols-1 pt-16 lg:grid-cols-[320px_minmax(0,1fr)_300px]">
        <aside className="border-r border-border/70 bg-background p-4 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
          <div className="mb-5">
            <h1 className="mt-1 text-3xl font-semibold">选择模型</h1>
            <div className="mt-3 rounded-lg border border-brand/15 bg-brand/5 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-brand">当前权益</p>
                  <p className="mt-0.5 text-sm font-medium">基础版 · 会员模型预览中</p>
                </div>
                <span className="rounded-full bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground">FREE</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {styleGroups.map((group) => {
              const groupLocked = !canAccessTier(group.requiredTier)
              return (
                <button
                  key={group.name}
                  onClick={() => setActiveStyle(group.name)}
                  className={`rounded-md border px-3 py-2 text-left text-sm font-medium transition-all ${activeStyle === group.name ? "border-brand bg-brand text-white shadow-sm" : "border-border bg-card hover:border-brand/50"}`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span>{group.name}</span>
                    {groupLocked && group.requiredTier && (
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${activeStyle === group.name ? "bg-white/20 text-white" : group.requiredTier === "svip" ? "bg-neutral-950 text-white" : "bg-brand/10 text-brand"}`}>
                        {membershipLabel[group.requiredTier]}
                      </span>
                    )}
                  </span>
                </button>
              )
            })}
          </div>

          <section className="mt-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">{activeStyle}</h2>
                {activeGroup.desc && <p className="mt-1 text-xs leading-5 text-muted-foreground">{activeGroup.desc}</p>}
              </div>
              <span className="text-xs text-muted-foreground">{activeGroup.models.length} 个模型</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {activeGroup.models.map((model) => {
                const addedCount = models.filter((item) => item.name === model.name).length
                const requiredTier = model.requiredTier ?? activeGroup.requiredTier
                const locked = !canAccessTier(requiredTier)
                return (
                  <div
                    key={model.name}
                    className={`group rounded-lg border bg-card p-3 transition-all hover:-translate-y-0.5 hover:shadow-md ${locked ? "border-border/80" : "border-border hover:border-brand/50"}`}
                    onMouseEnter={(event) => {
                      if (!model.modelPath) return
                      const rect = event.currentTarget.getBoundingClientRect()
                      setHoverPreview({
                        model,
                        x: rect.right + 14,
                        y: Math.min(rect.top, window.innerHeight - 280),
                      })
                    }}
                    onMouseLeave={() => setHoverPreview(null)}
                  >
                    <div className="relative mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-md bg-[radial-gradient(circle_at_35%_20%,white,oklch(0.88_0.018_190))]">
                      {model.previewImage ? (
                        <img
                          src={model.previewImage}
                          alt={model.name}
                          className={`h-full w-full object-contain p-2 ${locked ? "opacity-45 grayscale" : ""}`}
                          draggable={false}
                        />
                      ) : model.modelPath ? (
                        <div className={`h-full w-full ${locked ? "opacity-45 grayscale" : ""}`}>
                          <ModelCardPreview path={model.modelPath} />
                          <span className="sr-only">悬浮预览 3D 模型</span>
                        </div>
                      ) : (
                        <PackagePlus className={`h-8 w-8 ${locked ? "text-muted-foreground/50" : "text-brand/70"}`} />
                      )}
                      {locked && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/58 text-center backdrop-blur-[1px]">
                          <Lock className="h-5 w-5 text-neutral-950" />
                          <span className="mt-1 rounded-full bg-neutral-950 px-2 py-0.5 text-[10px] font-semibold text-white">
                            {requiredTier ? membershipLabel[requiredTier] : "会员"} 专属
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex min-h-10 items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold leading-snug">{model.name}</h3>
                        {locked && requiredTier ? (
                          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${requiredTier === "svip" ? "bg-neutral-950 text-white" : "bg-brand/10 text-brand"}`}>
                            {membershipLabel[requiredTier]}
                          </span>
                        ) : addedCount > 0 && (
                          <span className="shrink-0 rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand">{addedCount}</span>
                        )}
                      </div>
                      {model.desc && <p className="mt-1 text-[11px] leading-4 text-muted-foreground">{model.desc}</p>}
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {model.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{tag}</span>
                        ))}
                        {model.tankHint && <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{model.tankHint}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (locked) {
                          showEditorNotice(requiredTier ? membershipDesc[requiredTier] : "该模型需要会员解锁")
                          return
                        }
                        addModel(model)
                      }}
                      className={`mt-3 flex h-8 w-full items-center justify-center gap-1 rounded-md border text-sm font-semibold transition-colors ${locked ? "border-border bg-muted text-muted-foreground hover:bg-muted/80" : "border-brand/20 bg-brand/10 text-brand hover:bg-brand hover:text-white"}`}
                    >
                      {locked ? (
                        <>
                          <Crown className="h-3.5 w-3.5" />
                          升级解锁
                        </>
                      ) : "+ 添加模型"}
                    </button>
                  </div>
                )
              })}
            </div>
          </section>
          {hoverPreview?.model.modelPath && (
            <div
              className="pointer-events-none fixed z-[80] h-64 w-64 overflow-hidden rounded-lg border border-border bg-card shadow-2xl"
              style={{ left: hoverPreview.x, top: hoverPreview.y }}
            >
              <div className="h-52 bg-[radial-gradient(circle_at_35%_20%,white,oklch(0.88_0.018_190))]">
                <ModelCardPreview path={hoverPreview.model.modelPath} live />
              </div>
              <div className="border-t border-border bg-card px-3 py-2">
                <p className="text-sm font-semibold">{hoverPreview.model.name}</p>
                <p className="text-xs text-muted-foreground">实时 3D 预览</p>
              </div>
            </div>
          )}
        </aside>

        <section className={`relative min-h-[720px] overflow-hidden bg-[#c4d7d4] ${isEditorExpanded ? "fixed inset-0 z-[90] h-screen" : "lg:h-[calc(100vh-4rem)]"}`}>
          <div className="absolute left-6 top-6 z-10">
            <h2 className="mt-1 text-3xl font-semibold text-neutral-950">3D 鱼缸编辑器</h2>
          </div>
          <div className="absolute left-6 top-20 z-10 flex rounded-lg border border-white/70 bg-white/85 p-1 shadow-lg backdrop-blur-sm">
            {transformModes.map((mode) => {
              const Icon = mode.icon
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setTransformMode(mode.id)}
                  className={`flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors ${transformMode === mode.id ? "bg-neutral-950 text-white" : "text-neutral-700 hover:bg-white"}`}
                >
                  <Icon className="h-4 w-4" />
                  {mode.label}
                </button>
              )
            })}
          </div>
          <div className="absolute right-6 top-6 z-10 flex gap-2">
<ViewCube value={viewPreset} rotation={viewCubeRotation} onChange={setViewPreset} />
            <Button variant="outline" size="icon" aria-label={isEditorExpanded ? "退出全屏预览" : "全屏预览"} onClick={() => setIsEditorExpanded((value) => !value)}>
              {isEditorExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="删除当前模型"
              disabled={!selectedModel}
              onClick={() => {
                if (!selectedModel) return
                commitModels((current) => current.filter((model) => model.id !== selectedModel.id))
                setSelectedModelId(null)
                setSelectedModelIds([])
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          {editorNotice && (
            <div
              className="pointer-events-none absolute right-6 top-36 z-20 rounded-lg border border-white/70 bg-neutral-950/88 px-4 py-2 text-sm font-medium text-white shadow-xl backdrop-blur-sm"
              aria-live="polite"
            >
              {editorNotice}
            </div>
          )}
          <ThreeCanvas
            tankSize={tankSize}
            materials={models}
            selectedMaterialId={selectedModel?.id ?? null}
            selectedMaterialIds={selectedModelIds}
            onMaterialSelect={(id) => {
              setSelectedModelId(id)
              setSelectedModelIds(id ? [id] : [])
            }}
            onMaterialSelectionChange={(ids) => {
              setSelectedModelIds(ids)
              setSelectedModelId(ids.at(-1) ?? null)
            }}
            onMaterialUpdate={(id, patch) => {
              setModels((current) => {
                recordTransformHistory(current)
                return current.map((model) => model.id === id ? { ...model, ...patch } : model)
              })
            }}
            onMaterialsUpdate={(updates) => {
              setModels((current) => {
                recordTransformHistory(current)
                return current.map((model) => updates[model.id] ? { ...model, ...updates[model.id] } : model)
              })
            }}
            onMaterialBounds={(id, bounds) => {
              setModels((current) => current.map((model) => {
                if (model.id !== id) return model
                const sameBounds = model.bounds
                  && Math.abs(model.bounds.halfX - bounds.halfX) < 0.01
                  && Math.abs(model.bounds.halfZ - bounds.halfZ) < 0.01
                  && Math.abs(model.bounds.height - bounds.height) < 0.01
                return sameBounds ? model : { ...model, bounds }
              }))
            }}
            transformMode={transformMode}
            viewPreset={viewPreset}
            onCameraRotationChange={setViewCubeRotation}
          />
        </section>

        <aside className="border-l border-border/70 bg-background p-4 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
          <div className="mb-5">
            <h2 className="mt-1 text-2xl font-semibold">属性编辑</h2>
          </div>

          {selectedModel ? (
            <>
              <section className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-md bg-muted">
                    <CheckCircle2 className="h-6 w-6 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedModel.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedModel.material} · {selectedModel.color}</p>
                  </div>
                </div>
              </section>

              <section className="mt-4 rounded-lg border border-border bg-card p-4">
                <h3 className="mb-3 text-sm font-semibold">3D打印材质</h3>
                <div className="grid grid-cols-2 gap-2">
                  {printMaterials.map((material) => (
                    <button
                      key={material.name}
                      onClick={() => {
                        const fixedColor = material.name === "仿木PLA" ? "木纹色" : material.name === "半透明树脂" ? "半透明白" : selectedModel.color
                        updateSelected({ material: material.name, color: fixedColor })
                      }}
                      className={`rounded-md border p-2 text-left transition-colors ${selectedModel.material === material.name ? "border-brand bg-brand/10" : "border-border hover:border-brand/50"}`}
                    >
                      <p className="text-sm font-medium">{material.name}</p>
                      <p className="mt-1 text-[11px] leading-4 text-muted-foreground">{material.desc}</p>
                    </button>
                  ))}
                </div>
              </section>

              <section className="mt-4 rounded-lg border border-border bg-card p-4">
                <h3 className="mb-3 text-sm font-semibold">颜色选择</h3>
                <div className="space-y-3">
                  {colorGroups.map((group) => (
                    <div key={group.name}>
                      <p className="mb-2 text-xs text-muted-foreground">{group.name}</p>
                      <div className="flex flex-wrap gap-2">
                        {group.colors.map((color, index) => {
                          const enabled = canUseColor(selectedModel.material, group.name, color)
                          return (
                            <button
                              key={color}
                              disabled={!enabled}
                              title={enabled ? color : `${selectedModel.material} 不支持该颜色`}
                              onClick={() => {
                                updateSelected({ color })
                              }}
                              className={`h-8 w-8 rounded-full border transition-all ${selectedModel.color === color ? "ring-2 ring-brand ring-offset-2" : "border-border"} ${enabled ? "" : "cursor-not-allowed opacity-25"}`}
                              style={{ backgroundColor: group.swatches[index] }}
                            />
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      updateSelected({ material: "丝光PLA", color: "暖泥灰", x: 0, y: 3, z: 0, scale: 1, scaleX: 1, scaleY: 1, scaleZ: 1 })
                    }}
                  >
                    重置
                  </Button>
                  <Button className="flex-1">完成</Button>
                </div>
              </section>
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">选中或添加一个模型后，这里显示材质与颜色属性。</div>
          )}

          <section className="mt-4 rounded-lg border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <ShoppingCart className="h-4 w-4 text-brand" />
                购物清单
              </div>
              <span className="rounded-full bg-brand px-2 py-0.5 text-xs text-white">{models.length}</span>
            </div>
            <div className="space-y-2">
              {models.map((model) => (
                <button key={model.id} onClick={() => { setSelectedModelId(model.id); setSelectedModelIds([model.id]) }} className="flex w-full items-center justify-between rounded-md bg-muted/60 px-3 py-2 text-left text-sm">
                  <span className="truncate">{model.name}</span>
                  <span className="font-medium">¥{model.price}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><CircleDollarSign className="h-4 w-4" />合计</div>
              <p className="text-xl font-semibold">¥{total}</p>
            </div>
            <Button className="mt-3 w-full" onClick={startCheckout}>一键下单</Button>
          </section>

        </aside>
      </div>

      <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
        {aiOpen && (
          <form
            className="w-[min(360px,calc(100vw-32px))] rounded-xl border border-border bg-background p-4 shadow-2xl"
            onSubmit={(event) => {
              event.preventDefault()
              setChatInput("")
            }}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="h-4 w-4 text-brand" />
                  AI 辅助
                </div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  生成布局建议、材质建议和清单说明。
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAiOpen(false)}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="关闭 AI 辅助"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mb-3 grid grid-cols-2 gap-2">
              {["推荐组合", "检查可行性", "生成清单", "材质建议"].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setChatInput(prompt)}
                  className="rounded-md border border-border bg-card px-3 py-2 text-left text-xs transition-colors hover:border-brand/50 hover:text-brand"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="描述想要的组合风格"
                className="h-10"
              />
              <Button type="submit" size="icon" aria-label="发送">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <MessageSquareText className="h-3 w-3" />
              例如：给神秘洞穴风格推荐 3 个可堆叠模型。
            </p>
          </form>
        )}

        <button
          type="button"
          onClick={() => setAiOpen((open) => !open)}
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-2xl shadow-brand/30 transition-all hover:-translate-y-0.5 hover:bg-brand/90"
          aria-label="打开 AI 辅助"
        >
          <Sparkles className="h-6 w-6 transition-transform group-hover:rotate-12" />
        </button>
      </div>
    </main>
  )
}
