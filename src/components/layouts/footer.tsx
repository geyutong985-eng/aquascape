import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full border border-brand/60 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-brand/60" />
          </div>
          <span className="text-sm text-muted-foreground">Aquascape — AI-powered aquarium design</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
          <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}