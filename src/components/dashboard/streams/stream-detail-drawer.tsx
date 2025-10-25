'use client';

import { Copy, Download, ExternalLink, X } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

import { StreamActionButtons } from './stream-action-buttons';
import { StreamActivityHistory } from './stream-activity-history';

interface StreamDetailDrawerProps {
  streamId: string;
  onClose: () => void;
  isOpen: boolean;
}

// Mock stream data
const MOCK_STREAM_DETAIL = {
  id: '1',
  employeeName: 'Alice Johnson',
  employeeAddress: '7xL...abc',
  streamAddress: '7xL...stream1',
  vaultAddress: '7xL...vault1',
  mint: 'USDC',
  hourlyRate: 50,
  vaultBalance: 2400,
  totalDeposited: 5000,
  availableToWithdraw: 1200,
  status: 'active' as const,
  lastActivity: '2 hours ago',
  cluster: 'devnet',
};

export function StreamDetailDrawer({ streamId, onClose, isOpen }: StreamDetailDrawerProps) {
  const stream = MOCK_STREAM_DETAIL;
  const isMobile = useIsMobile();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard', {
      description: `${label} address has been copied.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-700';
      case 'suspended':
        return 'bg-red-500/10 text-red-700';
      case 'closed':
        return 'bg-gray-500/10 text-gray-700';
      default:
        return 'bg-gray-500/10 text-gray-700';
    }
  };

  return (
    <Drawer
      direction={isMobile ? undefined : 'right'}
      dismissible={false}
      modal={true}
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <DrawerContent
        className={`max-h-full ${isMobile ? '' : 'fixed top-0 right-0 bottom-0 w-96 rounded-none border-l'}`}
        style={!isMobile ? { left: 'auto', right: 0, top: 0, bottom: 0, borderRadius: 0 } : {}}
      >
        <div className="absolute top-4 right-4 z-10">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className={`overflow-y-auto ${isMobile ? 'px-4 pt-12 pb-6' : 'px-6 pt-12 pb-6'}`}>
          <div className="space-y-4">
            {/* Header */}
            <div>
              <DrawerTitle className="text-lg font-bold">{stream.employeeName}</DrawerTitle>
              <p className="mt-1 text-xs text-muted-foreground">{stream.employeeAddress}</p>
            </div>

            {/* Status badge */}
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(stream.status)} variant="secondary">
                {stream.status}
              </Badge>
              <span className="text-xs text-muted-foreground">{stream.cluster}</span>
            </div>

            {/* Balance section - Compact grid */}
            <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3">
              <div>
                <p className="text-xs text-muted-foreground">Vault Balance</p>
                <p className="text-lg font-bold">${stream.vaultBalance}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Deposited</p>
                <p className="text-lg font-bold">${stream.totalDeposited}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Available</p>
                <p className="text-lg font-bold">${stream.availableToWithdraw}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Hourly Rate</p>
                <p className="text-lg font-bold">${stream.hourlyRate}</p>
              </div>
            </div>

            {/* Runway meter */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium">Runway</p>
                <p className="text-sm font-semibold">48 hours</p>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-2 rounded-full bg-green-500" style={{ width: '75%' }} />
              </div>
            </div>

            {/* Activity history */}
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="activity" className="mt-3 space-y-3">
                <StreamActivityHistory />
              </TabsContent>

              <TabsContent value="details" className="mt-3 space-y-3">
                <div className="space-y-2">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Stream Addresses
                  </p>
                  <div className="space-y-2">
                    <div>
                      <p className="mb-1 text-xs text-muted-foreground">Stream PDA</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 truncate rounded bg-muted p-2 font-mono text-xs">
                          {stream.streamAddress}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => copyToClipboard(stream.streamAddress, 'stream')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-muted-foreground">Vault PDA</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 truncate rounded bg-muted p-2 font-mono text-xs">
                          {stream.vaultAddress}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => copyToClipboard(stream.vaultAddress, 'vault')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                        <ExternalLink className="h-4 w-4" />
                        Explorer
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Action buttons */}
            <StreamActionButtons streamId={streamId} status={stream.status} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
