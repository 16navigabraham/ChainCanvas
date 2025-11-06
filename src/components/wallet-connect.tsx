'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Wallet, LogOut, Copy, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (isConnected) {
      setAddress('0x12...aBcd');
      setBalance(`${(Math.random() * 2.5).toFixed(4)} ETH`);
    } else {
      setAddress('');
      setBalance('');
    }
  }, [isConnected]);

  const handleConnect = () => {
    setIsConnected(true);
    toast({
      title: 'Wallet Connected',
      description: 'You have successfully connected your wallet.',
    });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    toast({
      title: 'Wallet Disconnected',
      description: 'You have successfully disconnected your wallet.',
    });
  };

  const copyAddress = () => {
    navigator.clipboard.writeText('0x1234567890abcdef1234567890abcdef1234aBcd');
    toast({
      title: 'Address Copied',
      description: 'Wallet address has been copied to clipboard.',
    });
  };

  if (!isConnected) {
    return (
      <Button onClick={handleConnect}>
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src="https://picsum.photos/seed/avatar/32/32" />
            <AvatarFallback>CC</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline">{address}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-sm">
          <p className="font-medium">Balance</p>
          <p className="text-muted-foreground">{balance}</p>
        </div>
        <DropdownMenuItem onClick={copyAddress}>
          <Copy className="mr-2 h-4 w-4" />
          <span>Copy Address</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDisconnect} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
