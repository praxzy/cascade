'use client';

import { useState } from 'react';

import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface EmergencyWithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  streamId?: string;
}

export function EmergencyWithdrawModal({ isOpen, onClose, streamId }: EmergencyWithdrawModalProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const vaultBalance = 2400;
  const inactivityDays = 30;

  const resetForm = () => {
    setAcknowledged(false);
  };

  const handleSubmit = async () => {
    if (!acknowledged) {
      toast.error('Acknowledgment required', {
        description: 'Please confirm you understand the consequences.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Emergency withdrawal processed!', {
        description: `$${vaultBalance} has been refunded to your account. Stream ${streamId ?? 'unknown'} has been suspended.`,
      });
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to process emergency withdrawal', { streamId, error });
      toast.error('Failed to process withdrawal', {
        description: 'Please try again or contact support.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Emergency Withdraw
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Warning message */}
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              This action will immediately suspend the stream and refund remaining funds to your employer account. This
              cannot be undone.
            </p>
          </div>

          {/* Reason */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <p className="mb-2 text-sm text-muted-foreground">Reason for Withdrawal</p>
              <p className="font-semibold">Employee inactive for {inactivityDays} days</p>
            </CardContent>
          </Card>

          {/* Amount to be refunded */}
          <Card>
            <CardContent className="pt-6">
              <p className="mb-2 text-sm text-muted-foreground">Amount to be Refunded</p>
              <p className="text-2xl font-bold">${vaultBalance}</p>
            </CardContent>
          </Card>

          {/* Acknowledgment */}
          <div className="flex items-start gap-3 rounded-lg border border-border p-3">
            <Checkbox
              id="acknowledge"
              checked={acknowledged}
              onCheckedChange={(checked) => setAcknowledged(checked as boolean)}
            />
            <Label htmlFor="acknowledge" className="text-sm leading-relaxed">
              I understand this will suspend the stream and the employee will no longer receive hourly payments
            </Label>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 border-t border-border pt-6">
            <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleSubmit}
              disabled={!acknowledged || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Withdrawal'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
