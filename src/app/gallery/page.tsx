import { Footer, Header } from "@/components/layouts";
import { GalleryContent } from "@/components/gallery";
import { publicDesigns } from "@/lib/designs";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-24 md:px-8">
        <h1 className="text-3xl font-medium text-foreground mb-8">Gallery</h1>
        <GalleryContent designs={publicDesigns} />
      </main>
      <Footer />
    </div>
  );
}
