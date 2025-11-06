# ChainCanvas - NFT Viewer

This is a React application that allows users to view their NFTs on the Base mainnet. It uses the Alchemy API to fetch NFT data and displays it in a user-friendly gallery format.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js and npm (or yarn)
* An Alchemy API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/chain-canvas.git
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### Configuration

1. Create a `.env` file in the root of the project.
2. Add your Alchemy API key to the `.env` file:
   ```
   NEXT_PUBLIC_ALCHEMY_API_KEY="YOUR_API_KEY"
   ```
   Replace `"YOUR_API_KEY"` with your actual Alchemy API key.

## Available Scripts

In the project directory, you can run:

* `npm run dev`: Runs the app in the development mode.
* `npm run build`: Builds the app for production to the `build` folder.
* `npm run start`: Starts the production server.
* `npm run lint`: Lints the code.
* `npm run typecheck`: Type-checks the code.

## Dependencies

* **@genkit-ai/google-genai:** ^1.20.0
* **@genkit-ai/next:** ^1.20.0
* **@hookform/resolvers:** ^4.1.3
* **@radix-ui/react-accordion:** ^1.2.3
* **@radix-ui/react-alert-dialog:** ^1.1.6
* **@radix-ui/react-avatar:** ^1.1.3
* **@radix-ui/react-checkbox:** ^1.1.4
* **@radix-ui/react-collapsible:** ^1.1.11
* **@radix-ui/react-dialog:** ^1.1.6
* **@radix-ui/react-dropdown-menu:** ^2.1.6
* **@radix-ui/react-label:** ^2.1.2
* **@radix-ui/react-menubar:** ^1.1.6
* **@radix-ui/react-popover:** ^1.1.6
* **@radix-ui/react-progress:** ^1.1.2
* **@radix-ui/react-radio-group:** ^1.2.3
* **@radix-ui/react-scroll-area:** ^1.2.3
* **@radix-ui/react-select:** ^2.1.6
* **@radix-ui/react-separator:** ^1.1.2
* **@radix-ui/react-slider:** ^1.2.3
* **@radix-ui/react-slot:** ^1.2.3
* **@radix-ui/react-switch:** ^1.1.3
* **@radix-ui/react-tabs:** ^1.1.3
* **@radix-ui/react-toast:** ^1.2.6
* **@radix-ui/react-tooltip:** ^1.1.8
* **@reown/appkit:** ^1.3.1
* **@reown/appkit-adapter-wagmi:** ^1.2.0
* **@tanstack/react-query:** ^5.51.15
* **class-variance-authority:** ^0.7.1
* **clsx:** ^2.1.1
* **date-fns:** ^3.6.0
* **dotenv:** ^16.5.0
* **embla-carousel-react:** ^8.6.0
* **ethers:** ^5.7.2
* **firebase:** ^11.9.1
* **genkit:** ^1.20.0
* **lucide-react:** ^0.475.0
* **next:** 15.3.3
* **patch-package:** ^8.0.0
* **react:** ^18.3.1
* **react-day-picker:** ^8.10.1
* **react-dom:** ^18.3.1
* **react-hook-form:** ^7.54.2
* **recharts:** ^2.15.1
* **tailwind-merge:** ^3.0.1
* **tailwindcss-animate:** ^1.0.7
* **viem:** ^2.18.2
* **wagmi:** ^2.12.1
* **zod:** ^3.24.2

## Dev Dependencies

* **@react-native-async-storage/async-storage:** ^2.2.0
* **@types/node:** ^20
* **@types/react:** ^18
* **@types/react-dom:** ^18
* **genkit-cli:** ^1.20.0
* **postcss:** ^8
* **tailwindcss:** ^3.4.1
* **typescript:** ^5
