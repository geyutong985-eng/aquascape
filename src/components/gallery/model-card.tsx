"use client";

import { useState } from "react";
import type { DesignModel } from "@/types";
import { ArrowDown } from "@/components/icons";

interface ModelCardProps {
  model: DesignModel;
}

export function ModelCard({ model }: ModelCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border bg-card">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-muted">
          <span className="h-6 w-6 rounded-full border border-white/70 shadow-sm" style={{ backgroundColor: model.color.value }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-foreground">{model.name}</p>
          <p className="text-sm text-muted-foreground">{model.material} · {model.color.name}</p>
        </div>
        <span className="text-sm font-medium">¥{model.price}</span>
        <ArrowDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="border-t px-4 pb-4 pt-3">
          <div className="flex flex-wrap gap-2">
            {model.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">{tag}</span>
            ))}
          </div>
          {model.modelPath && <p className="mt-3 text-xs text-muted-foreground">3D 模型：{model.modelPath}</p>}
        </div>
      )}
    </div>
  );
}
