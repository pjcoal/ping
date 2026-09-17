import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // `wagmi/connectors` re-exports its Coinbase "baseAccount" connector
    // from a barrel file, which pulls in @coinbase/cdp-sdk's optional x402
    // micropayment SDK. Those submodules are dynamically required by code
    // paths we never execute (we only use `injected()` and
    // `coinbaseWallet()`, never Coinbase's x402 payment flow), and they
    // aren't installed as dependencies, so webpack's static resolver fails
    // on them even though they're dead code for this app. Mark them
    // external so webpack skips resolving them at build time.
    config.externals = [
      ...(Array.isArray(config.externals) ? config.externals : []),
      "@x402/core/client",
      "@x402/evm",
      "@x402/evm/exact/client",
      "@x402/evm/upto/client",
      "@x402/svm/exact/client",
    ];
    return config;
  },
};

export default nextConfig;
