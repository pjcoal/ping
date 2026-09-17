"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { FEE_SPLIT, SOCIAL_PLATFORMS } from "@/lib/constants";
import Badge from "@/components/ui/Badge";
import { CheckCircleIcon } from "@/components/ui/Icons";

const inputClass =
  "w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#FFB84A] focus:bg-white/[0.07]";

export default function LaunchPage() {
  const { isConnected: connected } = useAccount();
  const [platform, setPlatform] = useState<(typeof SOCIAL_PLATFORMS)[number]>(
    "X"
  );
  const [handle, setHandle] = useState("");
  const [ticker, setTicker] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [bioCode] = useState(
    () => "PING-" + Math.random().toString(36).slice(2, 8).toUpperCase()
  );

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Badge className="mb-4">{submitted ? "Step 2 of 2" : "Step 1 of 2"}</Badge>
      <h1 className="text-3xl font-semibold tracking-tight text-white">
        Launch a coin for a creator
      </h1>
      <p className="mt-3 leading-relaxed text-white/55">
        Anyone can launch a coin for a creator. Fees start routing to them
        automatically once they verify with a bio code — until then, their
        share accrues and waits.
      </p>

      {submitted ? (
        <div className="mt-9 card p-6 sm:p-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2DD4BF]/10 text-[#2DD4BF]">
            <CheckCircleIcon className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-white">
            Almost there — one more step
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Ask <span className="font-medium text-white">@{handle}</span> to
            add this code to their {platform} bio to claim {ticker || "the"}{" "}
            coin and start receiving their share:
          </p>
          <div className="mt-5 rounded-lg border border-[#FFB84A]/30 bg-[#FFB84A]/10 px-4 py-3.5 text-center font-mono text-lg tracking-wider text-[#FFB84A]">
            {bioCode}
          </div>
          <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-white/40">
            This preview stops here — creating the on-chain token and
            submitting this launch to the FeeRouter contract happens once{" "}
            <code className="rounded bg-white/5 px-1 py-0.5 text-white/60">contracts/</code> is
            deployed to Robinhood Chain. See the README for the remaining steps.
          </p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="mt-9 space-y-5"
        >
          <div className="card space-y-5 p-6 sm:p-8">
            <Field label="Creator's platform">
              <select
                value={platform}
                onChange={(e) =>
                  setPlatform(
                    e.target.value as (typeof SOCIAL_PLATFORMS)[number]
                  )
                }
                className={inputClass}
              >
                {SOCIAL_PLATFORMS.map((p) => (
                  <option key={p} value={p} className="bg-[#12161B]">
                    {p}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Creator's handle">
              <input
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value.replace(/^@/, ""))}
                placeholder="e.g. novaplays"
                className={inputClass}
              />
            </Field>

            <Field label="Ticker">
              <input
                required
                maxLength={10}
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                placeholder="e.g. NOVA"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="card p-6">
            <div className="text-sm font-medium text-white/70">
              Fee split for this coin
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/50">
              {FEE_SPLIT.map((s) => (
                <div key={s.key} className="flex items-center gap-1.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: s.color }}
                  />
                  {s.label}
                  <span className="font-mono tabular-nums text-white">
                    {s.bps / 100}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {!connected && (
            <p className="text-xs leading-relaxed text-white/40">
              You can fill this out without a wallet connected, but
              you&apos;ll need one connected to actually submit a launch
              once the contract is live.
            </p>
          )}

          <button type="submit" className="btn btn-primary w-full">
            Continue
          </button>
        </form>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-white/60">
        {label}
      </span>
      {children}
    </label>
  );
}
