import Link from "next/link";
import type { Creator } from "@/lib/mock-data";
import { CheckCircleIcon } from "@/components/ui/Icons";

export default function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <Link
      href={`/creator/${creator.handle}`}
      className="card card-interactive group flex flex-col gap-5 p-5"
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[#0B0E11] ring-1 ring-white/10"
          style={{ background: creator.avatarColor }}
        >
          {creator.displayName.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="truncate font-medium text-white">
              {creator.displayName}
            </span>
            {creator.verified && (
              <CheckCircleIcon className="h-3.5 w-3.5 shrink-0 text-[#2DD4BF]" />
            )}
          </div>
          <div className="font-mono text-xs text-white/45">
            ${creator.ticker} <span className="text-white/25">·</span> {creator.platform}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-white/8 pt-4 text-sm">
        <div>
          <div className="text-xs text-white/45">Market cap</div>
          <div className="mt-0.5 font-mono font-medium tabular-nums text-white">
            {creator.marketCapEth.toLocaleString()} ETH
          </div>
        </div>
        <div>
          <div className="text-xs text-white/45">Holders</div>
          <div className="mt-0.5 font-mono font-medium tabular-nums text-white">
            {creator.holders.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2.5 text-xs">
        <span className="text-white/50">Paid to creator so far</span>
        <span className="font-mono font-medium tabular-nums text-[#FFB84A]">
          {creator.sentEth.toLocaleString()} ETH
        </span>
      </div>
    </Link>
  );
}
