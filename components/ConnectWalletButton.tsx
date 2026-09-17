"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { robinhoodChain, robinhoodChainTestnet } from "@/lib/chains";
import { ROBINHOOD_NETWORK } from "@/lib/constants";

const targetChain = ROBINHOOD_NETWORK === "mainnet" ? robinhoodChain : robinhoodChainTestnet;

function shortAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

// Real wallet-connect UI over wagmi: a small dropdown listing whatever
// connectors WalletContextProvider registered (injected/MetaMask-style +
// Coinbase Wallet), rather than a mocked "Select wallet" toggle. Restyled
// to the quiet `.btn-secondary` treatment — this is a persistent utility
// action, so it shouldn't visually compete with page-level primary CTAs.
export default function ConnectWalletButton({ className = "" }: { className?: string }) {
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [open, setOpen] = useState(false);

  if (isConnected && address && chainId !== targetChain.id) {
    return (
      <button
        type="button"
        onClick={() => switchChain({ chainId: targetChain.id })}
        disabled={isSwitching}
        className={`btn btn-secondary btn-sm ${className}`}
        style={{ borderColor: "rgba(255,184,74,0.4)", color: "var(--color-brand-amber)" }}
        title={`Connected wallet is on the wrong network — switch to ${targetChain.name}`}
      >
        {isSwitching ? "Switching…" : "Switch network"}
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <button
        type="button"
        onClick={() => disconnect()}
        className={`btn btn-secondary btn-sm font-mono ${className}`}
        title="Disconnect wallet"
      >
        {shortAddress(address)}
      </button>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="btn btn-secondary btn-sm"
      >
        {isPending ? "Connecting…" : "Connect wallet"}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close wallet menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="card absolute right-0 top-full z-50 mt-2 w-52 space-y-0.5 p-1.5">
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                type="button"
                onClick={() => {
                  connect({ connector, chainId: targetChain.id });
                  setOpen(false);
                }}
                className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm text-white/75 transition-colors hover:bg-white/5 hover:text-white"
              >
                {connector.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
