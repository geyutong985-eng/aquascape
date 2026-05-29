"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Download,
  Maximize2,
  MessageSquareText,
  Move3D,
  PackagePlus,
  RotateCcw,
  Save,
  Send,
  ShoppingCart,
  Sparkles,
  StretchHorizontal,
  Trash2,
  Undo2,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

type CatalogModel = {
  name: string
  tags: string[]
  price: number
  modelPath?: string
  previewImage?: string
}

const styleGroups: { name: string; models: CatalogModel[] }[] = [
  {
    name: "神秘洞穴",
    models: [
      { name: "幽灵脸洞", tags: ["穿行", "躲藏"], price: 89 },
      { name: "怪兽洞穴", tags: ["躲藏", "堆叠"], price: 99 },
      { name: "表情凹陷", tags: ["点缀", "躲藏"], price: 79 },
      { name: "多孔洞洞穴", tags: ["穿行", "躲藏"], price: 109 },
      { name: "悬空桥洞", tags: ["穿行", "悬挂"], price: 119 },
    ],
  },
  {
    name: "轻盈典雅",
    models: [
      { name: "圆润曲块", tags: ["点缀", "堆叠"], price: 69 },
      { name: "抽象花瓣形", tags: ["点缀", "悬挂"], price: 88 },
      { name: "泡泡造型", tags: ["点缀", "躲藏"], price: 76 },
      { name: "小巧雕塑体块", tags: ["点缀"], price: 66 },
    ],
  },
  {
    name: "几何艺术",
    models: [
      { name: "环体拱门", tags: ["穿行", "点缀"], price: 98 },
      { name: "波纹墙", tags: ["躲藏", "悬挂"], price: 95 },
      { name: "网格塔", tags: ["堆叠", "躲藏"], price: 105 },
      { name: "柱阵块", tags: ["堆叠", "点缀"], price: 86 },
    ],
  },
  {
    name: "自然有机",
    models: [
      { name: "扭曲枝条", tags: ["悬挂", "点缀"], price: 92 },
      { name: "贝壳洞", tags: ["躲藏", "穿行"], price: 89 },
      { name: "珊瑚骨架", tags: ["穿行", "点缀"], price: 118 },
      { name: "菌菇洞", tags: ["躲藏", "堆叠"], price: 96 },
    ],
  },
  {
    name: "微型遗迹",
    models: [
      { name: "小型拱门", tags: ["穿行", "点缀"], price: 82 },
      { name: "塔尖模块", tags: ["堆叠", "点缀"], price: 78 },
      { name: "断桥残柱", tags: ["穿行", "堆叠"], price: 104 },
      { name: "石碑遗迹块", tags: ["点缀", "躲藏"], price: 86 },
    ],
  },
  {
    name: "极简现代",
    models: [
      { name: "单体大块", tags: ["躲藏", "堆叠"], price: 88, modelPath: "/models/minimal-modern/single-large-block/model.glb", previewImage: "/models/minimal-modern/single-large-block/preview.png" },
      { name: "留洞雕塑", tags: ["穿行", "点缀"], price: 108, modelPath: "/models/minimal-modern/hollow-sculpture/model.glb", previewImage: "/models/minimal-modern/hollow-sculpture/preview.png" },
      { name: "曲面体块", tags: ["点缀", "堆叠"], price: 94, modelPath: "/models/minimal-modern/curved-surface-block/model.glb", previewImage: "/models/minimal-modern/curved-surface-block/preview.png" },
      { name: "悬浮体块", tags: ["悬挂", "点缀"], price: 112, modelPath: "/models/minimal-modern/floating-block/model.glb", previewImage: "/models/minimal-modern/floating-block/preview.png" },
    ],
  },
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

const transformModes = [
  { id: "translate", label: "移动", icon: Move3D },
  { id: "scale", label: "缩放", icon: StretchHorizontal },
] as const

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
  modelPath?: string
  bounds?: {
    halfX: number
    halfZ: number
    height: number
  }
}

export default function EditorPage() {
  const [activeStyle, setActiveStyle] = useState("极简现代")
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null)
  const [chatInput, setChatInput] = useState("")
  const [aiOpen, setAiOpen] = useState(false)
  const [transformMode, setTransformMode] = useState<(typeof transformModes)[number]["id"]>("translate")
  const [hoverPreview, setHoverPreview] = useState<null | {
    model: CatalogModel
    x: number
    y: number
  }>(null)
  const modelIdCounter = useRef(0)
  const [models, setModels] = useState<AddedModel[]>([])

  const activeGroup = styleGroups.find((group) => group.name === activeStyle) ?? styleGroups[0]
  const selectedModel = models.find((model) => model.id === selectedModelId) ?? null
  const total = models.reduce((sum, model) => sum + model.price, 0)

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
      modelPath: model.modelPath,
    }
    setModels((current) => [...current, nextModel])
    setSelectedModelId(nextModel.id)
  }

  const updateSelected = (patch: Partial<AddedModel>) => {
    if (!selectedModel) return
    setModels((current) => current.map((model) => model.id === selectedModel.id ? { ...model, ...patch } : model))
  }

  const canUseColor = (material: string, groupName: string, colorName: string) => {
    if (material === "仿木PLA") return false
    if (material === "半透明树脂") return false
    if (material === "PA12尼龙") return groupName === "深灰系" || colorName === "磨砂黑"
    return true
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
            <Button variant="outline" size="sm"><Undo2 className="h-4 w-4" />撤销</Button>
            <Button variant="outline" size="sm"><RotateCcw className="h-4 w-4" />重做</Button>
            <Button variant="outline" size="sm"><Save className="h-4 w-4" />保存</Button>
            <Button size="sm"><Download className="h-4 w-4" />导出</Button>
          </div>
        </div>
      </header>

      <div className="grid min-h-screen grid-cols-1 pt-16 lg:grid-cols-[320px_minmax(0,1fr)_300px]">
        <aside className="border-r border-border/70 bg-background p-4 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
          <div className="mb-5">
            <h1 className="mt-1 text-3xl font-semibold">选择模型</h1>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {styleGroups.map((group) => (
              <button
                key={group.name}
                onClick={() => setActiveStyle(group.name)}
                className={`rounded-md border px-3 py-2 text-left text-sm font-medium transition-all ${activeStyle === group.name ? "border-brand bg-brand text-white shadow-sm" : "border-border bg-card hover:border-brand/50"}`}
              >
                {group.name}
              </button>
            ))}
          </div>

          <section className="mt-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">{activeStyle}</h2>
              <span className="text-xs text-muted-foreground">{activeGroup.models.length} 个模型</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {activeGroup.models.map((model) => {
                const added = models.some((item) => item.name === model.name)
                return (
                  <div
                    key={model.name}
                    className="group rounded-lg border border-border bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-md"
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
                    <div className="mb-3 flex aspect-square items-center justify-center rounded-md bg-[radial-gradient(circle_at_35%_20%,white,oklch(0.88_0.018_190))]">
                      {model.previewImage ? (
                        <img
                          src={model.previewImage}
                          alt={model.name}
                          className="h-full w-full object-contain p-2"
                          draggable={false}
                        />
                      ) : model.modelPath ? (
                        <div className="h-full w-full">
                          <ModelCardPreview path={model.modelPath} />
                          <span className="sr-only">悬浮预览 3D 模型</span>
                        </div>
                      ) : (
                        <PackagePlus className="h-8 w-8 text-brand/70" />
                      )}
                    </div>
                    <div className="min-h-12">
                      <h3 className="text-sm font-semibold leading-snug">{model.name}</h3>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {model.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => addModel(model)}
                      className={`mt-3 flex h-8 w-full items-center justify-center rounded-md text-sm font-medium transition-colors ${added ? "bg-brand/10 text-brand" : "bg-foreground text-background opacity-0 group-hover:opacity-100"}`}
                    >
                      {added ? <><Check className="mr-1 h-3.5 w-3.5" />已添加</> : "+ 加入组合"}
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

        <section className="relative min-h-[720px] overflow-hidden bg-[#c4d7d4] lg:h-[calc(100vh-4rem)]">
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
            <Button variant="outline" size="icon" aria-label="全屏预览"><Maximize2 className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" aria-label="清空视窗" onClick={() => setModels([])}><Trash2 className="h-4 w-4" /></Button>
          </div>
          <ThreeCanvas
            tankSize={{ length: 60, width: 30, height: 35 }}
            materials={models}
            selectedMaterialId={selectedModel?.id ?? null}
            onMaterialSelect={setSelectedModelId}
            onMaterialUpdate={(id, patch) => {
              setModels((current) => current.map((model) => model.id === id ? { ...model, ...patch } : model))
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
                <button key={model.id} onClick={() => setSelectedModelId(model.id)} className="flex w-full items-center justify-between rounded-md bg-muted/60 px-3 py-2 text-left text-sm">
                  <span className="truncate">{model.name}</span>
                  <span className="font-medium">¥{model.price}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><CircleDollarSign className="h-4 w-4" />合计</div>
              <p className="text-xl font-semibold">¥{total}</p>
            </div>
            <Button className="mt-3 w-full" disabled={models.length === 0}>一键下单</Button>
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
