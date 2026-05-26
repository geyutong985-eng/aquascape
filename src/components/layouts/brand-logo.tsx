import Link from "next/link";

interface BrandLogoProps {
  centered?: boolean;
}

export function BrandLogo({ centered = false }: BrandLogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-3 group ${centered ? "justify-center" : ""}`}>
      <svg width="34" height="20" viewBox="0 0 387 217" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand">
        <g style={{ mixBlendMode: "overlay" }}>
          <path d="M13.3876 165.94C13.3876 165.94 58.3363 127.764 103.285 127.764C168.889 127.764 217.477 204.116 283.08 204.116C328.029 204.116 372.978 165.94 372.978 165.94" stroke="currentColor" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.3876 51.1167C13.3876 51.1167 58.3363 12.9404 103.285 12.9404C168.889 12.9404 217.477 89.2931 283.08 89.2931C328.029 89.2931 372.978 51.1167 372.978 51.1167" stroke="currentColor" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g style={{ mixBlendMode: "overlay" }} opacity="0.5">
          <path d="M13.3876 165.94C13.3876 165.94 58.3363 127.764 103.285 127.764C168.889 127.764 217.477 204.116 283.08 204.116C328.029 204.116 372.978 165.94 372.978 165.94" stroke="currentColor" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.3876 51.1167C13.3876 51.1167 58.3363 12.9404 103.285 12.9404C168.889 12.9404 217.477 89.2931 283.08 89.2931C328.029 89.2931 372.978 51.1167 372.978 51.1167" stroke="currentColor" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
      <span className="text-lg text-brand font-semibold font-heading tracking-widest">Finscape</span>
    </Link>
  );
}
