import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";
import { Hero, HowItWorks, ShowcaseGrid, ValueProposition } from "@/components/features";
import { featuredDesigns, toShowcaseItem } from "@/lib/designs";

const showcases = featuredDesigns.map(toShowcaseItem);

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
