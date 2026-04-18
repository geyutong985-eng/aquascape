import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BubbleBackground } from "@/components/bubble-background";

// Sample aquascape data for showcase
const showcases = [
  { id: 1, title: "Mossy Forest", style: "Iwagumi", author: "AquaDesign", height: "tall" },
  { id: 2, title: "Jungle Valley", style: "Nature", author: "GreenLeaf", height: "short" },
  { id: 3, title: "Rocky Shore", style: "Wabi-kabi", author: "StoneAqua", height: "medium" },
  { id: 4, title: "Coral Paradise", style: "Dutch", author: "CoralMaster", height: "tall" },
  { id: 5, title: "Bamboo Grove", style: "Asian", author: "ZenTank", height: "medium" },
  { id: 6, title: "Amazon Dream", style: "Biotype", author: "WildWater", height: "short" },
  { id: 7, title: "Mountain Stream", style: "Iwagumi", author: "StreamLine", height: "tall" },
  { id: 8, title: "Sunset Reef", style: "Nature", author: "OceanView", height: "medium" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border/30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full border-2 border-brand flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-3 h-3 rounded-full bg-brand" />
            </div>
            <span className="text-lg text-foreground font-medium">Aquascape</span>
          </Link>
          <div className="flex items-center gap-8 text-sm">
            <Link href="#showcase" className="text-muted-foreground hover:text-foreground transition-colors">Gallery</Link>
            <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link href="/customize" className="text-brand font-medium hover:opacity-80 transition-opacity">
              Start Designing
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - centered like Supabase */}
      <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        {/* Bubble particles */}
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          <BubbleBackground />
        </div>

        <div className="max-w-3xl mx-auto w-full relative text-center" style={{ zIndex: 1 }}>
          <h1 className="heading-display text-foreground mb-6">
            Build Your Dream <span className="text-brand">Aquarium</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed">
            Design stunning <span className="text-foreground font-semibold">aquascapes</span> with AI assistance. <span className="text-foreground font-semibold">Visualize</span> in 3D. <span className="text-foreground font-semibold">Print</span> your creation with precision.
          </p>

          {/* Feature Tags - centered */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            <span className="px-4 py-1.5 rounded-full border border-border/60 text-muted-foreground text-sm font-medium">
              AI-Powered
            </span>
            <span className="px-4 py-1.5 rounded-full border border-border/60 text-muted-foreground text-sm font-medium">
              3D Preview
            </span>
            <span className="px-4 py-1.5 rounded-full border border-border/60 text-muted-foreground text-sm font-medium">
              3D Printed
            </span>
          </div>

          {/* CTA - Using shadcn/ui Button */}
          <Link href="/customize">
            <Button variant="brand" size="xl">
              Start Designing Your Tank
            </Button>
          </Link>
        </div>
      </section>

      {/* Showcase Gallery - Using shadcn/ui Cards */}
      <section id="showcase" className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="heading-2 text-foreground mb-3">Featured Designs</h2>
            <p className="text-body text-muted-foreground">Get inspired by creations from our community</p>
          </div>

          {/* Horizontal Scroll */}
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide">
            {showcases.map((item) => (
              <Link key={item.id} href={`/showcase/${item.id}`} className="flex-shrink-0 w-64 snap-start">
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

          {/* View More */}
          <div className="mt-12">
            <Link href="/gallery" className="inline-flex items-center gap-2 text-brand hover:opacity-80 transition-opacity font-medium">
              View More Designs
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
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
    </div>
  );
}