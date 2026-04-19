import Link from "next/link";
import { Button } from "@/components/ui/button";

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
          <h1 className="heading-display text-foreground mb-8 tracking-tight">
            Build Your Dream <span className="text-brand" style={{ fontFamily: "'Young Serif', serif" }}>Aquarium</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed">
            Design stunning <span className="text-foreground font-bold">aquascapes</span> with AI assistance. <span className="text-foreground font-bold">Visualize</span> in 3D. <span className="text-foreground font-bold">Print</span> your creation with precision.
          </p>

          <FeatureTags />

          <CTAButton />
        </HeroContent>
      </div>
    </section>
  );
}

import { HeroContent } from "./hero-content";
import { WaveDecoration } from "@/components/decorations/wave-decoration";
import { BubbleBackground } from "@/components/decorations/bubble-background";
import { FeatureTags } from "./feature-tags";
import { CTAButton } from "./cta-button";