'use client';

import { AlertCircle, TrendingDown, Users, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAccountStateConfig } from '@/lib/config/account-states';

import { useDashboard } from '../dashboard-context';
import { EmptyState } from '../empty-state';
import { OverviewActivityTimeline } from '../overview/overview-activity-timeline';
import { OverviewAlerts } from '../overview/overview-alerts';
import { OverviewChecklist } from '../overview/overview-checklist';
import { OverviewMetrics } from '../overview/overview-metrics';

export function OverviewTab() {
  const { accountState, setIsCreateStreamModalOpen } = useDashboard();

  const config = getAccountStateConfig(accountState);
  const hasStreams = config.hasStreams;

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Overview</h1>
        <p className="text-xs text-muted-foreground sm:text-sm">Manage your payment streams and employee payroll</p>
      </div>

      {/* Empty state with setup checklist */}
      {config.showOnboarding && (
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          <Card className="border-2 border-dashed">
            <CardContent className="pt-6 sm:pt-8">
              <div className="space-y-3 text-center sm:space-y-4">
                <div className="flex justify-center">
                  <Zap className="h-10 w-10 text-muted-foreground sm:h-12 sm:w-12" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold sm:text-xl">Get started with your first payment stream</h2>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                    Complete the setup checklist below to enable payment streams
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <OverviewChecklist />

          <div className="flex justify-center gap-3">
            <Button size="lg" onClick={() => setIsCreateStreamModalOpen(true)}>
              Add Employee
            </Button>
          </div>
        </div>
      )}

      {/* Wallet connected but no streams yet */}
      {!config.showOnboarding && !hasStreams && (
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          <EmptyState
            icon={<Zap className="h-10 w-10 text-muted-foreground sm:h-12 sm:w-12" />}
            title="Ready to create your first stream"
            description="Your wallet is connected. Create your first payment stream to get started with employee payroll."
            action={{
              label: 'Create First Stream',
              onClick: () => setIsCreateStreamModalOpen(true),
            }}
          />
        </div>
      )}

      {/* Active state with metrics and alerts */}
      {!config.showOnboarding && hasStreams && (
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {/* KPI Row */}
          {config.showMetrics && <OverviewMetrics />}

          {/* Secondary metrics grid */}
          {config.showSecondaryMetrics && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="flex items-center gap-2 text-xs font-medium sm:text-sm">
                    <AlertCircle className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
                    <span className="truncate">Pending Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold sm:text-2xl">2</p>
                  <p className="mt-1 text-xs text-muted-foreground">Require attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="flex items-center gap-2 text-xs font-medium sm:text-sm">
                    <TrendingDown className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
                    <span className="truncate">Inactivity Risk</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold sm:text-2xl">1</p>
                  <p className="mt-1 text-xs text-muted-foreground">25+ days inactive</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="flex items-center gap-2 text-xs font-medium sm:text-sm">
                    <Zap className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
                    <span className="truncate">Clawbacks (30d)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold sm:text-2xl">0</p>
                  <p className="mt-1 text-xs text-muted-foreground">Emergency withdrawals</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="flex items-center gap-2 text-xs font-medium sm:text-sm">
                    <Users className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
                    <span className="truncate">Token Health</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold sm:text-2xl">100%</p>
                  <p className="mt-1 text-xs text-muted-foreground">Above threshold</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Activity and Alerts */}
          {(config.showActivityTimeline || config.showAlerts) && (
            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 lg:grid-cols-3">
              {config.showActivityTimeline && (
                <div className="lg:col-span-2">
                  <OverviewActivityTimeline />
                </div>
              )}
              {config.showAlerts && (
                <div>
                  <OverviewAlerts />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
