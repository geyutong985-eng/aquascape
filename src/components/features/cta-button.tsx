import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTAButton() {
  return (
    <Link href="/editor">
      <Button variant="brand" size="2xl" className="shadow-xl shadow-brand/15 hover:shadow-2xl hover:shadow-brand/25 transition-all">
        Start Designing Your Tank
      </Button>
    </Link>
  );
}