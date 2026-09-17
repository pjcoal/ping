import Link from "next/link";
import { BRAND } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0B0E11]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#FFB84A] text-xs font-bold text-[#0B0E11]">
                P
              </span>
              <span className="text-base font-semibold text-white">
                {BRAND.shortName}
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              {BRAND.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-2">
            <div>
              <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">
                Product
              </div>
              <ul className="space-y-2.5">
                <li><Link href="/explore" className="text-white/60 transition-colors hover:text-white">Explore</Link></li>
                <li><Link href="/launch" className="text-white/60 transition-colors hover:text-white">Launch a coin</Link></li>
                <li><Link href="/docs" className="text-white/60 transition-colors hover:text-white">How it works</Link></li>
              </ul>
            </div>
            <div>
              <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">
                Resources
              </div>
              <ul className="space-y-2.5">
                <li><Link href="/docs#program" className="text-white/60 transition-colors hover:text-white">On-chain contract</Link></li>
                <li><Link href="/docs#faq" className="text-white/60 transition-colors hover:text-white">FAQ</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 h-px bg-gradient-to-r from-white/15 via-white/5 to-transparent" />

        <div className="mt-6 flex flex-col gap-2 text-xs leading-relaxed text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {BRAND.shortName}. Not financial advice.
          </span>
          <span>Tokens are not available for trading yet — pre-launch preview.</span>
        </div>
      </div>
    </footer>
  );
}
