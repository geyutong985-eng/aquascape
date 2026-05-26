"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "@/components/icons";

export function GalleryBackLink() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push("/gallery");
        }
      }}
      className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:border-brand/50 hover:text-brand"
    >
      <ArrowLeft className="h-4 w-4" />
      返回上页
    </button>
  );
}
