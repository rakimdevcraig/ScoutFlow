import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-court"
        >
          ScoutFlow
        </Link>
        <nav className="flex gap-4 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-court">
            Create report
          </Link>
        </nav>
      </div>
    </header>
  );
}
