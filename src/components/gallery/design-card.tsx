"use client";

import { useState } from "react";
import Link from "next/link";
import type { Design } from "@/types";
import { Heart, ArrowUpRight } from "@/components/icons";
import { DesignVisual } from "./design-visual";

interface DesignCardProps {
  design: Design;
}

export function DesignCard({ design }: DesignCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="group mb-4 break-inside-avoid overflow-hidden rounded-lg border bg-card transition-colors hover:border-brand/50">
      <Link href={`/gallery/${design.id}`} className="block">
        <DesignVisual
          image={design.coverImage}
          title={design.title}
          colors={design.colors}
          className={`aspect-[4/3] ${design.height === "tall" ? "md:aspect-[3/4]" : design.height === "short" ? "md:aspect-[5/3]" : "md:aspect-[4/3]"}`}
        />
      </Link>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Link href={`/gallery/${design.id}`} className="min-w-0 flex-1">
            <h2 className="text-lg font-medium text-foreground">{design.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{design.style} · {design.author}</p>
          </Link>
          <button
            type="button"
            onClick={() => setSaved((value) => !value)}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition-colors ${saved ? "border-brand bg-brand text-white" : "border-border bg-background text-muted-foreground hover:text-foreground"}`}
            aria-label={saved ? "取消收藏" : "收藏设计"}
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">{design.models.length} 个模型</span>
          <span className="font-medium text-foreground">参考 ¥{design.priceMin}–{design.priceMax}</span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap gap-1">
            {design.materials.slice(0, 2).map((material) => (
              <span key={material} className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">{material}</span>
            ))}
          </div>
          <Link href={`/gallery/${design.id}`} className="inline-flex items-center gap-1 text-sm text-brand">
            详情
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
