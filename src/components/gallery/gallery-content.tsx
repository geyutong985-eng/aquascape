"use client";

import { useMemo, useState } from "react";
import type { Design } from "@/types";
import { Button } from "@/components/ui/button";
import { DesignFilters, type GalleryFilters } from "./design-filters";
import { MasonryGrid } from "./masonry-grid";

interface GalleryContentProps {
  designs: Design[];
}

const defaultFilters: GalleryFilters = {
  style: "all",
  material: "all",
  price: "all",
  source: "all",
  tank: "all",
  tag: "all",
};

export function GalleryContent({ designs }: GalleryContentProps) {
  const [filters, setFilters] = useState<GalleryFilters>(defaultFilters);
  const filteredDesigns = useMemo(() => {
    return designs.filter((design) => {
      const styleMatch = filters.style === "all" || design.style === filters.style;
      const materialMatch = filters.material === "all" || design.materials.includes(filters.material);
      const sourceMatch = filters.source === "all" || design.authorType === filters.source;
      const tagMatch = filters.tag === "all" || design.models.some((model) => model.tags.includes(filters.tag));
      const tankLength = design.tankSize.length;
      const tankMatch =
        filters.tank === "all" ||
        (filters.tank === "small" && tankLength < 50) ||
        (filters.tank === "medium" && tankLength >= 50 && tankLength < 75) ||
        (filters.tank === "large" && tankLength >= 75);
      const priceMatch =
        filters.price === "all" ||
        (filters.price === "under-300" && design.priceMin < 300) ||
        (filters.price === "300-500" && design.priceMin <= 500 && design.priceMax >= 300) ||
        (filters.price === "over-500" && design.priceMax > 500);

      return styleMatch && materialMatch && sourceMatch && tagMatch && tankMatch && priceMatch;
    });
  }, [designs, filters]);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
      <DesignFilters designs={designs} filters={filters} onChange={setFilters} />
      <section>
        {filteredDesigns.length > 0 ? (
          <MasonryGrid designs={filteredDesigns} />
        ) : (
          <div className="rounded-lg border border-dashed bg-card px-6 py-16 text-center">
            <h2 className="text-xl font-medium text-foreground">没有匹配的设计</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">换一个筛选条件，看看其他造景组合。</p>
            <Button className="mt-6" onClick={() => setFilters(defaultFilters)}>恢复全部</Button>
          </div>
        )}
      </section>
    </div>
  );
}
