# PING

**Ping creators every trade fee. Automatically.**

PING is an original rebrand of the "launch a coin for a creator, split
every trade fee to them automatically on-chain" concept — the same general
mechanic as sites like sendmoney.cash, built independently here under a
different name, different visual identity, and a different fee split
(88% creator / 7% platform / 5% buyback, vs. their published 90/5/5), so it
isn't a copy of their code, copy, or brand — just the same category of
product, targeting **Robinhood Chain** (the way pons —
https://www.ponsfamily.com/launchpad — lists launches) instead of Solana.

This repo has two parts:

- **`/` (this Next.js app)** — the website: landing page, creator explore
  grid, creator profiles with a claim flow, and a "launch a coin" form.
  Real wallet connect for Robinhood Chain (an Ethereum L2 built on the
  Arbitrum Orbit stack) is wired up via `wagmi`, defaulting to
  **Robinhood Chain testnet**.
- **`/contracts`** — the on-chain piece: a Solidity contract
  (`FeeRouter.sol`) that actually holds and splits fees. **Read
  `contracts/README.md` before doing anything with real funds** — it
  explains what's genuinely implemented, what's still missing (Uniswap v4
  pool integration, decentralized creator verification), and what needs to
  happen (audit, legal review) before this should touch mainnet.

## What's real vs. sample data

- Wallet connect (via `wagmi`, tested with MetaMask-style injected wallets
  and Coinbase Wallet) and the on-chain contract are real, working code.
  The claim transaction builder calls the real `claim(handle)` function on
  the deployed contract once its address is configured.
- The creators, market caps, holder counts, and activity feed shown on
  `/`, `/explore`, and `/creator/[handle]` are **sample data** (see
  `lib/mock-data.ts`) — clearly labeled in the UI as "preview only."
  Nothing has launched yet.
- The "Launch a coin" form (`/launch`) collects the info and shows the bio
  verification code, but stops short of submitting an on-chain
  `initializeVault` transaction — that's the next piece to wire up once
  the contract is deployed (see `contracts/README.md`).

## Running locally

```bash
npm install
npm run dev
```

Opens on `http://localhost:3000`. No environment variables are required to
browse the preview; wallet connect works out of the box against Robinhood
Chain testnet (chain ID `46630`).

To point the claim flow at a real deployed contract once you've followed
`contracts/README.md`:

```bash
NEXT_PUBLIC_FEE_ROUTER_CONTRACT_ADDRESS=<your deployed contract address> \
NEXT_PUBLIC_ROBINHOOD_NETWORK=testnet \
npm run dev
```

## Publishing to your domain

This is a standard Next.js app — build it and deploy the output however
you deploy static/Node sites today (Vercel, your own server behind a
reverse proxy at `/launchpad`, etc.):

```bash
npm run build
npm start   # or `next export`-style static hosting, depending on your setup
```

If you're hosting it at a sub-path like `/launchpad` rather than the
domain root, set `basePath` in `next.config.ts` accordingly before
building.

## Before you tell anyone this is live

Read `contracts/README.md`'s "Before this touches real user funds" section.
Short version: get a professional audit of the on-chain contract, get legal
advice on revenue-sharing tokens in your jurisdiction(s), and replace the
single-admin creator-verification step with something stronger, before any
real money moves through this.
