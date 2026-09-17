import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// Robinhood Chain network config — see README.md for chain IDs / RPC
// details. Swap the RPC URLs for a provider endpoint (Alchemy, etc.)
// before relying on this for anything other than local experiments; the
// public `rpc.<net>.chain.robinhood.com` pattern is fine for testnet
// exploration but not guaranteed for production traffic.
const ROBINHOOD_TESTNET_RPC =
  process.env.ROBINHOOD_TESTNET_RPC_URL ?? "https://rpc.testnet.chain.robinhood.com";
const ROBINHOOD_MAINNET_RPC =
  process.env.ROBINHOOD_MAINNET_RPC_URL ?? "https://rpc.mainnet.chain.robinhood.com";

// Never commit a real private key. Set DEPLOYER_PRIVATE_KEY in your local
// environment (or a secrets manager) only when you're actually deploying.
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    robinhoodTestnet: {
      url: ROBINHOOD_TESTNET_RPC,
      chainId: 46630,
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : [],
    },
    robinhoodMainnet: {
      url: ROBINHOOD_MAINNET_RPC,
      chainId: 4663,
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : [],
    },
  },
};

export default config;
