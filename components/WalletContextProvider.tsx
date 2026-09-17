"use client";

import { useState } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { coinbaseWallet, injected } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { robinhoodChain, robinhoodChainTestnet } from "@/lib/chains";
import { BRAND, ROBINHOOD_NETWORK } from "@/lib/constants";

// Real wallet wiring for Robinhood Chain (an EVM L2), via wagmi. `injected`
// picks up any browser-extension wallet that follows EIP-1193 (MetaMask,
// Robinhood Wallet's extension, etc.); `coinbaseWallet` is included as a
// second, explicit option the way the original build offered both Phantom
// and Solflare. Defaults to Robinhood Chain's testnet so connecting a
// wallet here never touches real funds until you deliberately point
// NEXT_PUBLIC_ROBINHOOD_NETWORK at "mainnet" and ship an audited contract
// — see contracts/README.md before doing that.
const activeChain = ROBINHOOD_NETWORK === "mainnet" ? robinhoodChain : robinhoodChainTestnet;

const wagmiConfig = createConfig({
  chains: [activeChain],
  connectors: [injected(), coinbaseWallet({ appName: BRAND.name })],
  // `activeChain` is picked at runtime, so TypeScript widens its `id` to
  // the union of both chain ids — providing a transport for both here
  // (rather than just `[activeChain.id]`) satisfies that without an
  // `as const` cast that would fight the runtime branching.
  transports: {
    [robinhoodChain.id]: http(),
    [robinhoodChainTestnet.id]: http(),
  },
  ssr: true,
});

export default function WalletContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
