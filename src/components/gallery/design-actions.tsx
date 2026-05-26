"use client";

import { useState } from "react";
import { Heart } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function DesignActions() {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    await navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button type="button" variant={saved ? "brand" : "outline"} onClick={() => setSaved((value) => !value)}>
        <Heart className="h-4 w-4" />
        {saved ? "已收藏" : "收藏"}
      </Button>
      <Button type="button" variant="outline" onClick={handleShare}>
        {copied ? "已复制" : "分享"}
      </Button>
    </div>
  );
}
