import { GasOptimizerForm } from '@/components/gas-optimizer-form';

export default function GasOptimizerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold">Gas Optimizer</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Analyze your pending NFT transactions on Base. Our AI-powered tool will suggest if batching them is a good idea to save on gas fees.
        </p>
      </div>
      <GasOptimizerForm />
    </div>
  );
}
