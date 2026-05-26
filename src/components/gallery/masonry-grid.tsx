import type { Design } from "@/types";
import { DesignCard } from "./design-card";

interface MasonryGridProps {
  designs: Design[];
}

export function MasonryGrid({ designs }: MasonryGridProps) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
      {designs.map((design) => (
        <DesignCard key={design.id} design={design} />
      ))}
    </div>
  );
}
