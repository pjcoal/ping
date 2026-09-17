"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { BRAND, ROBINHOOD_NETWORK } from "@/lib/constants";
import { MenuIcon, CloseIcon } from "@/components/ui/Icons";

// wagmi's account state touches window on mount, so the connect button is
// client-only and dynamically imported with ssr disabled to avoid a
// hydration mismatch.
const ConnectWalletButton = dynamic(() => import("@/components/ConnectWalletButton"), {
  ssr: false,
});

const LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/launch", label: "Launch a coin" },
  { href: "/docs", label: "How it works" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0E11]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#FFB84A] text-sm font-bold text-[#0B0E11] shadow-[0_2px_10px_rgba(255,140,60,0.35)]">
            P
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">
            {BRAND.shortName}
          </span>
          <span className="hidden rounded-full border border-white/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/50 sm:inline-flex">
            {ROBINHOOD_NETWORK}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white/[0.07] text-white"
                    : "text-white/55 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ConnectWalletButton />
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/30 hover:text-white md:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-white/10 px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active ? "bg-white/[0.07] text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-3 sm:hidden">
            <ConnectWalletButton />
          </div>
        </div>
      )}
    </header>
  );
}
