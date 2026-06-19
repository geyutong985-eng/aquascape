import type { Design, DesignColor, ShowcaseItem } from "@/types";

export const designStyles = ["热带礁景", "暗夜海礁", "极简月景", "柔光艺术", "童趣主题", "未来几何", "自然草缸"] as const;

export const printMaterials = [
  { name: "哑光树脂", desc: "细节清晰、低反光，适合仿石、洞穴和礁石结构。", fit: "礁石、月球洞穴、几何模块" },
  { name: "半透明树脂", desc: "透光柔和，适合气泡、水晶感和轻盈主题。", fit: "浮动气泡群、月光主题" },
  { name: "仿木PLA", desc: "带木纹质感，适合沉木、船体和自然草缸。", fit: "沉船雨林、自然风格" },
  { name: "丝光PLA", desc: "带轻微珠光，适合柔和、可爱或艺术化摆件。", fit: "摇曳海草、童趣主题" },
  { name: "夜光树脂", desc: "可做弱发光效果，适合夜景和未来感主题。", fit: "暗夜海礁、未来几何" },
] as const;

export const colorGroups = [
  { name: "深海蓝灰", value: "#4D6F8A" },
  { name: "月岩灰", value: "#8D9298" },
  { name: "珊瑚白", value: "#EEE6D5" },
  { name: "水晶蓝", value: "#83CFE0" },
  { name: "鼠尾草绿", value: "#A7B89A" },
  { name: "柔粉", value: "#E8B7B0" },
  { name: "象牙白", value: "#F2E3C2" },
  { name: "珊瑚橙", value: "#D86B42" },
  { name: "炭黑", value: "#1D2A2C" },
  { name: "深青", value: "#0D6B6C" },
] as const satisfies DesignColor[];

const c = (name: string, value: string): DesignColor => ({ name, value });

export const designs: Design[] = [
  {
    id: "electric-reef-arch",
    title: "蓝岩珊瑚拱",
    description: "蓝灰色礁石拱门搭配浅色珊瑚与高杆水草，适合想要强视觉中心、又保留真实草缸层次的中大型鱼缸。",
    coverImage: "/gallery/aquascapes/reef-coral-arch.png",
    galleryImages: ["/gallery/aquascapes/reef-coral-arch.png", "/gallery/aquascapes/moon-coral-tank.png", "/gallery/aquascapes/electric-reef-tank.png"],
    author: "Finscape Studio",
    authorType: "official",
    isFeatured: true,
    isPublic: true,
    style: "热带礁景",
    height: "tall",
    tankSize: { length: 90, width: 45, height: 50 },
    models: [
      { name: "礁石拱门", tags: ["主景", "躲避洞", "可拼接"], price: 168, material: "哑光树脂", color: c("深海蓝灰", "#4D6F8A") },
      { name: "珊瑚点缀组", tags: ["点缀", "热带", "可换色"], price: 86, material: "哑光树脂", color: c("珊瑚白", "#EEE6D5") },
    ],
    materials: ["哑光树脂"],
    colors: [c("深海蓝灰", "#4D6F8A"), c("珊瑚白", "#EEE6D5"), c("水草绿", "#6FA56E")],
    priceMin: 254,
    priceMax: 398,
    viewCount: 2180,
    createdAt: "2026-06-18",
  },
  {
    id: "moon-coral-night",
    title: "月礁夜景",
    description: "黑底鱼缸里用月球洞穴和象牙珊瑚制造强烈明暗对比，适合喜欢高级、克制、带一点展陈感的鱼缸。",
    coverImage: "/gallery/aquascapes/moon-coral-tank.png",
    galleryImages: ["/gallery/aquascapes/moon-coral-tank.png", "/gallery/aquascapes/moon-bubble-tank.png", "/gallery/aquascapes/reef-coral-arch.png"],
    author: "Finscape Studio",
    authorType: "official",
    isFeatured: true,
    isPublic: true,
    style: "暗夜海礁",
    height: "medium",
    tankSize: { length: 60, width: 35, height: 40 },
    models: [
      { name: "月球洞穴", tags: ["洞穴", "主景", "夜景"], price: 128, material: "哑光树脂", color: c("月岩灰", "#8D9298") },
      { name: "枝状珊瑚组", tags: ["点缀", "留白", "海礁"], price: 118, material: "哑光树脂", color: c("珊瑚白", "#EEE6D5") },
    ],
    materials: ["哑光树脂"],
    colors: [c("月岩灰", "#8D9298"), c("珊瑚白", "#EEE6D5"), c("墨黑背景", "#111416")],
    priceMin: 246,
    priceMax: 368,
    viewCount: 1934,
    createdAt: "2026-06-18",
  },
  {
    id: "bubble-moon-studio",
    title: "月泡白沙",
    description: "半透明气泡群和月球洞穴放在白沙里，整体干净、轻盈，适合小缸和桌面缸。",
    coverImage: "/gallery/aquascapes/moon-bubble-tank.png",
    galleryImages: ["/gallery/aquascapes/moon-bubble-tank.png", "/gallery/aquascapes/moon-coral-tank.png", "/gallery/aquascapes/ferris-bubble-tank.png"],
    author: "Finscape Studio",
    authorType: "official",
    isFeatured: true,
    isPublic: true,
    style: "极简月景",
    height: "short",
    tankSize: { length: 45, width: 28, height: 30 },
    models: [
      { name: "浮动气泡群", tags: ["透明", "轻盈", "点缀"], price: 78, material: "半透明树脂", color: c("水晶蓝", "#83CFE0") },
      { name: "月球洞穴", tags: ["洞穴", "小缸", "主景"], price: 118, material: "哑光树脂", color: c("月岩灰", "#8D9298") },
    ],
    materials: ["半透明树脂", "哑光树脂"],
    colors: [c("水晶蓝", "#83CFE0"), c("月岩灰", "#8D9298"), c("白沙", "#EDE5D8")],
    priceMin: 196,
    priceMax: 298,
    viewCount: 1672,
    createdAt: "2026-06-18",
  },
  {
    id: "pink-ribbon-meadow",
    title: "粉草浮庭",
    description: "单个摇曳海草模型被做成柔粉和鼠尾草绿的雕塑感主景，适合想要柔软、灵动但不复杂的造景。",
    coverImage: "/gallery/aquascapes/seagrass-meadow.png",
    galleryImages: ["/gallery/aquascapes/seagrass-meadow.png", "/gallery/aquascapes/moon-bubble-tank.png", "/gallery/aquascapes/ferris-bubble-tank.png"],
    author: "Finscape Studio",
    authorType: "official",
    isFeatured: true,
    isPublic: true,
    style: "柔光艺术",
    height: "medium",
    tankSize: { length: 45, width: 30, height: 32 },
    models: [{ name: "摇曳海草", tags: ["单体主景", "柔软线条", "可换色"], price: 138, material: "丝光PLA", color: c("鼠尾草绿", "#A7B89A") }],
    materials: ["丝光PLA"],
    colors: [c("鼠尾草绿", "#A7B89A"), c("柔粉", "#E8B7B0"), c("深水青", "#14393A")],
    priceMin: 138,
    priceMax: 228,
    viewCount: 1518,
    createdAt: "2026-06-18",
  },
  {
    id: "bubble-ferris-park",
    title: "气泡游乐园",
    description: "象牙白摩天轮和半透明气泡组合成更轻松的主题缸，保留童趣，但整体色彩更克制。",
    coverImage: "/gallery/aquascapes/ferris-bubble-tank.png",
    galleryImages: ["/gallery/aquascapes/ferris-bubble-tank.png", "/gallery/aquascapes/moon-bubble-tank.png", "/gallery/aquascapes/seagrass-meadow.png"],
    author: "Finscape Studio",
    authorType: "official",
    isFeatured: true,
    isPublic: true,
    style: "童趣主题",
    height: "short",
    tankSize: { length: 50, width: 30, height: 34 },
    models: [
      { name: "旋转摩天轮", tags: ["主题", "小缸", "可换色"], price: 156, material: "丝光PLA", color: c("象牙白", "#F2E3C2") },
      { name: "浮动气泡群", tags: ["透明", "点缀", "水感"], price: 78, material: "半透明树脂", color: c("水晶蓝", "#83CFE0") },
    ],
    materials: ["丝光PLA", "半透明树脂"],
    colors: [c("象牙白", "#F2E3C2"), c("珊瑚橙", "#D86B42"), c("水晶蓝", "#83CFE0")],
    priceMin: 234,
    priceMax: 346,
    viewCount: 1326,
    createdAt: "2026-06-18",
  },
  {
    id: "cyan-geometry-reef",
    title: "青黑几何礁",
    description: "炭黑几何礁石和透明气泡形成更现代的构成感，适合偏科技、极简、深色背景的鱼缸。",
    coverImage: "/gallery/aquascapes/electric-reef-tank.png",
    galleryImages: ["/gallery/aquascapes/electric-reef-tank.png", "/gallery/aquascapes/moon-coral-tank.png", "/gallery/aquascapes/moon-bubble-tank.png"],
    author: "Finscape Studio",
    authorType: "official",
    isFeatured: true,
    isPublic: true,
    style: "未来几何",
    height: "medium",
    tankSize: { length: 75, width: 35, height: 40 },
    models: [
      { name: "几何礁石模块", tags: ["模块化", "现代", "躲避洞"], price: 188, material: "哑光树脂", color: c("炭黑", "#1D2A2C") },
      { name: "浮动气泡群", tags: ["透明", "对比", "点缀"], price: 78, material: "半透明树脂", color: c("水晶蓝", "#83CFE0") },
    ],
    materials: ["哑光树脂", "半透明树脂"],
    colors: [c("炭黑", "#1D2A2C"), c("深青", "#0D6B6C"), c("水晶蓝", "#83CFE0")],
    priceMin: 266,
    priceMax: 420,
    viewCount: 1214,
    createdAt: "2026-06-18",
  },
  {
    id: "pirate-jungle-garden",
    title: "沉船雨林",
    description: "把海盗船模型做成沉木感主景，再和洞壁模块、密植水草组合，整体更像雨林草缸，而不是破败遗迹。",
    coverImage: "/gallery/aquascapes/pirate-cave-garden.png",
    galleryImages: ["/gallery/aquascapes/pirate-cave-garden.png", "/gallery/aquascapes/reef-coral-arch.png", "/gallery/aquascapes/seagrass-meadow.png"],
    author: "Finscape Studio",
    authorType: "official",
    isFeatured: false,
    isPublic: true,
    style: "自然草缸",
    height: "tall",
    tankSize: { length: 100, width: 45, height: 50 },
    models: [
      { name: "海盗船沉木", tags: ["主景", "沉木感", "密植"], price: 228, material: "仿木PLA", color: c("深木棕", "#6A4630") },
      { name: "洞壁庇护所", tags: ["洞穴", "层次", "可拼接"], price: 138, material: "哑光树脂", color: c("砂岩米", "#BDA879") },
    ],
    materials: ["仿木PLA", "哑光树脂"],
    colors: [c("深木棕", "#6A4630"), c("砂岩米", "#BDA879"), c("水草绿", "#4F8F45")],
    priceMin: 366,
    priceMax: 560,
    viewCount: 1088,
    createdAt: "2026-06-18",
  },
];

export const publicDesigns = designs.filter((design) => design.isPublic);

export const featuredDesigns = designs.filter((design) => design.isFeatured);

export function getDesignById(id: string) {
  return designs.find((design) => design.id === id);
}

export function getMaterialInfo(name: string) {
  return printMaterials.find((material) => material.name === name);
}

export function toShowcaseItem(design: Design): ShowcaseItem {
  return {
    id: design.id,
    title: design.title,
    style: design.style,
    author: design.author,
    height: design.height,
    priceMin: design.priceMin,
    priceMax: design.priceMax,
    materials: design.materials,
    colors: design.colors,
    modelCount: design.models.length,
    coverImage: design.coverImage,
  };
}
