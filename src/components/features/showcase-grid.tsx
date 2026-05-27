"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { ShowcaseItem } from "@/types";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { DesignVisual } from "@/components/gallery";

interface ShowcaseGridProps {
  items: ShowcaseItem[];
}

export function ShowcaseGrid({ items }: ShowcaseGridProps) {
  return (
    <section id="showcase" className="py-24 overflow-hidden bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <h2 className="heading-2 text-foreground mb-3">Featured Designs</h2>
        <p className="text-body text-muted-foreground">Get inspired by creations from our community</p>
      </div>

      {/* Auto-scrolling Marquee - full width, no indent */}
      <ShowcaseMarquee items={items} />

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <Link href="/gallery" className="inline-flex items-center gap-2 text-brand hover:opacity-80 transition-opacity font-medium">
          View More Designs
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

function ShowcaseMarquee({ items }: ShowcaseGridProps) {
  const allItems = [...items, ...items, ...items, ...items, ...items, ...items, ...items];
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="overflow-hidden py-4 group">
      <div className="flex animate-[marquee_20s_linear_infinite] gap-4" style={{ animationPlayState: hoveredId ? 'paused' : 'running' }}>
        {allItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex-shrink-0 w-64 relative"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <Link href={`/gallery/${item.id}?from=home`} className="block">
              <Card className="hover:border-brand/50 transition-colors cursor-pointer relative overflow-hidden">
                <CardContent className="p-0">
                  <DesignVisual image={item.coverImage ?? "minimal-cloud"} title={item.title} colors={item.colors} className="aspect-[4/3]" />
                  <div className="p-4 relative">
                    <h3 className="text-lg font-medium text-foreground pr-12">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.style} · {item.author}</p>
                    {/* Arrow - show when this specific item is hovered */}
                    <div className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center transition-opacity duration-300 ${hoveredId === item.id ? 'opacity-100' : 'opacity-0'}`}>
                      <ArrowUpRight className="w-6 h-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
