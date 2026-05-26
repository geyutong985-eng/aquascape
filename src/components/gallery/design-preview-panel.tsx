"use client";

import { useState } from "react";
import type { Design } from "@/types";
import { DesignVisual } from "./design-visual";

interface DesignPreviewPanelProps {
  design: Design;
}

export function DesignPreviewPanel({ design }: DesignPreviewPanelProps) {
  const [activeImage, setActiveImage] = useState(design.coverImage);

  return (
    <div className="flex h-full flex-col">
      <DesignVisual image={activeImage} title={design.title} colors={design.colors} className="min-h-[420px] flex-1 rounded-lg border lg:min-h-0" />
      <div className="mt-3 grid grid-cols-3 gap-3">
        {design.galleryImages.map((image) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveImage(image)}
            className={`overflow-hidden rounded-md border transition-colors ${activeImage === image ? "border-brand" : "border-border"}`}
            aria-label={`查看 ${design.title} 预览`}
          >
            <DesignVisual image={image} title={design.title} colors={design.colors} className="aspect-[4/3]" />
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-lg border bg-card p-4">
        <p className="text-sm font-medium text-foreground">3D Preview</p>
        <p className="mt-1 text-sm text-muted-foreground">预留给 editor 分支合并后的 3D 模型预览。</p>
      </div>
    </div>
  );
}
