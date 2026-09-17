import type { Metadata } from "next";
import "./globals.css";
import WalletContextProvider from "@/components/WalletContextProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${BRAND.name} — ${BRAND.tagline}`,
  description: BRAND.description,
};

// Deliberately using the system font stack (see globals.css) rather than
// next/font/google: it renders identically without depending on Google
// Fonts being reachable at build time, which varies across CI/hosting
// setups. Swap in a next/font/local brand typeface whenever you have one.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0B0E11] text-[#F5F3EF]">
        <WalletContextProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </WalletContextProvider>
      </body>
    </html>
  );
}
