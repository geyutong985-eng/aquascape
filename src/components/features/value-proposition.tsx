"use client";

import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Eye, Factory } from "@/components/icons";

const features = [
  { icon: Sparkles, title: "AI Design", desc: "Tell us your vision. Our AI brings your vision to life." },
  { icon: Eye, title: "3D Preview", desc: "See every angle before you order." },
  { icon: Factory, title: "3D Printed", desc: "Precision manufacturing, uniquely yours." },
];

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    setTransform(`perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };

  const handleMouseLeave = () => {
    setTransform("");
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        transform,
        transition: "transform 0.15s ease-out",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}

export function ValueProposition() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="heading-2 text-foreground mb-16 text-center">
          Why Choose Us
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <TiltCard key={i} className="group">
              <Card className="bg-card/50 border-none shadow-sm h-full transition-colors duration-300 group-hover:bg-card/80" style={{ overflow: "visible" }}>
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand/10 text-brand mb-4 transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                    <f.icon className="size-7" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}