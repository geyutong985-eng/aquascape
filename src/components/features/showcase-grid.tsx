"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface ShowcaseItem {
  id: number;
  title: string;
  style: string;
  author: string;
  height: string;
}

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
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

function ShowcaseMarquee({ items }: ShowcaseGridProps) {
  const allItems = [...items, ...items, ...items, ...items, ...items, ...items, ...items];

  return (
    <div className="overflow-hidden py-4 group">
      <div className="flex animate-[marquee_40s_linear_infinite] gap-4 group-hover:[animation-play-state:paused]">
        {allItems.map((item, index) => (
          <Link
            key={`${item.id}-${index}`}
            href={`/showcase/${item.id}`}
            className="flex-shrink-0 w-64"
          >
            <Card className="group hover:border-brand/50 transition-colors cursor-pointer">
              <CardContent className="p-0">
                <div className="aspect-[4/3] bg-gradient-to-br from-brand/5 to-brand/10 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-brand/20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-brand/40" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.style} · {item.author}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}