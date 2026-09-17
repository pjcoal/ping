import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals.js";
import nextTs from "eslint-config-next/typescript.js";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The Solidity contract is a separate Hardhat/TS workspace with its
    // own dependency set (hardhat, chai, mocha types) that isn't installed
    // at the app root — see contracts/README.md.
    "contracts/**",
  ]),
]);

export default eslintConfig;
