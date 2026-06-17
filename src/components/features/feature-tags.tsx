export function FeatureTags() {
  return (
    <div className="flex flex-wrap gap-4 mb-12 justify-center">
      <span className="px-5 py-2 rounded-full border border-border/50 text-muted-foreground text-base font-semibold hover:bg-muted/60 hover:border-brand/30 hover:text-brand transition-all duration-200 cursor-default">
        AI 辅助设计
      </span>
      <span className="px-5 py-2 rounded-full border border-border/50 text-muted-foreground text-base font-semibold hover:bg-muted/60 hover:border-brand/30 hover:text-brand transition-all duration-200 cursor-default">
        3D 实时预览
      </span>
      <span className="px-5 py-2 rounded-full border border-border/50 text-muted-foreground text-base font-semibold hover:bg-muted/60 hover:border-brand/30 hover:text-brand transition-all duration-200 cursor-default">
        3D 打印交付
      </span>
    </div>
  );
}
