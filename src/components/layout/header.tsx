import Link from 'next/link';
import { Layers } from 'lucide-react';
import { Navigation } from './navigation';
import { WalletConnect } from '../wallet-connect';

export function Header() {
  return (
    <header className="bg-background/60 backdrop-blur-md sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Layers className="h-6 w-6 text-primary" />
              <span className="font-headline text-xl font-bold">ChainCanvas</span>
            </Link>
            <Navigation />
          </div>
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}
