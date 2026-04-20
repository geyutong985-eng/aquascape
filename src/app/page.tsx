import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";
import { Hero, HowItWorks, ShowcaseGrid, ValueProposition } from "@/components/features";
import type { ShowcaseItem } from "@/types";

// Sample aquascape data for showcase
const showcases: ShowcaseItem[] = [
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
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <ShowcaseGrid items={showcases} />
        <ValueProposition />
      </main>
      <Footer />
    </div>
  );
}