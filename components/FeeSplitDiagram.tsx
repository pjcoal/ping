import { FEE_SPLIT } from "@/lib/constants";

export default function FeeSplitDiagram() {
  return (
    <div className="card p-6 sm:p-8">
      <div className="flex h-3 w-full gap-1">
        {FEE_SPLIT.map((slice) => (
          <div
            key={slice.key}
            className="h-full rounded-full first:rounded-l-full last:rounded-r-full"
            style={{ width: `${slice.bps / 100}%`, background: slice.color }}
            title={`${slice.label}: ${slice.bps / 100}%`}
          />
        ))}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {FEE_SPLIT.map((slice) => (
          <div key={slice.key} className="flex items-start gap-3">
            <span
              className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: slice.color }}
            />
            <div>
              <div className="flex items-baseline gap-1.5 text-sm font-medium text-white">
                <span>{slice.label}</span>
                <span className="font-mono text-[13px] tabular-nums text-white/50">
                  {slice.bps / 100}%
                </span>
              </div>
              <div className="mt-0.5 text-xs leading-relaxed text-white/50">
                {slice.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 border-t border-white/10 pt-5 text-xs leading-relaxed text-white/40">
        Every split happens in the same on-chain transaction as the trade —
        the FeeRouter contract pays each destination directly, so there is
        nothing for PING to hold, delay, or manually approve.
      </p>
    </div>
  );
}
