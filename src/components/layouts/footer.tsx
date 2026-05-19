import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <svg width="36" height="20" viewBox="0 0 387 217" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand">
            <g style={{mixBlendMode: 'overlay'}}>
              <path d="M13.3876 165.94C13.3876 165.94 58.3363 127.764 103.285 127.764C168.889 127.764 217.477 204.116 283.08 204.116C328.029 204.116 372.978 165.94 372.978 165.94" stroke="currentColor" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.3876 51.1167C13.3876 51.1167 58.3363 12.9404 103.285 12.9404C168.889 12.9404 217.477 89.2931 283.08 89.2931C328.029 89.2931 372.978 51.1167 372.978 51.1167" stroke="currentColor" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <g style={{mixBlendMode: 'overlay'}} opacity="0.5">
              <path d="M13.3876 165.94C13.3876 165.94 58.3363 127.764 103.285 127.764C168.889 127.764 217.477 204.116 283.08 204.116C328.029 204.116 372.978 165.94 372.978 165.94" stroke="currentColor" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.3876 51.1167C13.3876 51.1167 58.3363 12.9404 103.285 12.9404C168.889 12.9404 217.477 89.2931 283.08 89.2931C328.029 89.2931 372.978 51.1167 372.978 51.1167" stroke="currentColor" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
          </svg>
          <span className="text-sm text-muted-foreground">Finscape — AI-powered aquarium design</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
          <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}