import { FEE_SPLIT } from "@/lib/constants";
import PageHeader from "@/components/ui/PageHeader";

export const metadata = { title: "How it works — PING" };

const SECTIONS = [
  { id: "concept", label: "The concept" },
  { id: "program", label: "On-chain contract" },
  { id: "faq", label: "FAQ" },
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <PageHeader title="How it works" />

      <nav className="mt-6 flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-full border border-white/12 px-3.5 py-1.5 text-xs font-medium text-white/55 transition-colors hover:border-white/25 hover:text-white"
          >
            {s.label}
          </a>
        ))}
      </nav>

      <section id="concept" className="mt-14 scroll-mt-24 space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-white">The concept</h2>
        <p className="leading-relaxed text-white/60">
          PING lets anyone launch a token tied to a content creator.
          Every trade in that token pays a small fee, and that fee is split
          automatically on-chain:{" "}
          {FEE_SPLIT.map((s) => `${s.label} ${s.bps / 100}%`).join(", ")}.
          The creator claims their share whenever they want — PING never
          holds it.
        </p>
      </section>

      <section id="program" className="mt-14 scroll-mt-24 space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-white">
          The on-chain contract
        </h2>
        <p className="leading-relaxed text-white/60">
          The split is enforced by a Solidity contract on{" "}
          <strong className="text-white/80">Robinhood Chain</strong> — a
          permissionless Ethereum L2 built on the Arbitrum Orbit stack — not
          a backend server. Source is in{" "}
          <code className="rounded bg-white/5 px-1.5 py-0.5 text-white/75">contracts/</code> of
          this repository. It holds a per-creator vault keyed by their
          handle, records how much has accrued, and lets the verified
          creator wallet withdraw their available balance at any time.
          PING&apos;s and the buyback pool&apos;s cuts route to their own
          fixed wallets in the same transaction.
        </p>
        <p className="leading-relaxed text-white/60">
          This contract is <strong className="text-white/80">not yet deployed anywhere</strong>,
          and this site is a pre-launch preview running on sample data.
          Actually routing real trade fees also requires wiring the vault
          into wherever trading happens — a Uniswap v4 pool, the same way
          other fixed-supply tokens on Robinhood Chain trade — that
          integration isn&apos;t included yet and is called out in{" "}
          <code className="rounded bg-white/5 px-1.5 py-0.5 text-white/75">
            contracts/README.md
          </code>
          .
        </p>
      </section>

      <section id="faq" className="mt-14 scroll-mt-24 space-y-6">
        <h2 className="text-xl font-semibold tracking-tight text-white">FAQ</h2>
        <div className="space-y-5">
          <FaqItem q="Do creators need to launch their own coin?">
            No — anyone can launch a coin for a creator. The creator verifies
            ownership afterward with a bio code, which is what unlocks their
            share of fees.
          </FaqItem>
          <FaqItem q="What happens to fees before a creator verifies?">
            They accrue in the creator&apos;s vault as &quot;earned&quot; but
            stay locked as &quot;available&quot; only after verification, so
            nothing is paid to the wrong wallet.
          </FaqItem>
          <FaqItem q="What chain is this on?">
            Robinhood Chain — a permissionless Ethereum L2 built on the
            Arbitrum Orbit stack, using ETH for gas and settling to
            Ethereum mainnet. Wallet connect uses the standard EVM stack
            (wagmi), tested with MetaMask-style injected wallets and
            Coinbase Wallet. Payouts are in ETH.
          </FaqItem>
          <FaqItem q="Is this live?">
            Not yet — this build is a pre-launch preview with sample data and
            an undeployed contract, ready for you to finish wiring up and
            deploy on your own terms.
          </FaqItem>
        </div>
      </section>
    </div>
  );
}

function FaqItem({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-white/8 pb-5 last:border-b-0 last:pb-0">
      <div className="font-medium text-white">{q}</div>
      <p className="mt-1.5 text-sm leading-relaxed text-white/55">{children}</p>
    </div>
  );
}
