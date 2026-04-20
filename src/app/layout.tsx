import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Aquascape - Build Your Dream Aquarium",
  description: "Design stunning aquascapes with AI assistance. Visualize in 3D. Print your creation with precision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased")}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}