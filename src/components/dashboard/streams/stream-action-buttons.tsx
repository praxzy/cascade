'use client';

import { useDashboard } from '@/components/dashboard/dashboard-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface StreamActionButtonsProps {
  streamId: string;
  status: 'active' | 'suspended' | 'closed';
}

export function StreamActionButtons({ streamId, status }: StreamActionButtonsProps) {
  const { setIsTopUpModalOpen, setIsEmergencyWithdrawModalOpen, setIsCloseStreamModalOpen, setSelectedStreamId } =
    useDashboard();

  const handleTopUp = () => {
    setSelectedStreamId(streamId);
    setIsTopUpModalOpen(true);
  };

  const handleEmergencyWithdraw = () => {
    setSelectedStreamId(streamId);
    setIsEmergencyWithdrawModalOpen(true);
  };

  const handleCloseStream = () => {
    setSelectedStreamId(streamId);
    setIsCloseStreamModalOpen(true);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          {status === 'active' && (
            <>
              <Button className="w-full" onClick={handleTopUp}>
                Top Up Stream
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={handleEmergencyWithdraw}>
                Emergency Withdraw
              </Button>
            </>
          )}

          {status === 'suspended' && (
            <>
              <Button className="w-full">Reactivate Stream</Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={handleCloseStream}>
                Close Stream
              </Button>
            </>
          )}

          {status === 'closed' && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              This stream is closed and cannot be modified
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
