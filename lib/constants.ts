// Brand + protocol constants for PING.
//
// PING is an original rebrand of the "creator coin, automatic fee
// routing" concept popularized by sites like sendmoney.cash (SEND). Nothing
// here reuses SEND's name, copy, logo, or code — only the general business
// mechanic (launch a token for a creator; route a cut of every trade fee to
// them automatically, on-chain). It's built for Robinhood Chain (an
// Ethereum L2 on the Arbitrum Orbit stack — see lib/chains.ts) rather than
// Solana, to match how it's meant to be listed: alongside other launches on
// pons (https://www.ponsfamily.com/launchpad).

export const BRAND = {
  name: "PING",
  shortName: "PING",
  tagline: "Ping creators every trade fee. Automatically.",
  description:
    "Launch a coin for any creator across their socials. Every trade fee splits on-chain in real time — no invoices, no waiting on a platform to pay out.",
  domain: "ping.app", // placeholder — update to the real domain before launch
} as const;

// Fee split, expressed in basis points (1/100th of a percent). Sums to 10,000.
// This is a deliberately different split from SEND's published 90/5/5, both
// to differentiate the product and because "buyback" mechanics carry real
// securities/tokenomics implications that deserve their own design decision
// rather than being copied wholesale.
export const FEE_SPLIT_BPS = {
  creator: 8800, // 88% to the creator
  platform: 700, // 7% to PING
  buyback: 500, // 5% to the $PING buyback-and-burn pool
} as const;

export const FEE_SPLIT = [
  {
    key: "creator",
    label: "Creator",
    bps: FEE_SPLIT_BPS.creator,
    color: "var(--color-brand-coral)",
    description: "Paid out in ETH the moment a trade happens.",
  },
  {
    key: "platform",
    label: "PING",
    bps: FEE_SPLIT_BPS.platform,
    color: "var(--color-brand-amber)",
    description: "Keeps the lights on — hosting, verification, support.",
  },
  {
    key: "buyback",
    label: "Buyback pool",
    bps: FEE_SPLIT_BPS.buyback,
    color: "var(--color-brand-teal)",
    description: "Routed to $PING buybacks, visible on-chain.",
  },
] as const;

// A single illustrative number used by the "example fee split" demo on the
// homepage — not a real trade, just something concrete to show the 88/7/5
// math against instead of leaving it abstract. Derived, not hand-typed, so
// it can never drift out of sync with FEE_SPLIT_BPS.
export const EXAMPLE_TRADE_FEE_ETH = 1.5;

export const EXAMPLE_FEE_BREAKDOWN = FEE_SPLIT.map((slice) => ({
  ...slice,
  amountEth: Number(((EXAMPLE_TRADE_FEE_ETH * slice.bps) / 10_000).toFixed(4)),
}));

export const SOCIAL_PLATFORMS = [
  "X",
  "Twitch",
  "YouTube",
  "Instagram",
  "TikTok",
  "Kick",
  "Twitter Spaces",
  "Discord",
  "Substack",
  "Farcaster",
] as const;

// "testnet" (Robinhood Chain testnet, chain ID 46630) or "mainnet" (chain
// ID 4663) — see lib/chains.ts. Defaults to testnet so connecting a wallet
// here never touches real funds until you deliberately point
// NEXT_PUBLIC_ROBINHOOD_NETWORK at mainnet and ship an audited contract.
export const ROBINHOOD_NETWORK =
  (process.env.NEXT_PUBLIC_ROBINHOOD_NETWORK as "testnet" | "mainnet" | undefined) ??
  "testnet";

// Filled in after deploying contracts/contracts/FeeRouter.sol — see
// contracts/README.md. Left as the same placeholder address until a real
// contract is deployed, so the app is honest about not being deployed yet
// rather than pointing at a fake address.
export const FEE_ROUTER_CONTRACT_ADDRESS = (process.env
  .NEXT_PUBLIC_FEE_ROUTER_CONTRACT_ADDRESS ??
  "0x488180620deeb35bf3f2c7e46d0b03d314a4a057") as `0x${string}`;
