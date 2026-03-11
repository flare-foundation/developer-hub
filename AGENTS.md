# AGENTS.md

## Purpose

This file gives AI agents the core framing to explain Flare correctly.
Use it when writing, editing, or reviewing Flare content in this repository.
Prioritize conceptual accuracy over marketing shorthand.

## What Flare Is

- Flare is an EVM-compatible Layer 1 blockchain.
- Its key differentiator is enshrined data: core data protocols are built into the network rather than added as third-party infrastructure.
- Flare is designed for data-intensive and interoperable applications.
- Flare uses Avalanche Snowman++ consensus and targets roughly 1.8 second block times with single-slot finality.

## Core Message

When explaining Flare, lead with this idea:

- Flare is not just another EVM chain.
- Flare combines smart contracts with protocol-level data acquisition and verification.
- The main reason to build on Flare is access to decentralized data protocols that are native to the network.

## Core Protocols

### FTSO

- FTSO stands for Flare Time Series Oracle.
- It provides decentralized data feeds, especially price feeds.
- It is protocol-native, not a bolted-on oracle network.
- Prefer FTSOv2 terminology and interfaces for current developer content.
- Use it when describing onchain access to timely market data.
- FTSO feeds are provided by decentralized data providers who submit price estimates that are aggregated on-chain.

### FDC

- FDC stands for Flare Data Connector.
- It lets contracts verify data from external chains and Web2 sources through attestations produced by the Flare Data Connector system.
- Use it when the topic is external data verification, cross-chain state, or proving real-world events onchain.
- Do not introduce new references to deprecated State Connector terminology unless the page is explicitly historical or migration-focused.

### FAssets

- FAssets are trust-minimized representations of non-smart-contract assets such as XRP or BTC on Flare.
- Their purpose is to bring otherwise non-programmable assets into DeFi and smart contract workflows.
- When explaining FAssets, mention agents, collateral, minting, redemption, and liquidation as core mechanics.

### Smart Accounts

- Smart Accounts provide account abstraction features that simplify user interaction with Flare. 
- They are especially useful for XRPL users interacting with Flare-based applications.

## Supported Networks

Use the correct network for the context:

- Flare Mainnet: production network, chain ID `14`
- Coston2: primary dApp testnet, chain ID `114`
- Songbird: canary network for live testing and protocol experimentation, chain ID `19`
- Coston: protocol-focused test network, chain ID `16`

If the content is for developers building apps, default to Coston2 for examples unless the page is explicitly about production deployment.

Examples should align with official RPC endpoints documented in the Flare Developer Hub.

## Package Guidance

Prefer interfaces and registry resolution rather than hardcoding protocol contract addresses.

### Solidity

- Prefer `@flarenetwork/flare-periphery-contracts` for Solidity interfaces and network-specific imports.
- Prefer the `ContractRegistry` pattern over hardcoded addresses.
- Use network-specific imports such as `@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol`.
- If the topic is FAssets, use the official Flare FAssets contracts or interfaces already referenced by the docs and examples instead of inventing alternative wrappers.

### Offchain Scripts

- Prefer `@flarenetwork/flare-periphery-contract-artifacts` for ABI access in scripts and tooling.
- Prefer official Flare package ABIs and interfaces over copied ABI blobs or unofficial packages.
- Never invent contract addresses. Use runtime contract resolution where available, or clearly sourced documented addresses.

### React And Frontend Integrations

- Prefer `wagmi`, `viem`, and `@flarenetwork/flare-wagmi-periphery-package` for modern React integrations where appropriate.
- If an existing example already uses Hardhat or `ethers`, preserve local consistency unless the task is explicitly to modernize it.

## Terminology Rules

- Distinguish Flare Mainnet from Songbird and Coston2. Do not treat them as interchangeable.
- Distinguish FTSO, FDC, FAssets, and Smart Accounts clearly. Do not collapse them into one generic oracle or bridge system.
- Use "data providers" or "providers" consistently when discussing FTSO or FSP participants.
- Avoid saying things happen automatically without explaining who triggers the transaction and why.

## Explanation Style

When explaining Flare, optimize for mechanisms:

- Explain what the protocol does.
- Explain who participates.
- Explain what data or asset moves through the system.
- Explain how the result becomes usable by a smart contract or developer.

Prefer:

- "FDC verifies external data through attestations that contracts can consume."
- "FAssets let XRP, BTC, and similar assets be used in Flare DeFi through a collateralized mint and redemption system."

Avoid vague phrasing like:

- "Flare connects everything."
- "Flare brings data to blockchain" without naming which protocol does it.
- "Flare wraps assets" without explaining the collateral and agent model.

## Important Mental Models

- Nothing is automatic onchain. If a state transition matters, explain who calls the function and why.
- Incentives matter. For systems like FAssets, liquidation and collateral mechanics are not implementation details; they are part of why the system works.
- Do not imply offchain data is trusted blindly. For Flare, stress verification, attestations, consensus, and proofs where relevant.
- Do not hardcode addresses in examples if the proper Flare pattern is runtime contract resolution.

## Safe Defaults For Developer Content

- Prefer Coston2 in starter examples.
- Mention that Flare supports modern EVM tooling and Solidity development.
- If contract access is discussed, prefer the `ContractRegistry` pattern over hardcoded addresses.
- If network setup is discussed, ensure the example network, chain ID, and RPC align.
- If the topic is price feeds, start with FTSO.
- If the topic is proving external events or external chain activity, start with FDC.
- If the topic is BTC, XRP, or DOGE utility on Flare, start with FAssets.
- If the topic is wallet UX for XRPL users, start with Smart Accounts.

## Common Mistakes To Avoid

- Do not describe Flare as just an oracle network.
- Do not describe FDC as a generic bridge.
- Do not describe FAssets as simple custodial wrapped tokens.
- Do not imply Songbird is the same as mainnet.
- Do not use Ethereum assumptions blindly if Flare-specific infrastructure exists and is the point of the page.
- Do not write examples that contradict Flare's actual network progression or protocol roles.
- Do not mix deprecated and current protocol names without making the distinction explicit.

## Handoff Expectations

When you finish Flare-related content work:

- State which Flare concept or protocol you clarified.
- Mention any terminology you normalized.
- Call out any assumptions you made about network, protocol, or developer audience.
