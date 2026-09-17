import { SAMPLE_ACTIVITY, SAMPLE_CREATORS } from "@/lib/mock-data";
import { TrendUpIcon, ClaimIcon, LaunchIcon } from "@/components/ui/Icons";

const LABEL: Record<string, string> = {
  trade: "traded",
  payout: "claimed",
  launch: "was launched",
};

const ICON: Record<string, (props: { className?: string }) => React.ReactElement> = {
  trade: TrendUpIcon,
  payout: ClaimIcon,
  launch: LaunchIcon,
};

const ICON_TONE: Record<string, string> = {
  trade: "text-[#8B7CF6] bg-[#8B7CF6]/10",
  payout: "text-[#2DD4BF] bg-[#2DD4BF]/10",
  launch: "text-[#FFB84A] bg-[#FFB84A]/10",
};

export default function ActivityFeed() {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/8 px-5 py-3.5">
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/45">
          <span className="live-dot" />
          Live activity
        </span>
        <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-white/40">
          Sample data
        </span>
      </div>

      <div className="divide-y divide-white/[0.06]">
        {SAMPLE_ACTIVITY.map((event) => {
          const creator = SAMPLE_CREATORS.find(
            (c) => c.handle === event.creatorHandle
          );
          if (!creator) return null;
          const Icon = ICON[event.type];
          return (
            <div
              key={event.id}
              className="flex items-center gap-3 px-5 py-3.5 text-sm"
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${ICON_TONE[event.type]}`}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="min-w-0 flex-1 truncate text-white/80">
                <span className="font-medium text-white">{creator.displayName}</span>{" "}
                <span className="text-white/50">{LABEL[event.type]}</span>
                {event.amountEth > 0 && (
                  <>
                    {" "}
                    <span className="font-mono font-medium tabular-nums text-[#FFB84A]">
                      {event.amountEth} ETH
                    </span>
                  </>
                )}
              </span>
              <span className="shrink-0 text-xs text-white/35">
                {event.timeAgo}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
