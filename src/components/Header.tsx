import Link from "next/link";
import { Compass } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background/90 border-b border-border z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold tracking-tight flex items-center gap-2"
        >
          <Compass className="h-6 w-6 md:h-7 md:w-7" aria-hidden="true" />
          <span className="text-lg md:text-xl">Tripee</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Planner
          </Link>
          <Link href="/history" className="hover:text-foreground">
            History
          </Link>
        </nav>
      </div>
    </header>
  );
}
