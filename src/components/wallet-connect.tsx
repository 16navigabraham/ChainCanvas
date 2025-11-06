'use client';

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Wallet, LogOut, Copy, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatEther } from 'viem';
import { useState } from 'react';

// A helper component to render wallet icons
const WalletIcon = ({ name }: { name: string }) => {
    const icons: {[key: string]: string} = {
        'MetaMask': 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
        'Coinbase Wallet': 'https://images.ctfassets.net/c5bd0wqjc7v0/3h5jD9jdU62i2a81c8y46y/4b935d88817a0b8332a67a030076c8c1/coinbase-wallet-icon.svg',
        'WalletConnect': 'https://walletconnect.com/walletconnect-logo.svg',
        'Rainbow': 'https://rainbow.me/favicon.ico',
        'Injected': 'lucide:syringe'
    }

    if (name in icons) {
         if (icons[name].startsWith('lucide:')) {
            const lucideName = icons[name].split(':')[1];
            const LucideIcon = require('lucide-react')[lucideName] || Wallet;
            return <LucideIcon className="h-8 w-8" />
        }
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={icons[name]} alt={`${name} logo`} className="h-8 w-8" />
    }

    return <Wallet className="h-8 w-8" />;
};


export function WalletConnect() {
  const { address, isConnected, connector } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: 'Address Copied',
        description: 'Wallet address has been copied to clipboard.',
      });
    }
  };

  if (!isConnected) {
    return (
       <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Wallet />
            Connect Wallet
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-headline">Connect your wallet</DialogTitle>
            <DialogDescription className="text-center">
              Choose your preferred wallet provider to continue
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-3 pt-4">
             {connectors.map((c) => (
              <Button
                key={c.id}
                onClick={() => {
                    connect({ connector: c });
                    setOpen(false);
                }}
                variant="outline"
                className='h-16 text-lg justify-start px-6 rounded-xl hover:bg-primary/10 flex items-center gap-4'
              >
                <WalletIcon name={c.name} />
                <span>{c.name}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const ConnectedWalletIcon = () => {
    if (connector?.name) {
      return <WalletIcon name={connector.name} />;
    }
    return <AvatarImage src={`https://picsum.photos/seed/${address}/32/32`} />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 pr-2">
          <Avatar className="h-7 w-7">
            <ConnectedWalletIcon />
            <AvatarFallback>CC</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-xs font-bold leading-tight">{shortAddress}</span>
             <span className="text-xs text-muted-foreground leading-tight">
                {balance ? `${parseFloat(formatEther(balance.value)).toFixed(4)} ${balance.symbol}` : '...'}
             </span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className='flex flex-col'>
            <span>My Wallet</span>
            <span className='text-xs text-muted-foreground font-normal'>{connector?.name}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-sm">
          <p className="font-medium">Balance</p>
          <p className="text-muted-foreground">
            {balance ? `${parseFloat(formatEther(balance.value)).toFixed(4)} ${balance.symbol}` : '0 ETH'}
          </p>
        </div>
        <DropdownMenuItem onClick={copyAddress}>
          <Copy className="mr-2 h-4 w-4" />
          <span>Copy Address</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => disconnect()} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
