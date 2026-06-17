"use client";

import { Card, CardContent } from "@/components/ui/card";

export function HowItWorks() {
  return (
    <section className="py-24 bg-background/60 dark:bg-zinc-900/80 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="heading-2 text-foreground mb-16 text-center">
          三步完成你的<span className="text-brand">专属造景</span>
        </h2>

        {/* 步骤容器 */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 md:gap-0">

          {/* Step 01 */}
          <div className="flex flex-col items-center text-center flex-1 group">
            <div className="flex items-center w-full">
              <div className="hidden md:block" style={{ flex: 1 }} />

              <div className="px-4">
                <div className="text-8xl font-semibold tracking-wider mb-2 text-foreground step-lights">
                  01
                </div>
              </div>

              <div className="flex-1 h-px bg-border/60 hidden md:block" />
            </div>

            <Card className="bg-transparent border-none shadow-none mt-4">
              <CardContent className="p-0">
                <h3 className="text-xl font-medium text-foreground mb-2">选择风格</h3>
                <p className="text-muted-foreground">从自然溪流到极简现代，先确定整体气质</p>
              </CardContent>
            </Card>
          </div>

          {/* Step 02 */}
          <div className="flex flex-col items-center text-center flex-1 group">
            <div className="flex items-center w-full">
              <div className="flex-1 h-px bg-border/60 hidden md:block" />

              <div className="px-4">
                <div className="text-8xl font-semibold tracking-wider mb-2 text-foreground step-lights animation-delay-1">
                  02
                </div>
              </div>

              <div className="flex-1 h-px bg-border/60 hidden md:block" />
            </div>

            <Card className="bg-transparent border-none shadow-none mt-4">
              <CardContent className="p-0">
                <h3 className="text-xl font-medium text-foreground mb-2">调整细节</h3>
                <p className="text-muted-foreground">选择尺寸、材质和模块，组合你的独特方案</p>
              </CardContent>
            </Card>
          </div>

          {/* Step 03 */}
          <div className="flex flex-col items-center text-center flex-1 group">
            <div className="flex items-center w-full">
              <div className="flex-1 h-px bg-border/60 hidden md:block" />

              <div className="px-4">
                <div className="text-8xl font-semibold tracking-wider mb-2 text-foreground step-lights animation-delay-2">
                  03
                </div>
              </div>

              <div className="hidden md:block" style={{ flex: 1 }} />
            </div>

            <Card className="bg-transparent border-none shadow-none mt-4">
              <CardContent className="p-0">
                <h3 className="text-xl font-medium text-foreground mb-2">打印交付</h3>
                <p className="text-muted-foreground">确认后进入 3D 打印制作，完成后配送到手</p>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
}
