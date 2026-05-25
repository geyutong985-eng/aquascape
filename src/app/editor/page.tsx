"use client";

import { useRef, useState } from "react";
import Link from "next/link";

const styles = [
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
      { name: "单体大块", tags: ["躲藏", "堆叠"], price: 88 },
      { name: "留洞雕塑", tags: ["穿行", "点缀"], price: 108 },
      { name: "曲面体块", tags: ["点缀", "堆叠"], price: 94 },
      { name: "悬浮块体", tags: ["悬挂", "点缀"], price: 112 },
    ],
  },
];

const materials = [
  "丝光PLA",
  "渐变PLA",
  "哑光PLA",
  "光滑PLA",
  "哑光树脂",
  "PA12尼龙",
  "仿木PLA",
  "半透明树脂",
];

const colorGroups = [
  { name: "莫兰迪灰", colors: [["灰豆绿", "#9baa95"], ["灰蓝", "#8d9fac"], ["灰紫", "#aaa0b8"], ["灰粉", "#c5a4a9"], ["灰棕", "#a4958d"], ["灰黄", "#beb48d"]] },
  { name: "浅色系", colors: [["象牙白", "#f4efe4"], ["奶油白", "#f5ead2"], ["浅暖灰", "#d8d4ca"], ["浅粉", "#e7c6cc"], ["浅蓝", "#c9dceb"], ["浅绿", "#cce2d3"]] },
  { name: "中灰系", colors: [["青灰", "#7f9294"], ["暖泥灰", "#9a8f82"], ["冷杉灰", "#697774"], ["中灰绿", "#718579"], ["中灰蓝", "#6f8190"]] },
  { name: "深灰系", colors: [["深炭灰", "#343434"], ["磨砂黑", "#111111"], ["深空灰", "#444a50"], ["深咖啡", "#3a2d27"], ["深墨绿", "#213a32"]] },
  { name: "自然色", colors: [["抹茶绿", "#8da568"], ["雾霾蓝", "#88a6b5"], ["脏橘色", "#c7774d"], ["松石绿", "#3d9d9a"], ["苔藓绿", "#5e7446"]] },
  { name: "马卡龙色", colors: [["薄荷绿", "#b9ead7"], ["樱花粉", "#f5bccb"], ["奶油黄", "#f8dfa0"], ["蜜桃橙", "#f4b28f"], ["薰衣草紫", "#c9b7e8"]] },
  { name: "高级色", colors: [["镏金色", "#c99a3d"], ["玫瑰金", "#b97868"], ["星空银", "#c6ccd2"], ["电镀蓝", "#3b6fb6"]] },
];

type Model = {
  id: string;
  name: string;
  material: string;
  color: string;
  colorHex: string;
  price: number;
  x: number;
  y: number;
  z: number;
  scale: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
};

export default function EditorPage() {
  const [activeStyle, setActiveStyle] = useState(styles[0].name);
  const [selectedId, setSelectedId] = useState("sample-1");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const counter = useRef(0);
  const dragRef = useRef<{ id: string; startX: number; startY: number; modelX: number; modelZ: number } | null>(null);
  const [models, setModels] = useState<Model[]>([
    { id: "sample-1", name: "幽灵脸洞", material: "丝光PLA", color: "暖泥灰", colorHex: "#9a8f82", price: 89, x: -18, y: 0, z: 4, scale: 1, scaleX: 1, scaleY: 1, scaleZ: 1 },
    { id: "sample-2", name: "扭曲枝条", material: "仿木PLA", color: "木纹色", colorHex: "#8b5f3d", price: 92, x: 18, y: 0, z: -6, scale: 0.9, scaleX: 1, scaleY: 1.2, scaleZ: 1 },
  ]);

  const activeGroup = styles.find((style) => style.name === activeStyle) ?? styles[0];
  const selected = models.find((model) => model.id === selectedId) ?? models[0];
  const total = models.reduce((sum, model) => sum + model.price, 0);

  const addModel = (model: { name: string; price: number }) => {
    counter.current += 1;
    const next = {
      id: `model-${counter.current}`,
      name: model.name,
      material: "丝光PLA",
      color: "暖泥灰",
      colorHex: "#9a8f82",
      price: model.price,
      x: (models.length % 3 - 1) * 18,
      y: 0,
      z: Math.floor(models.length / 3) * 10,
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
    };
    setModels((current) => [...current, next]);
    setSelectedId(next.id);
  };

  const updateSelected = (patch: Partial<Model>) => {
    setModels((current) => current.map((model) => model.id === selected.id ? { ...model, ...patch } : model));
  };

  const isColorEnabled = (material: string, groupName: string) => {
    if (material === "仿木PLA" || material === "半透明树脂") return false;
    if (material === "PA12尼龙") return groupName === "深灰系";
    return true;
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!dragRef.current) return;
    const { id, startX, startY, modelX, modelZ } = dragRef.current;
    const nextX = modelX + (clientX - startX) * 0.12;
    const nextZ = modelZ + (clientY - startY) * 0.12;
    setModels((current) => current.map((model) => model.id === id ? { ...model, x: nextX, z: nextZ } : model));
  };

  return (
    <main
      className="min-h-screen overflow-hidden bg-background text-foreground"
      onPointerMove={(event) => handleDragMove(event.clientX, event.clientY)}
      onPointerUp={() => { dragRef.current = null; }}
    >
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1680px] items-center gap-4 px-4 md:px-8">
          <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">← Back</Link>
          <div className="h-5 w-px bg-border" />
          <div>
            <p className="text-sm font-semibold tracking-widest text-brand">FINSCAPE EDITOR</p>
            <p className="text-xs text-muted-foreground">Catalog · 3D preview · Model properties</p>
          </div>
          <div className="ml-auto hidden items-center gap-2 md:flex">
            <button className="h-9 rounded-md border border-border px-3 text-sm">Undo</button>
            <button className="h-9 rounded-md border border-border px-3 text-sm">Save</button>
            <button className="h-9 rounded-md bg-foreground px-3 text-sm text-background">Export</button>
          </div>
        </div>
      </header>

      <div className="grid min-h-screen grid-cols-1 pt-16 lg:grid-cols-[360px_minmax(0,1fr)_330px]">
        <aside className="border-r border-border/70 bg-background p-4 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
          <p className="text-sm font-semibold text-muted-foreground">Step 1 of 4</p>
          <h1 className="mt-1 text-3xl font-semibold">选择模型</h1>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {styles.map((style) => (
              <button
                key={style.name}
                onClick={() => setActiveStyle(style.name)}
                className={`rounded-md border px-3 py-2 text-left text-sm font-medium transition-all ${activeStyle === style.name ? "border-brand bg-brand text-white shadow-sm" : "border-border bg-card hover:border-brand/50"}`}
              >
                {style.name}
              </button>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {activeGroup.models.map((model) => {
              const added = models.some((item) => item.name === model.name);
              return (
                <div key={model.name} className="group rounded-lg border border-border bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-md">
                  <div className="mb-3 flex aspect-square items-center justify-center rounded-md bg-[radial-gradient(circle_at_35%_20%,white,oklch(0.88_0.018_190))]">
                    <span className="text-3xl text-brand/70">◌</span>
                  </div>
                  <h3 className="text-sm font-semibold leading-snug">{model.name}</h3>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {model.tags.map((tag) => <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{tag}</span>)}
                  </div>
                  <button
                    onClick={() => addModel(model)}
                    className={`mt-3 flex h-8 w-full items-center justify-center rounded-md text-sm font-medium transition-colors ${added ? "bg-brand/10 text-brand" : "bg-foreground text-background opacity-0 group-hover:opacity-100"}`}
                  >
                    {added ? "✓ 已添加" : "+ 加入组合"}
                  </button>
                </div>
              );
            })}
          </div>
        </aside>

        <section className="relative min-h-[660px] overflow-hidden bg-[#c9c9c9]">
          <div className="absolute left-6 top-6 z-10">
            <p className="text-sm font-semibold text-neutral-700">Step 2 of 4</p>
            <h2 className="mt-1 text-3xl font-semibold text-neutral-900">拖拽组合鱼缸造景</h2>
          </div>

          <div className="absolute inset-0 flex items-center justify-center pt-10">
            <div className="relative h-[520px] w-[min(860px,86vw)]" style={{ perspective: "1100px" }}>
              <div className="absolute left-1/2 top-1/2 h-[320px] w-[620px] -translate-x-1/2 -translate-y-1/2 rotate-x-[58deg] rotate-z-[-38deg] border-4 border-white/90 bg-[#caa173] shadow-2xl">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,.12)_1px,transparent_1px)] bg-[size:40px_40px]" />
              </div>
              <div className="absolute left-1/2 top-[31%] h-[210px] w-[620px] -translate-x-1/2 rotate-x-[58deg] rotate-z-[-38deg] border-l-4 border-t-4 border-white/90 bg-white/20" />
              <div className="absolute left-[22%] top-[30%] h-[210px] w-[330px] rotate-x-[58deg] rotate-z-[52deg] border-l-4 border-t-4 border-white/90 bg-white/20" />

              {models.map((model) => {
                const selectedModel = selectedId === model.id;
                return (
                  <button
                    key={model.id}
                    onPointerDown={(event) => {
                      setSelectedId(model.id);
                      dragRef.current = { id: model.id, startX: event.clientX, startY: event.clientY, modelX: model.x, modelZ: model.z };
                    }}
                    className={`absolute left-1/2 top-1/2 flex h-20 w-20 items-center justify-center rounded-[42%] border text-xs font-semibold shadow-xl transition-shadow ${selectedModel ? "border-[3px] border-[#ffd400] ring-4 ring-brand/30" : "border border-white/70"}`}
                    style={{
                      backgroundColor: model.colorHex,
                      transform: `translate(calc(-50% + ${model.x * 4}px), calc(-50% + ${model.z * 3}px)) scale(${model.scale * model.scaleX}, ${model.scale * model.scaleY})`,
                      zIndex: Math.round(100 + model.z),
                    }}
                  >
                    <span className="max-w-[64px] text-center leading-tight text-white drop-shadow">{model.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 z-10 grid w-[min(760px,calc(100%-48px))] -translate-x-1/2 grid-cols-2 gap-3 rounded-lg border border-white/70 bg-white/85 p-3 shadow-xl backdrop-blur-sm md:grid-cols-4">
            {["选择", "拖拽", "调参", "下单"].map((step, index) => (
              <div key={step} className="flex items-center gap-2 text-sm">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${index < 2 ? "bg-black text-white" : "bg-muted text-muted-foreground"}`}>{index + 1}</span>
                {step}
              </div>
            ))}
          </div>
        </section>

        <aside className="border-l border-border/70 bg-background p-4 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
          <p className="text-sm font-semibold text-muted-foreground">Step 3 of 4</p>
          <h2 className="mt-1 text-2xl font-semibold">属性编辑</h2>

          {selected ? (
            <>
              <section className="mt-5 rounded-lg border border-border bg-card p-4">
                <h3 className="font-semibold">{selected.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{selected.material} · {selected.color}</p>
                <p className="mt-2 text-xs text-muted-foreground">选中模型已用黄色描边高亮。可在中间视窗拖拽移动。</p>
              </section>

              <section className="mt-4 rounded-lg border border-border bg-card p-4">
                <h3 className="mb-3 text-sm font-semibold">位置与缩放</h3>
                <div className="grid grid-cols-3 gap-2">
                  {(["x", "y", "z"] as const).map((axis) => (
                    <label key={axis} className="space-y-1">
                      <span className="text-xs uppercase text-muted-foreground">{axis}轴</span>
                      <input className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm" type="number" value={Number(selected[axis].toFixed(1))} onChange={(event) => updateSelected({ [axis]: Number(event.target.value) })} />
                    </label>
                  ))}
                </div>
                <label className="mt-3 block space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground"><span>整体放大</span><span>{selected.scale.toFixed(2)}x</span></div>
                  <input className="w-full accent-[oklch(0.25_0.15_195)]" type="range" min="0.4" max="2.2" step="0.05" value={selected.scale} onChange={(event) => updateSelected({ scale: Number(event.target.value) })} />
                </label>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {([["scaleX", "X缩放"], ["scaleY", "Y缩放"], ["scaleZ", "Z缩放"]] as const).map(([field, label]) => (
                    <label key={field} className="space-y-1">
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <input className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm" type="number" min="0.3" max="2.5" step="0.1" value={Number(selected[field].toFixed(1))} onChange={(event) => updateSelected({ [field]: Number(event.target.value) })} />
                    </label>
                  ))}
                </div>
              </section>

              <section className="mt-4 rounded-lg border border-border bg-card p-4">
                <h3 className="mb-3 text-sm font-semibold">3D打印材质</h3>
                <div className="grid grid-cols-2 gap-2">
                  {materials.map((material) => (
                    <button
                      key={material}
                      onClick={() => updateSelected({ material, color: material === "仿木PLA" ? "木纹色" : material === "半透明树脂" ? "半透明白" : selected.color, colorHex: material === "仿木PLA" ? "#8b5f3d" : material === "半透明树脂" ? "#dcebf0" : selected.colorHex })}
                      className={`rounded-md border p-2 text-left text-sm transition-colors ${selected.material === material ? "border-brand bg-brand/10" : "border-border hover:border-brand/50"}`}
                    >
                      {material}
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
                        {group.colors.map(([name, hex]) => {
                          const enabled = isColorEnabled(selected.material, group.name);
                          return (
                            <button
                              key={name}
                              disabled={!enabled}
                              title={enabled ? name : `${selected.material} 不支持该颜色`}
                              onClick={() => updateSelected({ color: name, colorHex: hex })}
                              className={`h-8 w-8 rounded-full border transition-all ${selected.color === name ? "ring-2 ring-brand ring-offset-2" : "border-border"} ${enabled ? "" : "cursor-not-allowed opacity-25"}`}
                              style={{ backgroundColor: hex }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : null}

          <section className="mt-4 rounded-lg border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">购物清单</h3>
              <span className="rounded-full bg-brand px-2 py-0.5 text-xs text-white">{models.length}</span>
            </div>
            <div className="space-y-2">
              {models.map((model) => (
                <button key={model.id} onClick={() => setSelectedId(model.id)} className="flex w-full items-center justify-between rounded-md bg-muted/60 px-3 py-2 text-left text-sm">
                  <span className="truncate">{model.name}</span>
                  <span className="font-medium">¥{model.price}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm text-muted-foreground">合计</span>
              <p className="text-xl font-semibold">¥{total}</p>
            </div>
            <button className="mt-3 h-10 w-full rounded-md bg-foreground text-sm font-medium text-background" disabled={models.length === 0}>一键下单</button>
          </section>
        </aside>
      </div>

      <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
        {!aiOpen && (
          <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground shadow-lg">
            不知道怎么搭配？点我问 AI
          </div>
        )}
        {aiOpen && (
          <form
            className="w-[min(360px,calc(100vw-32px))] rounded-xl border border-border bg-background p-4 shadow-2xl"
            onSubmit={(event) => {
              event.preventDefault();
              setAiInput("");
            }}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold">✦ AI 辅助</div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">生成布局建议、材质建议和清单说明。</p>
              </div>
              <button type="button" onClick={() => setAiOpen(false)} className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">×</button>
            </div>
            <div className="mb-3 grid grid-cols-2 gap-2">
              {["推荐组合", "检查可行性", "生成清单", "材质建议"].map((prompt) => (
                <button key={prompt} type="button" onClick={() => setAiInput(prompt)} className="rounded-md border border-border bg-card px-3 py-2 text-left text-xs transition-colors hover:border-brand/50 hover:text-brand">{prompt}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={aiInput} onChange={(event) => setAiInput(event.target.value)} placeholder="描述想要的组合风格" className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm" />
              <button type="submit" className="h-10 rounded-md bg-foreground px-3 text-sm text-background">发送</button>
            </div>
          </form>
        )}
        <button type="button" onClick={() => setAiOpen((open) => !open)} className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-2xl text-white shadow-2xl shadow-brand/30 transition-all hover:-translate-y-0.5 hover:bg-brand/90" aria-label="打开 AI 辅助">
          ✦
        </button>
      </div>
    </main>
  );
}
