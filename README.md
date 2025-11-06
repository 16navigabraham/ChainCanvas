# ChainCanvas

![ChainCanvas Banner](https://placehold.co/1200x600/1a1a1a/ffffff/png?text=ChainCanvas)

**ChainCanvas** is a modern, cross-chain NFT gallery and marketplace built on the Base network. It provides a seamless user experience for exploring and managing NFTs, featuring an AI-powered gas optimization tool to help users save on transaction fees. Wallet connectivity is powered by the **Reown AppKit**, offering support for multiple popular wallets.

## ✨ Features

- **🖼️ NFT Marketplace Gallery**: A beautiful, responsive gallery to browse and filter NFTs.
- **🔗 Multi-Chain Asset Display**: View NFTs from various chains, including Base, Ethereum, Polygon, and Optimism.
- **🤖 AI-Powered Gas Optimizer**: An intelligent tool that analyzes pending transactions and suggests batching opportunities to reduce gas costs.
- **🔒 Secure Wallet Integration**: Robust and secure multi-wallet support (MetaMask, Coinbase Wallet, WalletConnect, Rainbow) powered by **Reown AppKit**.
- **🌐 SSR Ready**: Built with Next.js App Router for optimal performance and server-side rendering.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Web3 Integration**: [Reown AppKit](https://docs.reown.com/appkit) with [Wagmi](https://wagmi.sh/)
- **Generative AI**: [Firebase Genkit](https://firebase.google.com/docs/genkit)
- **Deployment**: Firebase App Hosting

## 🚀 Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/) package manager

### 1. Environment Variables

Before you can run the application, you need to set up your environment variables. This project uses Reown AppKit for wallet connections, which requires a Project ID.

1.  Create a `.env` file in the root of the project.
2.  Add your Reown Project ID to the file:

    ```.env
    NEXT_PUBLIC_PROJECT_ID="YOUR_REOWN_PROJECT_ID"
    ```

    You can get a Project ID by creating a new project on the [Reown Dashboard](https://dashboard.reown.com).

### 2. Installation

Install the project dependencies using your preferred package manager:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Running the Development Server

Once the dependencies are installed, you can start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002). The page will auto-update as you edit the source files.

## 📜 Available Scripts

- `npm run dev`: Starts the development server with Turbopack.
- `npm run build`: Creates a production-ready build of the application.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase for errors and style issues.
- `npm run typecheck`: Runs the TypeScript compiler to check for type errors.

## 📁 Project Structure

Here is a brief overview of the key directories in the project:

- `src/app/`: Contains the main application routes and pages, following the Next.js App Router structure.
- `src/components/`: Reusable React components, including UI elements from ShadCN.
- `src/ai/`: Home to the Genkit flows that power the AI features, like the Gas Optimizer.
- `src/lib/`: Shared utilities, data fetching logic, and type definitions.
- `src/config/`: Configuration for third-party services, such as the Reown AppKit.
- `src/context/`: React context providers, like the `Web3Provider`.
- `public/`: Static assets like images and fonts.

---

Happy building!