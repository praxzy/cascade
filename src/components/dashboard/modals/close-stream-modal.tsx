'use client';

import { useState } from 'react';

import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface CloseStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  streamId?: string;
}

export function CloseStreamModal({ isOpen, onClose, streamId }: CloseStreamModalProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rentRefund = 0.002;

  const resetForm = () => {
    setAcknowledged(false);
  };

  const handleSubmit = async () => {
    if (!acknowledged) {
      toast.error('Acknowledgment required', {
        description: 'Please confirm you understand this action is permanent.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Stream closed successfully!', {
        description: `Stream ${streamId ?? 'unknown'} closed. ~${rentRefund} SOL rent refund has been processed and returned to your wallet.`,
      });
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to close stream', { streamId, error });
      toast.error('Failed to close stream', {
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
            Close Stream
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Warning message */}
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              Closing a stream is permanent and cannot be reversed. The stream PDA will be closed and rent will be
              refunded.
            </p>
          </div>

          {/* Conditions */}
          <Card className="bg-muted/50">
            <CardContent className="space-y-2 pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Vault Balance</p>
                <p className="font-semibold">$0.00</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Stream Status</p>
                <p className="font-semibold">Inactive</p>
              </div>
            </CardContent>
          </Card>

          {/* Rent refund */}
          <Card>
            <CardContent className="pt-6">
              <p className="mb-2 text-sm text-muted-foreground">Rent Refund</p>
              <p className="text-lg font-bold">~{rentRefund} SOL</p>
              <p className="mt-1 text-xs text-muted-foreground">Will be returned to your wallet</p>
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
              I understand this action is permanent and cannot be undone
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
              {isSubmitting ? 'Processing...' : 'Close Stream'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
