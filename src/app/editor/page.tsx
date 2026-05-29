"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import {
  ArrowLeft,
  CheckCircle2,
  CircleDollarSign,
  Download,
  Maximize2,
  Minimize2,
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

function modelsWouldOverlap(a: AddedModel, b: AddedModel, padding = 0.32) {
  const aBox = getModelFootprint(a)
  const bBox = getModelFootprint(b)
  const overlapX = Math.abs(a.x - b.x) < aBox.halfX + bBox.halfX + padding
  const overlapZ = Math.abs(a.z - b.z) < aBox.halfZ + bBox.halfZ + padding
  const overlapY = a.y < b.y + bBox.height + padding && b.y < a.y + aBox.height + padding
  return overlapX && overlapZ && overlapY
}

function fitsInsideTank(model: AddedModel) {
  const bounds = getModelFootprint(model)
  const halfLength = 60 * 0.8 * 0.5 - bounds.halfX
  const halfWidth = 30 * 0.8 * 0.5 - bounds.halfZ
  return Math.abs(model.x) <= halfLength && Math.abs(model.z) <= halfWidth
}

function findPastePosition(model: AddedModel, placedModels: AddedModel[], pasteRound: number) {
  const directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
  ] as const
  const step = Math.max(3.2, Math.max(getModelFootprint(model).halfX, getModelFootprint(model).halfZ) * 2 + 0.8)

  for (let radius = pasteRound; radius < pasteRound + 9; radius += 1) {
    for (const [dx, dz] of directions) {
      const candidate = { ...model, x: model.x + dx * step * radius, z: model.z + dz * step * radius }
      if (fitsInsideTank(candidate) && !placedModels.some((item) => modelsWouldOverlap(candidate, item))) {
        return candidate
      }
    }
  }

  return null
}

export default function EditorPage() {
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
  const pasteCounter = useRef(0)
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
    pasteCounter.current += 1
    const pastedIds: string[] = []

    commitModels((current) => {
      const nextModels = [...current]
      copiedModels.current.forEach((model) => {
        const positioned = findPastePosition(cloneModelSnapshot(model), nextModels, pasteCounter.current)
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
                const addedCount = models.filter((item) => item.name === model.name).length
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
                    <div>
                      <div className="flex min-h-10 items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold leading-snug">{model.name}</h3>
                        {addedCount > 0 && (
                          <span className="shrink-0 rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand">{addedCount}</span>
                        )}
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {model.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => addModel(model)}
                      className="mt-3 flex h-8 w-full items-center justify-center rounded-md border border-brand/20 bg-brand/10 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
                    >
                      + 添加模型
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
            tankSize={{ length: 60, width: 30, height: 35 }}
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
