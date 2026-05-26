"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@/components/icons";

interface ListItem {
  id: string;
  title: string;
  description?: string;
  image?: string;
  date?: string;
  status?: string;
  price?: string;
  href?: string;
}

interface ProfileListProps {
  title: string;
  description?: string;
  items: ListItem[];
  emptyText?: string;
  viewAllHref?: string;
}

export function ProfileList({ title, description, items, emptyText = "暂无内容", viewAllHref }: ProfileListProps) {
  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/profile" className="p-2 hover:bg-accent rounded-md transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-medium text-foreground">{title}</h1>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
        </div>
        {viewAllHref ? (
          <Link href={viewAllHref} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            查看全部
          </Link>
        ) : null}
      </div>

      {/* List */}
      {items.length === 0 ? (
        <div className="text-left py-12 pl-14">
          <p className="text-muted-foreground">{emptyText}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href || "#"}
              className="flex items-center gap-4 bg-card rounded-xl border p-4 hover:border-primary/30 transition-colors"
            >
              {/* Thumbnail */}
              {item.image && (
                <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
              )}
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{item.title}</p>
                {item.description && (
                  <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                )}
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  {item.date && <span>{item.date}</span>}
                  {item.status && <span>{item.status}</span>}
                  {item.price && <span className="text-foreground font-medium">{item.price}</span>}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
