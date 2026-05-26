import type { DesignColor } from "@/types";

const visualThemes: Record<string, { bg: string; base: string; accent: string; glow: string }> = {
  "aqua-cave": { bg: "from-slate-800 via-slate-600 to-teal-200", base: "bg-slate-900/70", accent: "bg-cyan-100/50", glow: "bg-teal-200/40" },
  "aqua-cave-detail": { bg: "from-slate-700 via-stone-500 to-cyan-100", base: "bg-slate-800/70", accent: "bg-stone-200/60", glow: "bg-cyan-200/50" },
  "aqua-cave-top": { bg: "from-zinc-700 via-teal-700 to-slate-200", base: "bg-zinc-900/70", accent: "bg-teal-100/50", glow: "bg-white/45" },
  "minimal-cloud": { bg: "from-sky-100 via-stone-100 to-emerald-100", base: "bg-white/80", accent: "bg-sky-300/45", glow: "bg-white/70" },
  "minimal-cloud-side": { bg: "from-stone-100 via-blue-100 to-teal-100", base: "bg-slate-50/90", accent: "bg-blue-300/40", glow: "bg-teal-200/50" },
  "minimal-cloud-material": { bg: "from-zinc-100 via-cyan-100 to-slate-200", base: "bg-white/80", accent: "bg-cyan-300/45", glow: "bg-slate-50/70" },
  "forest-root": { bg: "from-emerald-900 via-lime-700 to-stone-200", base: "bg-stone-800/70", accent: "bg-lime-300/45", glow: "bg-emerald-200/45" },
  "forest-root-close": { bg: "from-stone-800 via-emerald-700 to-lime-200", base: "bg-stone-900/65", accent: "bg-lime-200/55", glow: "bg-white/35" },
  "forest-root-layout": { bg: "from-emerald-800 via-stone-600 to-green-100", base: "bg-emerald-950/60", accent: "bg-stone-200/50", glow: "bg-green-200/40" },
  "ripple-tower": { bg: "from-slate-950 via-blue-700 to-cyan-100", base: "bg-slate-900/80", accent: "bg-blue-300/55", glow: "bg-cyan-200/55" },
  "ripple-tower-grid": { bg: "from-neutral-950 via-slate-700 to-blue-200", base: "bg-neutral-900/80", accent: "bg-cyan-100/50", glow: "bg-blue-300/45" },
  "ripple-tower-color": { bg: "from-slate-800 via-blue-500 to-zinc-100", base: "bg-slate-950/70", accent: "bg-blue-200/55", glow: "bg-white/45" },
  "petal-soft": { bg: "from-rose-100 via-amber-100 to-emerald-100", base: "bg-white/75", accent: "bg-rose-300/50", glow: "bg-amber-100/80" },
  "petal-soft-palette": { bg: "from-pink-100 via-yellow-100 to-mint-100", base: "bg-white/75", accent: "bg-pink-300/50", glow: "bg-yellow-100/80" },
  "petal-soft-detail": { bg: "from-emerald-100 via-rose-100 to-stone-100", base: "bg-white/75", accent: "bg-emerald-300/45", glow: "bg-rose-100/80" },
  "mini-ruins": { bg: "from-stone-800 via-stone-500 to-slate-200", base: "bg-stone-900/70", accent: "bg-stone-200/60", glow: "bg-amber-100/35" },
  "mini-ruins-bridge": { bg: "from-zinc-800 via-stone-600 to-neutral-200", base: "bg-zinc-900/70", accent: "bg-stone-100/55", glow: "bg-white/30" },
  "mini-ruins-stone": { bg: "from-stone-700 via-slate-600 to-stone-200", base: "bg-stone-900/70", accent: "bg-slate-200/55", glow: "bg-amber-100/35" },
};

interface DesignVisualProps {
  image: string;
  title: string;
  colors?: DesignColor[];
  className?: string;
}

export function DesignVisual({ image, title, colors = [], className = "" }: DesignVisualProps) {
  const theme = visualThemes[image] ?? visualThemes["minimal-cloud"];
  const palette = colors.slice(0, 4);

  return (
    <div className={`relative isolate overflow-hidden bg-gradient-to-br ${theme.bg} ${className}`} aria-label={`${title} preview`}>
      <div className={`absolute -right-10 -top-12 h-36 w-36 rounded-full blur-2xl ${theme.glow}`} />
      <div className={`absolute left-8 top-10 h-20 w-28 rounded-[45%] blur-sm ${theme.accent}`} />
      <div className={`absolute bottom-6 left-1/2 h-20 w-[72%] -translate-x-1/2 rounded-[50%] blur-md ${theme.base}`} />
      <div className="absolute bottom-8 left-[18%] h-20 w-12 rounded-t-full rounded-b-[45%] bg-white/55 shadow-sm" />
      <div className="absolute bottom-10 left-[37%] h-28 w-16 rounded-t-[48%] rounded-b-[36%] bg-black/20 shadow-lg" />
      <div className="absolute bottom-9 right-[22%] h-16 w-20 rounded-[42%] bg-white/40 shadow-sm" />
      <div className="absolute inset-x-6 bottom-5 h-px bg-white/60" />
      <div className="absolute inset-x-6 top-5 h-px bg-white/35" />
      <div className="absolute bottom-4 right-4 flex gap-1">
        {palette.map((color) => (
          <span key={color.name} className="h-4 w-4 rounded-full border border-white/70 shadow-sm" style={{ backgroundColor: color.value }} />
        ))}
      </div>
    </div>
  );
}
