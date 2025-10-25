'use client';

import { useState } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TopUpAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TopUpAccountModal({ isOpen, onClose }: TopUpAccountModalProps) {
  const [topUpAmount, setTopUpAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('USDC');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentVaultBalance = 12450.5;
  const currentTokenBalance = 8200;
  const monthlyBurn = 3600;

  const newVaultBalance = currentVaultBalance + (Number.parseFloat(topUpAmount) || 0);
  const runwayDays = Math.floor(newVaultBalance / (monthlyBurn / 30));

  const resetForm = () => {
    setTopUpAmount('');
    setSelectedToken('USDC');
  };

  const handleSubmit = async () => {
    if (!topUpAmount || Number.parseFloat(topUpAmount) <= 0) {
      toast.error('Invalid amount', {
        description: 'Please enter a valid top-up amount.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Account topped up successfully!', {
        description: `$${topUpAmount} ${selectedToken} has been added to your account. New runway: ${runwayDays} days.`,
      });
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to top up account', error);
      toast.error('Failed to top up account', {
        description: 'Please try again or contact support.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (topUpAmount) {
      toast.info('Top up cancelled', {
        description: 'Your changes have been discarded.',
      });
    }
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Top Up Account</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current balances */}
          <Card className="bg-muted/50">
            <CardContent className="space-y-3 pt-6">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Vault Balance</span>
                <span className="font-semibold">${currentVaultBalance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Token Account</span>
                <span className="font-semibold">${currentTokenBalance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3">
                <span className="text-xs text-muted-foreground">Monthly Burn</span>
                <span className="font-semibold">${monthlyBurn.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Token selection */}
          <div className="space-y-2">
            <Label>Select Token</Label>
            <div className="grid grid-cols-2 gap-2">
              {['USDC', 'USDT'].map((token) => (
                <button
                  key={token}
                  onClick={() => setSelectedToken(token)}
                  className={`rounded-lg border p-2 text-sm font-medium transition-colors ${
                    selectedToken === token ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                  }`}
                >
                  {token}
                </button>
              ))}
            </div>
          </div>

          {/* Top up amount */}
          <div className="space-y-2">
            <Label htmlFor="topup-amount">Top Up Amount (USD)</Label>
            <Input
              id="topup-amount"
              type="number"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              placeholder="1000.00"
            />
          </div>

          {/* New balance preview */}
          {topUpAmount && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">After Top Up</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">New Vault Balance</span>
                  <span className="font-semibold">${newVaultBalance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Runway</span>
                  <span className="font-semibold">{runwayDays} days</span>
                </div>
                <div className="flex justify-between border-t border-border pt-3">
                  <span className="text-muted-foreground">Network Fee</span>
                  <span className="font-semibold">~0.00025 SOL</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 border-t border-border pt-6">
            <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!topUpAmount || isSubmitting} className="flex-1">
              {isSubmitting ? 'Processing...' : 'Confirm Top Up'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
