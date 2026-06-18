export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Wave background - full screen */}
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        <WaveDecoration />
      </div>

      {/* Bubble particles - subtle overlay */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <BubbleBackground />
      </div>

      <div className="max-w-3xl mx-auto w-full relative text-center" style={{ zIndex: 3 }}>
        <HeroContent>
          <h1 className="heading-display text-foreground mb-8">
            定制你的理想
            <span className="block text-brand pl-[0.045em]">鱼缸造景</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed">
            用 <span className="text-foreground font-semibold">AI 辅助生成</span> 造景方案，实时
            <span className="text-foreground font-semibold"> 3D 预览</span>，再通过
            <span className="text-foreground font-semibold"> 精密 3D 打印</span> 把想象放进水里。
          </p>

          <FeatureTags />

          <CTAButton />
        </HeroContent>
      </div>
    </section>
  );
}

import { HeroContent } from "@/components/sections/hero-content";
import { WaveDecoration } from "@/components/decorations/wave-decoration";
import { BubbleBackground } from "@/components/decorations/bubble-background";
import { FeatureTags } from "./feature-tags";
import { CTAButton } from "./cta-button";
