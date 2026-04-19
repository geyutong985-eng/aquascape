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

interface ShowcaseMarqueeProps {
  items: ShowcaseItem[];
}

export function ShowcaseMarquee({ items }: ShowcaseMarqueeProps) {
  const allItems = [...items, ...items, ...items, ...items, ...items, ...items, ...items];

  return (
    <div className="overflow-hidden py-4">
      <div className="flex animate-[marquee_40s_linear_infinite] gap-4" style={{ width: "200%" }}>
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