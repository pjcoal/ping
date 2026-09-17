import Link from "next/link";
import FeeSplitDiagram from "@/components/FeeSplitDiagram";
import ActivityFeed from "@/components/ActivityFeed";
import CreatorCard from "@/components/CreatorCard";
import ExampleFeeReceipt from "@/components/ExampleFeeReceipt";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { BRAND, SOCIAL_PLATFORMS } from "@/lib/constants";
import { SAMPLE_CREATORS } from "@/lib/mock-data";

export default function Home() {
  return (
    <div>
      <section className="brand-gradient-bg relative overflow-hidden border-b border-white/10">
        {/* Decorative grid layer, isolated from the text content below: an
            element's `mask-image` clips everything it paints (background AND
            children), so the faded grid must live on its own empty layer
            rather than on the section that also holds the copy. */}
        <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="max-w-2xl">
            <Badge className="animate-in">Pre-launch preview · Robinhood Chain testnet</Badge>

            <h1
              className="animate-in mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl"
              style={{ animationDelay: "70ms" }}
            >
              <span className="brand-gradient-text">Ping</span> creators every
              trade fee. Automatically.
            </h1>

            <p
              className="animate-in mt-6 max-w-xl text-lg leading-relaxed text-white/60"
              style={{ animationDelay: "140ms" }}
            >
              {BRAND.description} The split happens on-chain, in the same
              transaction as the trade — before the coin&apos;s price even
              updates.
            </p>

            <div
              className="animate-in mt-9 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "210ms" }}
            >
              <Button href="/launch">Launch a coin for a creator</Button>
              <Button href="/explore" variant="secondary">
                Explore creators
              </Button>
            </div>

            <div
              className="animate-in mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/40"
              style={{ animationDelay: "260ms" }}
            >
              <span>Works across</span>
              {SOCIAL_PLATFORMS.slice(0, 6).map((p, i) => (
                <span key={p} className="flex items-center gap-2">
                  <span className="text-white/60">{p}</span>
                  {i < 5 && <span className="text-white/20">·</span>}
                </span>
              ))}
              <span>and more.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-white/[0.015]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-white">
                Not just a percentage — see where a fee actually goes
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                No trades have happened yet, so here&apos;s the math worked
                through on one illustrative fee instead of leaving the split
                abstract.
              </p>
              <div className="mt-6 space-y-5">
                <ExamplePoint
                  title="Creator gets the biggest cut"
                  body="At 88%, the creator's share is always the largest piece of every trade fee — by design, not by discretion."
                />
                <ExamplePoint
                  title="Nothing hides between states"
                  body="Earned, available, and sent are tracked separately on-chain, so a balance is never called “sent” before a transaction actually confirms it."
                />
                <ExamplePoint
                  title="Split atomically, every time"
                  body="The FeeRouter contract moves all three shares in the same transaction as the trade — no batching, no delay, no step where PING could intervene."
                />
              </div>
            </div>
            <ExampleFeeReceipt />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white">
              Every trade splits three ways, on-chain
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              The FeeRouter contract executes the split atomically — it
              can&apos;t be paused, delayed, or redirected after the fact.
            </p>
            <div className="mt-5">
              <FeeSplitDiagram />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white">
              What&apos;s happening right now
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              A live feed of launches, trades, and creator payouts.
            </p>
            <div className="mt-5">
              <ActivityFeed />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.015]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-white">
                Trending creator coins
              </h2>
              <p className="mt-1 text-sm text-white/50">
                Ranked by market cap across every launched coin.
              </p>
            </div>
            <Link
              href="/explore"
              className="hidden shrink-0 text-sm font-medium text-white/60 transition-colors hover:text-white sm:inline"
            >
              View all →
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SAMPLE_CREATORS.map((creator) => (
              <CreatorCard key={creator.handle} creator={creator} />
            ))}
          </div>
          <Link
            href="/explore"
            className="mt-6 inline-flex text-sm font-medium text-white/60 transition-colors hover:text-white sm:hidden"
          >
            View all →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-xl font-semibold tracking-tight text-white">
          How it works
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {[
            {
              step: "01",
              title: "Launch a coin",
              body: "Pick a creator, link their socials, set a ticker. Anyone can do this — the creator doesn't need to launch it themselves.",
            },
            {
              step: "02",
              title: "Creator verifies",
              body: "The creator drops a short code in their bio to claim the coin and start receiving their share automatically.",
            },
            {
              step: "03",
              title: "Fees route on every trade",
              body: "88% to the creator, 7% to PING, 5% to the buyback pool — paid out in ETH, visible on-chain in real time.",
            },
          ].map((item) => (
            <div key={item.step} className="card p-6">
              <div className="font-mono text-xs font-medium tracking-wide text-white/30">
                {item.step}
              </div>
              <div className="mt-3 font-medium text-white">{item.title}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-white/55">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ExamplePoint({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <div className="text-sm font-medium text-white">{title}</div>
      <p className="mt-1 text-sm leading-relaxed text-white/55">{body}</p>
    </div>
  );
}
