import type { Metadata } from "next";
import { Young_Serif, DM_Sans } from "next/font/google";
import "./globals.css";

const youngSerif = Young_Serif({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: "400",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
});

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
      className={`h-full antialiased ${youngSerif.variable} ${dmSans.variable}`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}