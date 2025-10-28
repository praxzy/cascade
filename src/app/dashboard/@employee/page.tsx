'use client';

import { useState } from 'react';

import { formatDistanceToNow } from 'date-fns';
import { ArrowDownToLine, Clock, DollarSign, ExternalLink, RefreshCw, TrendingUp, Wallet } from 'lucide-react';
import { toast } from 'sonner';

import { EmptyState } from '@/components/dashboard/empty-state';
import { useEmployeeDashboard } from '@/components/employee-dashboard/employee-dashboard-context';
import { WithdrawModal } from '@/components/employee-dashboard/modals/withdraw-modal';
import { useSolana } from '@/components/solana/use-solana';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EmployeeOverviewPage() {
  const { account, connected } = useSolana();
  const { triggerRefresh } = useEmployeeDashboard();
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedStream, setSelectedStream] = useState<{
    id: string;
    employerName: string;
    availableBalance: number;
  } | null>(null);

  const handleWithdrawClick = (stream: { id: string; employerName: string; availableBalance: number }) => {
    setSelectedStream(stream);
    setWithdrawModalOpen(true);
  };

  const handleRefreshActivity = async () => {
    setIsRefreshing(true);
    try {
      // TODO: Implement actual refresh_activity instruction call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      triggerRefresh();
      toast.success('Activity refreshed successfully');
    } catch (error) {
      console.error('Refresh failed:', error);
      toast.error('Failed to refresh activity');
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!connected || !account) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
              <p className="text-muted-foreground">Connect your wallet to view your payment streams and earnings</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Mock data - TODO: Fetch actual data from blockchain
  // Note: Employee works for one employer only
  const employerName = 'Acme Corp'; // This should come from blockchain/backend

  const stats = {
    totalEarned: 12450.75,
    availableToWithdraw: 1250.5,
    activeStreams: 1,
  };

  const activeStreams = [
    {
      id: '1',
      employerName: employerName,
      employerAddress: '7xKXtg2vJ8kxKFGH3qK9pL2mN5oP7rQ8sT9uV1wX2yZ3',
      hourlyRate: 25.0,
      availableBalance: 1250.5,
      startDate: new Date('2025-10-01'),
      status: 'active' as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Track your payment streams, earnings, and activity</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleRefreshActivity} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Activity
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-2 text-xs font-medium sm:text-sm">
              <DollarSign className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
              <span className="truncate">Total Earned</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold sm:text-2xl">${stats.totalEarned.toFixed(2)}</p>
            <p className="mt-1 text-xs text-muted-foreground">All-time earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-2 text-xs font-medium sm:text-sm">
              <TrendingUp className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
              <span className="truncate">Available to Withdraw</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold sm:text-2xl">${stats.availableToWithdraw.toFixed(2)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Ready to withdraw</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-2 text-xs font-medium sm:text-sm">
              <Clock className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
              <span className="truncate">Active Streams</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold sm:text-2xl">{stats.activeStreams}</p>
            <p className="mt-1 text-xs text-muted-foreground">Payment streams</p>
          </CardContent>
        </Card>
      </div>
      {/* Active Streams Section */}
      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Active Payment Streams</h2>
          <p className="text-sm text-muted-foreground">Real-time streaming payments from your employers</p>
        </div>

        {activeStreams.length === 0 ? (
          <EmptyState
            title="No Active Streams"
            description="You don't have any active payment streams yet. Contact your employer to get started."
          />
        ) : (
          <div className="space-y-3">
            {activeStreams.map((stream) => (
              <div
                key={stream.id}
                className="flex flex-col justify-between gap-4 rounded-lg border border-border/50 bg-muted/30 p-4 sm:flex-row sm:items-center"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{stream.employerName}</p>
                    <Badge variant="outline" className="text-xs">
                      <span className="mr-1.5 flex h-1.5 w-1.5 rounded-full bg-green-500" />
                      Active
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ${stream.hourlyRate.toFixed(2)}/hour • Started {stream.startDate.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Available</p>
                    <p className="text-lg font-bold text-green-600">${stream.availableBalance.toFixed(2)}</p>
                  </div>
                  <Button size="sm" className="gap-2" onClick={() => handleWithdrawClick(stream)}>
                    <ArrowDownToLine className="h-4 w-4" />
                    Withdraw
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Payment History Section */}
      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Recent Withdrawals</h2>
          <p className="text-sm text-muted-foreground">Your withdrawal history and transaction records</p>
        </div>

        {/* Mock payment history data */}
        {(() => {
          const payments = [
            {
              id: '1',
              amount: 2500.0,
              employer: employerName,
              timestamp: new Date('2025-10-25'),
              txSignature: '5yHKdg4xL0mzMHIJ5sM1rN4oP7qR9tS0uV1wX3yZ4aB5cD6eF7gH8iJ9kL0mN1oP',
              status: 'completed' as const,
            },
            {
              id: '2',
              amount: 1850.5,
              employer: employerName,
              timestamp: new Date('2025-10-21'),
              txSignature: '8bMZvi5yM1n0NIJk6tN2sO5pQ8rS0uT1vW2xY4zA5bC6dD7eF8gH9iJ0kL1mN2oP',
              status: 'completed' as const,
            },
            {
              id: '3',
              amount: 3200.0,
              employer: employerName,
              timestamp: new Date('2025-10-18'),
              txSignature: '9cN0wj6zN2o1OJKl7uO3tP6qR9sT1vU2wX3yZ5aB6cC7dD8eF9gH0iJ1kL2mN3oP',
              status: 'completed' as const,
            },
          ];

          return payments.length === 0 ? (
            <EmptyState title="No Withdrawal History" description="You haven't made any withdrawals yet" />
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex flex-col justify-between gap-3 rounded-lg border border-border/50 bg-muted/30 p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{payment.employer}</p>
                      <Badge variant="outline" className="border-green-200 bg-green-500/10 text-xs text-green-700">
                        Completed
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(payment.timestamp, { addSuffix: true })}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <code className="rounded bg-muted px-1">
                        {payment.txSignature.slice(0, 8)}...{payment.txSignature.slice(-8)}
                      </code>
                      <a
                        href={`https://explorer.solana.com/tx/${payment.txSignature}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 transition-colors hover:text-primary"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View
                      </a>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">+${payment.amount.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </Card>

      {/* Withdraw Modal */}
      {selectedStream && (
        <WithdrawModal
          isOpen={withdrawModalOpen}
          onClose={() => {
            setWithdrawModalOpen(false);
            setSelectedStream(null);
          }}
          streamId={selectedStream.id}
          availableBalance={selectedStream.availableBalance}
          employerName={selectedStream.employerName}
        />
      )}
    </div>
  );
}
