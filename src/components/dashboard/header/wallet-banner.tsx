'use client';

import { Wallet } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAccountStateConfig } from '@/lib/config/account-states';
import { AccountState } from '@/lib/enums';

import { useDashboard } from '../dashboard-context';

export function WalletBanner() {
  const { accountState } = useDashboard();
  const config = getAccountStateConfig(accountState);

  const isConnected = config.state !== AccountState.NEW_ACCOUNT && config.state !== AccountState.ONBOARDING;
  const walletAddress = '7xL...abc123';
  const cluster = 'devnet';
  const selectedMint = 'USDC';

  return (
    <div className="border-b border-border bg-muted/50 px-6 py-3 md:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Wallet className="h-4 w-4 text-muted-foreground" />
          {isConnected ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{walletAddress}</span>
              <Badge variant="secondary" className="text-xs">
                {cluster}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {selectedMint}
              </Badge>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Connect your wallet to get started</span>
          )}
        </div>
        <Button size="sm" variant={isConnected ? 'outline' : 'default'}>
          {isConnected ? 'Switch Wallet' : 'Connect Wallet'}
        </Button>
      </div>
    </div>
  );
}
