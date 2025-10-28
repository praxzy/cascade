'use client';

import { useState } from 'react';

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  streamId: string;
  availableBalance: number;
  employerName: string;
}

export function WithdrawModal({
  isOpen,
  onClose,
  streamId: _streamId,
  availableBalance,
  employerName,
}: WithdrawModalProps) {
  const [amount, setAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);

    if (!withdrawAmount || withdrawAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (withdrawAmount > availableBalance) {
      toast.error('Amount exceeds available balance');
      return;
    }

    setIsWithdrawing(true);
    try {
      // TODO: Implement actual withdrawal transaction using _streamId
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(`Successfully withdrew $${withdrawAmount.toFixed(2)}`);
      onClose();
      setAmount('');
    } catch (error) {
      console.error('Withdrawal failed:', error);
      toast.error('Withdrawal failed. Please try again.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleMaxClick = () => {
    setAmount(availableBalance.toString());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>Withdraw your earned funds from {employerName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="amount">Amount</Label>
              <Button type="button" variant="ghost" size="sm" className="h-auto p-0 text-xs" onClick={handleMaxClick}>
                Max: ${availableBalance.toFixed(2)}
              </Button>
            </div>
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7"
                step="0.01"
                min="0"
                max={availableBalance}
              />
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Available Balance</span>
              <span className="font-medium">${availableBalance.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={isWithdrawing}>
            Cancel
          </Button>
          <Button onClick={handleWithdraw} className="flex-1" disabled={isWithdrawing}>
            {isWithdrawing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
