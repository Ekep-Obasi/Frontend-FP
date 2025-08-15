export default function Loader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
      <span className="inline-block h-3 w-3 rounded-full bg-current animate-pulse"></span>
      <span>{label}…</span>
    </div>
  );
}


