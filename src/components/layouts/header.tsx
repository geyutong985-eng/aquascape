import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border/30">
      <div className="max-w-7xl mx-auto px-9 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full border-2 border-brand flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-3 h-3 rounded-full bg-brand" />
            </div>
            <span className="text-lg text-foreground font-semibold">Aquascape</span>
          </Link>
          <Link href="#showcase" className="text-muted-foreground hover:text-foreground transition-colors text-base font-semibold">Gallery</Link>
          <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors text-base font-semibold">About</Link>
          <Link href="/customize" className="text-muted-foreground hover:text-foreground transition-colors text-base font-semibold">Design</Link>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/register" className="text-muted-foreground hover:text-foreground transition-colors text-base font-semibold">Register</Link>
          <Link href="/ask-ai" className="text-muted-foreground hover:text-foreground transition-colors text-base font-semibold">Ask AI</Link>
          <Link href="/login">
            <Button size="default">
              Log in
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}