# Gemini CLI Workspace Context

## Project Overview
This workspace documents the professional evolution of **El Profesor Cripto**, covering foundational Python scripting, basic DeFi distribution, and advanced algorithmic exchange ecosystems.

---

## Project 3: DemoTDC_DEFI (The Imperial Suite)

### Overview
The "DemoTDC" project represents a full-scale decentralized finance protocol. It integrates a custom token, a mathematical AMM (DEX), and a complete suite of DeFi tools (Faucet, Vendor, Staking), all accessible through a high-end minimalist interface.

**GitHub Repository:** [https://github.com/tododecripto/DemoTDC_DEFI.git](https://github.com/tododecripto/DemoTDC_DEFI.git)

### Core Ecosystem Components

#### 🪙 DemoTDC Token (`DTDC`)
- **Contract:** `0xD4560365c676C32Ef6D6A7c3F756CA8651bd95E6`
- **Supply:** 1,000,000,000 tokens (18 decimals).
- **Standards:** ERC-20 OpenZeppelin.

#### 🦄 Algorithmic DEX
- **Contract:** `0x2387b22E1A6b576126ee941bb12e3f4F0Cad0900`
- **Formula:** $x * y = k$ (Uniswap model).
- **Liquidity:** Initialized with ETH and DTDC.

#### 🏦 Financial Modules
- **Faucet:** 10 DTDC daily distribution. (`0xCD8a5512B561D749838EFc25f8Ec5E4191D1a312`)
- **Vendor:** Direct fixed-rate acquisition. (`0xd6B3AaeEaF0f7bEEf953C6811A78baFD7df0C5F9`)
- **Staking:** Optimized 20% APY bank. (`0x8e1940047D0dede120c25Dd352845034c4197D8e`)

### High-End Frontend
- **Design Philosophy:** "Institutional Minimalist" (Inspired by tododecripto.com).
- **Architecture:** Dual dashboard (Swap vs DeFi Tools).
- **UX Features:** Real-time balance sync, optimized input layouts, and full mobile responsiveness.

---

## Deployment & Operational Status
- **Network:** Base Sepolia (L2).
- **Security:** Secret management validated (Strict .gitignore rules).
- **Documentation:** Full Spanish README available on GitHub.

### Critical Commands
- **Launch dApp:** `cd DemoTDC_DEX/frontend && npm run dev`
- **Contract Audit:** `npx hardhat run scripts/check-all-balances.ts --network base_sepolia`
