# FeeRouter — PING's on-chain contract

This is the piece that actually moves money. Everything else in this repo
(the Next.js app) is a frontend around it. Read this whole file before
deploying anywhere real funds could touch it.

PING targets **Robinhood Chain** — a permissionless Ethereum Layer 2 built
on the Arbitrum Orbit stack, using ETH for gas and settling to Ethereum
mainnet (see https://docs.robinhood.com/chain/connecting). That means the
contract is plain Solidity and the app talks to it the same way it would
talk to any EVM chain — no Solana/Anchor-specific tooling involved.

| | |
|---|---|
| Mainnet chain ID | `4663` |
| Testnet chain ID | `46630` |
| Native gas token | ETH |
| Mainnet explorer | https://robinhoodchain.blockscout.com |
| Public RPC pattern | `https://rpc.<mainnet\|testnet>.chain.robinhood.com` (swap for a provider endpoint — Alchemy, etc. — for production reliability) |

## What it does

A single contract (`contracts/FeeRouter.sol`) with one struct
(`CreatorVault`, one per creator handle, keyed by `keccak256(handle)` — the
EVM equivalent of the Anchor program's PDA seeds) and four external
functions:

- `initializeVault` — creates a vault for a creator handle with a fee split
  (basis points that must sum to 10,000) and fixed platform/buyback payout
  addresses. Anyone can call this (it's what the "Launch a coin" flow in
  the app does).
- `verifyCreator` — sets the creator's payout wallet and marks the vault
  verified. Callable only by the same address that called
  `initializeVault` for that handle. **This is a trust assumption**, not a
  trustless proof — see "Before mainnet" below.
- `depositFee` — payable; called by whatever collects a trade fee for this
  creator's coin (a Uniswap v4 pool hook, a relayer, etc.), sending the fee
  as `msg.value`. Splits it three ways in one transaction: the creator's
  cut is credited to the vault (claimable any time), the platform and
  buyback cuts are forwarded immediately to their fixed wallets.
- `claim` — the verified creator wallet withdraws everything currently
  credited to their vault. No admin involvement, no approval step.

## What it does NOT do (yet)

- **No bonding curve / Uniswap v4 pool integration.** `depositFee` is the
  interface a trading venue is expected to call on every trade. Pons and
  other Robinhood Chain launchpads list fixed-supply ERC-20 tokens traded
  through Uniswap v4 pools — actually deploying a token like that and
  wiring its trade fees into this contract (via a pool hook or a
  fee-forwarding relayer) is separate work this repo doesn't include.
- **No decentralized verification.** `verifyCreator` trusts a single admin
  address to have actually checked the bio-code off-chain. Whoever
  initialized a vault can mark any wallet as the "creator" of that handle.
  Before real launch, replace this with a multisig (e.g. Safe) admin at
  minimum, and ideally a stronger on-chain proof.
- **No audit.** This has been compiled clean with `solc` (see below) but
  has not been through a professional security review, and its reentrancy
  guard is a small hand-rolled one rather than OpenZeppelin's audited
  version (kept that way so the file has zero dependencies and compiles
  anywhere). Do not deploy it to Robinhood Chain mainnet with real funds
  until it has been audited and hardened.

## Building and testing locally

This contract was written and compiled (`solcjs --bin --abi
contracts/FeeRouter.sol`, solc 0.8.34) in an environment that did not have
Hardhat's or Foundry's full toolchain (network access for a global
Foundry install, or `npx hardhat compile`'s first-run download) available,
so the Hardhat project scaffolding below (`package.json`,
`hardhat.config.ts`, `test/FeeRouter.test.ts`) has **not** been installed
or run yet. To do that on your own machine:

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat test
```

## Deploying

```bash
npx hardhat run scripts/deploy.ts --network robinhoodTestnet   # try testnet first, always
# ...test the full flow end to end on testnet with a funded testnet wallet...
npx hardhat run scripts/deploy.ts --network robinhoodMainnet   # only after an audit
```

(`scripts/deploy.ts` isn't included yet — a straightforward
`ethers.deployContract("FeeRouter")` script; add one once you're ready to
deploy for real.)

After deploying, update:

- `lib/constants.ts` → `FEE_ROUTER_CONTRACT_ADDRESS` fallback (or just set
  `NEXT_PUBLIC_FEE_ROUTER_CONTRACT_ADDRESS` in the app's environment —
  that's the cleaner option and doesn't require touching source).
- `components/ClaimPanel.tsx` → `PLACEHOLDER_CONTRACT_ADDRESS`, so the "not
  deployed yet" guard correctly flips off once you have set the real
  address.

## Before this touches real user funds

1. Security audit of this contract by a firm that specializes in Solidity
   / EVM L2s, including a review of the hand-rolled reentrancy guard and a
   swap to OpenZeppelin's `ReentrancyGuard` / `Ownable` primitives.
2. Replace the single-admin `verifyCreator` trust model.
3. Legal review, in every jurisdiction you plan to operate in, of
   revenue-sharing tokens — automatically routing a cut of trading fees to
   a specific person can raise securities and money-transmission questions
   depending on where you and your users are.
4. A real Uniswap v4 pool (or other trading venue) integration, itself
   audited, that actually calls `depositFee` on every trade.
5. Rate limiting / anti-spam on `initializeVault` so it can't be used to
   spam-launch coins impersonating creators who never asked for one — the
   bio-code step covers payouts, but nothing currently stops someone from
   launching a coin *about* a creator who wants nothing to do with it.
