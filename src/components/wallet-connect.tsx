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

export function WalletConnect() {
  const { address, isConnected } = useAccount();
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connect your wallet</DialogTitle>
            <DialogDescription>
              Select your preferred wallet to connect to ChainCanvas.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
             {connectors.filter(c => c.name !== 'Injected').map((connector) => (
              <Button
                key={connector.id}
                onClick={() => {
                    connect({ connector });
                    setOpen(false);
                }}
                variant="outline"
                className='h-14 text-lg'
              >
                {connector.name}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={`https://picsum.photos/seed/${address}/32/32`} />
            <AvatarFallback>CC</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline">{shortAddress}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
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
        <DropdownMenuItem onClick={() => disconnect()} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
