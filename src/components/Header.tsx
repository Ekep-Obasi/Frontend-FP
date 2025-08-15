import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/90 dark:bg-zinc-900/80 border-b border-black/5 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">The Company</Link>
        <nav className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-300">
          <Link href="/" className="hover:text-black dark:hover:text-white">Planner</Link>
          <Link href="/history" className="hover:text-black dark:hover:text-white">History</Link>
          <a href="https://nextjs.org" target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white">Docs</a>
        </nav>
      </div>
    </header>
  );
}


