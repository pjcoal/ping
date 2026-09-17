import { EXAMPLE_FEE_BREAKDOWN, EXAMPLE_TRADE_FEE_ETH } from "@/lib/constants";
import { CoinsIcon, ClaimIcon, CheckCircleIcon } from "@/components/ui/Icons";

// An illustrative "here's the math" demo, not a real transaction — the
// homepage otherwise only shows the split as percentages, which is honest
// but abstract. Seeing it against one concrete example number (and a
// receipt-style breakdown) makes the "creator's share is always the
// largest, and every state is visible" point land without any real trade
// data existing yet. Numbers are derived from EXAMPLE_FEE_BREAKDOWN in
// lib/constants.ts, not hand-typed, so this can never drift from the real
// 88/7/5 split.
export default function ExampleFeeReceipt() {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
        <span className="text-sm font-medium text-white/70">Example trade fee</span>
        <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-white/40">
          Illustrative
        </span>
      </div>

      <div className="px-6 pt-6">
        <div className="font-mono text-3xl font-semibold tabular-nums text-white">
          {EXAMPLE_TRADE_FEE_ETH.toFixed(2)}{" "}
          <span className="text-lg font-medium text-white/40">ETH</span>
        </div>
        <p className="mt-1 text-xs text-white/40">
          collected on one trade, split in the same transaction
        </p>
      </div>

      <div
        className="mx-6 mt-5"
        style={{ borderTop: "1px dashed rgba(255,255,255,0.14)" }}
      />

      <div className="divide-y divide-white/[0.06] px-6">
        {EXAMPLE_FEE_BREAKDOWN.map((slice) => (
          <div key={slice.key} className="flex items-center justify-between py-3.5 text-sm">
            <div className="flex items-center gap-2.5">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: slice.color }}
              />
              <span className="text-white/75">{slice.label}</span>
              <span className="font-mono text-xs tabular-nums text-white/35">
                {slice.bps / 100}%
              </span>
            </div>
            <span className="font-mono font-medium tabular-nums text-white">
              +{slice.amountEth} ETH
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-white/8 px-6 py-4 text-xs leading-relaxed text-white/40">
        Not a real trade — but every real one splits the exact same way,
        enforced on-chain by the FeeRouter contract. The creator&apos;s route
        is always the largest.
      </div>

      <div className="border-t border-white/8 bg-white/[0.015] px-6 py-5">
        <div className="mb-3 text-xs font-medium uppercase tracking-wide text-white/35">
          Where a creator&apos;s share goes next
        </div>
        <div className="flex items-center gap-2">
          <LifecycleStep icon={CoinsIcon} label="Earned" tone="#8B7CF6" />
          <Connector />
          <LifecycleStep icon={ClaimIcon} label="Available" tone="#FFB84A" />
          <Connector />
          <LifecycleStep icon={CheckCircleIcon} label="Sent" tone="#2DD4BF" />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-white/40">
          A share is <strong className="font-medium text-white/60">earned</strong> the
          moment a trade happens, becomes <strong className="font-medium text-white/60">available</strong> once
          the creator verifies, and is marked <strong className="font-medium text-white/60">sent</strong> only
          after their claim confirms on-chain — never before.
        </p>
      </div>
    </div>
  );
}

function LifecycleStep({
  icon: Icon,
  label,
  tone,
}: {
  icon: (props: { className?: string }) => React.ReactElement;
  label: string;
  tone: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1.5 rounded-lg border border-white/8 bg-white/[0.02] py-3">
      <span
        className="flex h-7 w-7 items-center justify-center rounded-full"
        style={{ background: `${tone}1a`, color: tone }}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="text-xs font-medium text-white/70">{label}</span>
    </div>
  );
}

function Connector() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="shrink-0 text-white/20" aria-hidden="true">
      <path d="M1 5h11M8 1.5L12 5l-4 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
