import { notFound } from "next/navigation";
import ClaimPanel from "@/components/ClaimPanel";
import FeeSplitDiagram from "@/components/FeeSplitDiagram";
import Badge from "@/components/ui/Badge";
import { CheckCircleIcon } from "@/components/ui/Icons";
import { SAMPLE_CREATORS } from "@/lib/mock-data";

export function generateStaticParams() {
  return SAMPLE_CREATORS.map((c) => ({ handle: c.handle }));
}

export default async function CreatorPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const creator = SAMPLE_CREATORS.find((c) => c.handle === handle);
  if (!creator) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Badge className="mb-6">Sample data — preview only</Badge>

      <div className="flex items-center gap-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-lg font-bold text-[#0B0E11] ring-1 ring-white/10"
          style={{ background: creator.avatarColor }}
        >
          {creator.displayName.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              {creator.displayName}
            </h1>
            {creator.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#2DD4BF]/10 px-2 py-0.5 text-xs font-medium text-[#2DD4BF]">
                <CheckCircleIcon className="h-3 w-3" />
                Verified
              </span>
            )}
          </div>
          <div className="mt-0.5 font-mono text-sm text-white/50">
            ${creator.ticker} <span className="text-white/25">·</span> {creator.platform}
          </div>
        </div>
      </div>

      <p className="mt-5 max-w-xl leading-relaxed text-white/60">{creator.bio}</p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <ClaimPanel creator={creator} />
        <div>
          <h2 className="mb-3 text-sm font-medium text-white/70">
            Fee split for every trade
          </h2>
          <FeeSplitDiagram />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Market cap" value={`${creator.marketCapEth} ETH`} />
        <Stat label="Holders" value={creator.holders.toLocaleString()} />
        <Stat label="Total earned" value={`${creator.earnedEth.toLocaleString()} ETH`} />
        <Stat label="Total sent" value={`${creator.sentEth.toLocaleString()} ETH`} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card px-4 py-4">
      <div className="text-xs text-white/45">{label}</div>
      <div className="mt-1 font-mono text-sm font-semibold tabular-nums text-white">
        {value}
      </div>
    </div>
  );
}
