"use client";

import type { Design } from "@/types";
import { Button } from "@/components/ui/button";

export interface GalleryFilters {
  style: string;
  material: string;
  price: string;
  source: string;
  tank: string;
  tag: string;
}

interface DesignFiltersProps {
  designs: Design[];
  filters: GalleryFilters;
  onChange: (filters: GalleryFilters) => void;
}

const defaultFilters: GalleryFilters = {
  style: "all",
  material: "all",
  price: "all",
  source: "all",
  tank: "all",
  tag: "all",
};

const priceRanges = [
  { label: "全部价格", value: "all" },
  { label: "¥300 以下", value: "under-300" },
  { label: "¥300-500", value: "300-500" },
  { label: "¥500 以上", value: "over-500" },
];

const sourceOptions = [
  { label: "全部来源", value: "all" },
  { label: "官方精选", value: "official" },
  { label: "用户作品", value: "user" },
];

const tankOptions = [
  { label: "全部尺寸", value: "all" },
  { label: "小型缸", value: "small" },
  { label: "标准缸", value: "medium" },
  { label: "大型缸", value: "large" },
];

export function DesignFilters({ designs, filters, onChange }: DesignFiltersProps) {
  const styles = Array.from(new Set(designs.map((design) => design.style)));
  const materials = Array.from(new Set(designs.flatMap((design) => design.materials)));
  const tags = Array.from(new Set(designs.flatMap((design) => design.models.flatMap((model) => model.tags))));
  const setFilter = (key: keyof GalleryFilters, value: string) => onChange({ ...filters, [key]: value });

  return (
    <aside className="space-y-7 rounded-lg border bg-card p-5 lg:sticky lg:top-24">
      <div className="flex items-center justify-between gap-3 border-b pb-4">
        <p className="text-sm font-semibold text-foreground">筛选</p>
        <Button variant="ghost" size="sm" onClick={() => onChange(defaultFilters)}>
          重置
        </Button>
      </div>

      <FilterGroup title="来源">
        {sourceOptions.map((option) => (
          <FilterButton key={option.value} active={filters.source === option.value} onClick={() => setFilter("source", option.value)}>
            {option.label}
          </FilterButton>
        ))}
      </FilterGroup>

      <FilterGroup title="风格">
        <FilterButton active={filters.style === "all"} onClick={() => setFilter("style", "all")}>全部风格</FilterButton>
        {styles.map((style) => (
          <FilterButton key={style} active={filters.style === style} onClick={() => setFilter("style", style)}>{style}</FilterButton>
        ))}
      </FilterGroup>

      <FilterGroup title="材质">
        <FilterButton active={filters.material === "all"} onClick={() => setFilter("material", "all")}>全部材质</FilterButton>
        {materials.map((material) => (
          <FilterButton key={material} active={filters.material === material} onClick={() => setFilter("material", material)}>{material}</FilterButton>
        ))}
      </FilterGroup>

      <FilterGroup title="鱼缸尺寸">
        {tankOptions.map((option) => (
          <FilterButton key={option.value} active={filters.tank === option.value} onClick={() => setFilter("tank", option.value)}>
            {option.label}
          </FilterButton>
        ))}
      </FilterGroup>

      <FilterGroup title="功能">
        <FilterButton active={filters.tag === "all"} onClick={() => setFilter("tag", "all")}>全部功能</FilterButton>
        {tags.map((tag) => (
          <FilterButton key={tag} active={filters.tag === tag} onClick={() => setFilter("tag", tag)}>{tag}</FilterButton>
        ))}
      </FilterGroup>

      <FilterGroup title="参考价格">
        {priceRanges.map((range) => (
          <FilterButton key={range.value} active={filters.price === range.value} onClick={() => setFilter("price", range.value)}>{range.label}</FilterButton>
        ))}
      </FilterGroup>
    </aside>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </section>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${active ? "border-brand bg-brand text-white" : "border-border bg-background text-muted-foreground hover:text-foreground"}`}
    >
      {children}
    </button>
  );
}
