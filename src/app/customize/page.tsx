"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Box, Check, Ruler } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type TankSize = { length: number; width: number; height: number }

const STORAGE_KEY = "finscape:tank-size"
const presets: { name: string; detail: string; size: TankSize }[] = [
  { name: "桌面小缸", detail: "适合少量点缀模型", size: { length: 45, width: 25, height: 30 } },
  { name: "标准景观缸", detail: "布局空间均衡", size: { length: 60, width: 30, height: 35 } },
  { name: "宽景展示缸", detail: "适合横向组合", size: { length: 90, width: 40, height: 45 } },
]

export default function CustomizePage() {
  const router = useRouter()
  const [tankSize, setTankSize] = useState<TankSize>(presets[1].size)

  const updateSize = (key: keyof TankSize, value: string) => {
    setTankSize((current) => ({ ...current, [key]: Number(value) }))
  }

  const isValid = tankSize.length >= 30 && tankSize.length <= 180
    && tankSize.width >= 20 && tankSize.width <= 80
    && tankSize.height >= 25 && tankSize.height <= 80

  const startDesigning = () => {
    if (!isValid) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tankSize))
    const params = new URLSearchParams(Object.entries(tankSize).map(([key, value]) => [key, String(value)]))
    router.push(`/editor?${params.toString()}`)
  }

  return (
    <main className="min-h-screen bg-[#eef5f3] px-5 py-10 text-foreground md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-9 max-w-2xl">
          <p className="text-sm font-semibold tracking-widest text-brand">FINSCAPE</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">选择你的鱼缸尺寸</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">尺寸会同步到 3D 编辑器，并作为模型移动、缩放和复制粘贴的边界。</p>
        </div>

        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section>
            <h2 className="mb-3 text-sm font-semibold">常用尺寸</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {presets.map((preset) => {
                const selected = Object.entries(preset.size).every(([key, value]) => tankSize[key as keyof TankSize] === value)
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setTankSize(preset.size)}
                    className={`relative min-h-40 rounded-lg border bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${selected ? "border-brand ring-1 ring-brand" : "border-border"}`}
                  >
                    {selected && <Check className="absolute right-3 top-3 h-4 w-4 text-brand" />}
                    <Box className="h-7 w-7 text-brand" />
                    <p className="mt-6 font-semibold">{preset.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{preset.detail}</p>
                    <p className="mt-3 text-sm font-medium">{preset.size.length} × {preset.size.width} × {preset.size.height} cm</p>
                  </button>
                )
              })}
            </div>
          </section>

          <aside className="rounded-lg border border-border bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Ruler className="h-5 w-5 text-brand" />
              <h2 className="font-semibold">自定义尺寸</h2>
            </div>
            <div className="space-y-4">
              {([
                ["length", "长度", "30 - 180 cm"],
                ["width", "宽度", "20 - 80 cm"],
                ["height", "高度", "25 - 80 cm"],
              ] as const).map(([key, label, range]) => (
                <label key={key} className="block">
                  <span className="mb-1.5 flex items-center justify-between text-sm font-medium">
                    {label}
                    <span className="text-xs font-normal text-muted-foreground">{range}</span>
                  </span>
                  <div className="relative">
                    <Input type="number" value={tankSize[key]} onChange={(event) => updateSize(key, event.target.value)} className="pr-10" />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">cm</span>
                  </div>
                </label>
              ))}
            </div>
            {!isValid && <p className="mt-3 text-xs text-destructive">请输入范围内的鱼缸尺寸。</p>}
            <Button className="mt-6 w-full" size="lg" disabled={!isValid} onClick={startDesigning}>
              进入编辑器
              <ArrowRight className="h-4 w-4" />
            </Button>
          </aside>
        </div>
      </div>
    </main>
  )
}
