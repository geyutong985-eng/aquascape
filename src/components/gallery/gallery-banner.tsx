"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Design } from "@/types";
import { DesignVisual } from "./design-visual";

interface GalleryBannerProps {
  designs: Design[];
}

export function GalleryBanner({ designs }: GalleryBannerProps) {
  const bannerDesigns = useMemo(() => designs.slice(0, 4), [designs]);
  const [active, setActive] = useState(0);
  const design = bannerDesigns[active] ?? designs[0];

  if (!design) return null;

  return (
    <section className="mb-10 overflow-hidden rounded-lg border bg-card">
      <Link href={`/gallery/${design.id}`} className="block">
        <DesignVisual
          image={design.coverImage}
          title={design.title}
          colors={design.colors}
          className="aspect-[16/9] min-h-[260px] md:aspect-[21/9] md:min-h-[360px]"
        />
      </Link>

      <div className="flex items-center justify-center gap-2 border-t bg-background/80 px-4 py-3">
        {bannerDesigns.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(index)}
            className={`h-2.5 rounded-full transition-all ${active === index ? "w-9 bg-brand" : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"}`}
            aria-label={`切换到 ${item.title}`}
          />
        ))}
      </div>
    </section>
  );
}
