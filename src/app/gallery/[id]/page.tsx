import Link from "next/link";
import { Eye } from "@/components/icons";
import { Footer, Header } from "@/components/layouts";
import { Button } from "@/components/ui/button";
import { DesignActions, DesignPreviewPanel, GalleryBackLink, MaterialSwatch, ModelCard } from "@/components/gallery";
import { getDesignById, getMaterialInfo, publicDesigns } from "@/lib/designs";

interface GalleryDetailPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return publicDesigns.map((design) => ({ id: design.id }));
}

export default async function GalleryDetailPage({ params }: GalleryDetailPageProps) {
  const { id } = await params;
  const design = getDesignById(id);

  if (!design) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 pt-20 text-center">
          <h1 className="text-3xl font-heading text-foreground">Design not found</h1>
          <p className="mt-3 text-muted-foreground">这个设计可能已经下架，或者链接写错了。</p>
          <Button asChild className="mt-6">
            <Link href="/gallery">浏览 Gallery</Link>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 md:px-8">
          <nav className="mb-8 flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <GalleryBackLink />
            </div>
            <Button asChild variant="brand">
              <Link href="/gallery">去 Gallery</Link>
            </Button>
          </nav>

          <section className="grid items-stretch gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
            <DesignPreviewPanel design={design} />

            <aside className="flex">
              <div className="flex h-full w-full flex-col rounded-lg border bg-card p-6">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-brand/10 px-3 py-1 text-sm text-brand">{design.style}</span>
                  <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">{design.authorType === "official" ? "Official" : "Community"}</span>
                </div>
                <h1 className="mt-5 text-4xl font-heading leading-tight text-foreground">{design.title}</h1>
                <p className="mt-4 leading-relaxed text-muted-foreground">{design.description}</p>

                <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  <Info label="作者" value={design.author} />
                  <Info label="鱼缸尺寸" value={`${design.tankSize.length}×${design.tankSize.width}×${design.tankSize.height}cm`} />
                  <Info label="模型数量" value={`${design.models.length} 个模型`} />
                  <Info label="浏览量" value={`${design.viewCount}`} icon={<Eye className="h-4 w-4" />} />
                </div>

                <div className="mt-6 border-t pt-6">
                  <p className="text-sm text-muted-foreground">参考价格区间</p>
                  <p className="mt-1 text-3xl font-semibold text-foreground">¥{design.priceMin}–{design.priceMax}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    具体价格会根据鱼缸尺寸、模型缩放、打印材料、颜色工艺和最终数量重新计算。
                  </p>
                </div>

                <div className="mt-auto grid gap-3 pt-6">
                  <Button asChild variant="brand" size="lg">
                    <Link href={`/editor?template=${design.id}`}>以此为基础</Link>
                  </Button>
                  <DesignActions />
                </div>
              </div>
            </aside>
          </section>

          <section className="mt-16 border-t border-border pt-10">
            <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-semibold tracking-[0.18em] text-brand">TEMPLATE DETAILS</p>
                <h2 className="mt-2 text-2xl font-heading text-foreground md:text-3xl">模板构成</h2>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                模型、材质和颜色分开查看，方便判断这个模板是否适合你的鱼缸尺寸与整体风格。
              </p>
            </div>

            <div className="grid items-start gap-8 lg:grid-cols-[minmax(360px,1.15fr)_minmax(280px,0.85fr)_minmax(220px,0.7fr)]">
              <div>
                <SectionHeading title="模型清单" desc="这个设计中使用的 3D 模型组件。" />
                <div className="mt-5 space-y-3">
                  {design.models.map((model) => (
                    <ModelCard key={`${model.name}-${model.material}`} model={model} />
                  ))}
                </div>
              </div>

              <div>
                <SectionHeading title="材质说明" desc="每个模型当前建议的打印材质。" />
                <div className="mt-5 space-y-3">
                  {design.materials.map((material) => {
                    const info = getMaterialInfo(material);
                    const colors = design.models.filter((model) => model.material === material).map((model) => model.color);
                    return <MaterialSwatch key={material} name={material} desc={info?.desc} fit={info?.fit} colors={colors} />;
                  })}
                </div>
              </div>

              <div>
                <SectionHeading title="颜色" desc="当前模板使用的颜色组合。" />
                <div className="mt-5 space-y-3">
                  {design.colors.map((color) => (
                    <div key={color.name} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                      <span className="h-8 w-8 rounded-full border border-border" style={{ backgroundColor: color.value }} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{color.name}</p>
                        <p className="text-xs text-muted-foreground">{color.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function SectionHeading({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <h2 className="text-2xl font-heading text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-md bg-muted/60 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 flex items-center gap-1 font-medium text-foreground">
        {icon}
        {value}
      </p>
    </div>
  );
}
