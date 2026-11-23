import Link from "next/link";
import { Logo } from "./Logo";

export function Navbar() {
  return (
    <header className="glass-nav sticky top-0 z-50 w-full">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={36} />
          <span className="text-lg font-bold text-white">PoolTechTools</span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/tools/pool-volume" className="text-sm font-medium text-white/90 hover:text-white">Calculators</Link>
          <Link href="/tools/service-report" className="text-sm font-medium text-white/90 hover:text-white">Service Reports</Link>
          <Link href="#pricing" className="text-sm font-medium text-white/90 hover:text-white">Pricing</Link>
          <Link href="#faq" className="text-sm font-medium text-white/90 hover:text-white">FAQ</Link>
          <Link href="/pro/activate" className="text-sm font-medium text-white/90 hover:text-white">Activate Pro</Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/tools/service-report" className="btn-ghost hidden sm:inline-flex text-white border-white/40">Create Report</Link>
          <Link href="/pro/activate" className="btn-ghost hidden sm:inline-flex text-white border-white/40">Activate Pro</Link>
          <Link href="#pricing" className="btn-primary">Upgrade to Pro</Link>
        </div>
      </nav>
    </header>
  );
}
