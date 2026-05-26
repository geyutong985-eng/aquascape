import type { DesignColor } from "@/types";

interface MaterialSwatchProps {
  name: string;
  desc?: string;
  fit?: string;
  colors?: DesignColor[];
}

export function MaterialSwatch({ name, desc, fit, colors = [] }: MaterialSwatchProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-foreground">{name}</h3>
          {desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}
        </div>
        <div className="flex shrink-0 gap-1">
          {colors.slice(0, 3).map((color) => (
            <span key={`${name}-${color.name}`} className="h-5 w-5 rounded-full border border-border" style={{ backgroundColor: color.value }} title={color.name} />
          ))}
        </div>
      </div>
      {fit && <p className="mt-3 text-xs text-muted-foreground">适合：{fit}</p>}
    </div>
  );
}
