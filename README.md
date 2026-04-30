<div align="center">
  <img src="https://gen-persona.vercel.app/favicon.ico" alt="Gen Persona Logo" width="120" />

  <h1>Gen Persona 🧬</h1>
  <p><strong>The On-Chain AI Personality Matrix built for the GenLayer Network.</strong></p>

  <p>
    <a href="https://gen-persona.vercel.app/"><strong>Explore the Live Demo</strong></a>
    ·
    <a href="#-getting-started"><strong>Getting Started</strong></a>
    ·
    <a href="#-architecture"><strong>Architecture</strong></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-19-blue.svg?style=flat&logo=react" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=flat&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Network-GenLayer_Testnet-purple.svg?style=flat" alt="GenLayer Testnet" />
    <img src="https://img.shields.io/badge/Deployed_on-Vercel-black.svg?style=flat&logo=vercel" alt="Vercel" />
  </p>
</div>

<br />

## 📖 About The Project

**Gen Persona** is a next-generation Web3 psychological profiling dApp. By completing a fast-paced, interactive matrix of choices, users forge a unique "Crypto Persona." Rather than storing this identity in a centralized database or IPFS, **Gen Persona leverages the GenLayer Testnet to inscribe your identity natively as blockchain transaction data.**

### ✨ Why GenLayer?
GenLayer represents a paradigm shift in decentralized execution by natively integrating AI via "Intelligent Contracts." Gen Persona serves as the identity foundational layer for this ecosystem. By keeping the personas purely on-chain, future GenLayer intelligent contracts can natively read a user's psychological risk profile directly from the blockchain state and adapt DEFI or gaming experiences dynamically.

## 🎯 Core Features

- **🧠 Algorithmic Trait Analysis**: Evaluates risk tolerance, technical fluency, and market sentiment through rapid-fire prompts.
- **🌐 Seamless GenLayer Onboarding**: Automatically detects, configures, and switches the user's wallet (e.g., MetaMask) to the GenLayer Testnet (`0x107D`).
- **⛓️ Pure On-Chain Inscriptions**: Identities are encoded as stylized SVGs and JSON metadata, then inscribed as zero-value transactional payloads. No external centralized storage is required.
- **🎨 Polished UX/UI**: Built with Framer Motion and Tailwind CSS for buttery-smooth animations and a cyberpunk-aesthetic matrix experience.

---

## 🏗️ Architecture

Gen Persona's architecture is designed to be lightweight, fully decentralized, and highly responsive.

1. **The Client (React + Vite)**: Manages state, animations, and the assessment algorithm.
2. **Wallet Provider (`window.ethereum`)**: Ethers.js v6 handles RPC communication directly with the GenLayer network.
3. **The Inscription Engine**: Converts the computed persona into an uncompressed SVG and JSON payload, encodes it as hex data, and executes an on-chain zero-value transaction to self (`to: self`).

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

Ensure you have Node.js and npm installed on your machine.
* Node.js (v18 or higher recommended)
* npm (v9 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kmgdz/gen-persona.git
   cd gen-persona
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open the application**
   Navigate to `http://localhost:3000` in your browser.

---

## 🗺️ Roadmap

- [x] Initial UI/UX and Assessment Engine Framework
- [x] Wallet connection and GenLayer Testnet integration
- [x] On-chain SVG payload inscriptions mechanism
- [ ] **GenLayer Intelligent Contract Integration**: Read personas natively via GenLayer AI nodes.
- [ ] **Ecosystem Leaderboard**: Track the most common archetypes across the testnet.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with ❤️ for the GenLayer Ecosystem</p>
</div>
