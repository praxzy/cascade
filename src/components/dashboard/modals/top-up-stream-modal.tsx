'use client';

import { useState } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TopUpStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  streamId?: string;
}

export function TopUpStreamModal({ isOpen, onClose, streamId }: TopUpStreamModalProps) {
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentVaultBalance = 2400;
  const hourlyRate = 50;
  const currentRunway = Math.floor(currentVaultBalance / (hourlyRate * 24));

  const newVaultBalance = currentVaultBalance + (Number.parseFloat(topUpAmount) || 0);
  const newRunway = Math.floor(newVaultBalance / (hourlyRate * 24));

  const resetForm = () => {
    setTopUpAmount('');
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
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Stream topped up successfully!', {
        description: `Stream ${streamId ?? 'unknown'} received $${topUpAmount}. New runway: ${newRunway} days.`,
      });
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to top up stream', { streamId, error });
      toast.error('Failed to top up stream', {
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
          <DialogTitle>Top Up Stream</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current balance */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Current Balance</p>
                  <p className="text-lg font-semibold">${currentVaultBalance}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Current Runway</p>
                  <p className="text-lg font-semibold">{currentRunway} days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top up amount */}
          <div className="space-y-2">
            <Label htmlFor="topup-amount">Top Up Amount (USD)</Label>
            <Input
              id="topup-amount"
              type="number"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              placeholder="500.00"
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
                  <span className="text-muted-foreground">New Balance</span>
                  <span className="font-semibold">${newVaultBalance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">New Runway</span>
                  <span className="font-semibold">{newRunway} days</span>
                </div>
                <div className="flex justify-between border-t border-border pt-3">
                  <span className="text-muted-foreground">Total Deposited</span>
                  <span className="font-semibold">${(5000 + Number.parseFloat(topUpAmount)).toFixed(2)}</span>
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
