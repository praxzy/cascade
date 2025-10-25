'use client';

import { AlertTriangle, ArrowRight, Flame, PiggyBank, ShieldAlert, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AccountState } from '@/lib/enums';

import { useDashboard } from '../dashboard-context';

const fundingMetrics = [
  {
    label: 'Vault Balance',
    value: '$12,450.50',
    helper: 'Available to deploy',
  },
  {
    label: 'Token Treasury',
    value: '$8,200.00',
    helper: 'Buffered for the next cycle',
  },
  {
    label: 'Runway',
    value: '18 days',
    helper: 'At current burn rate',
  },
];

type AlertLevel = 'critical' | 'high' | 'medium';

const alertItems: Array<{
  id: string;
  title: string;
  description: string;
  level: AlertLevel;
}> = [
  {
    id: 'low-runway',
    title: 'Critical runway',
    description: '72 hours of funding remaining for 4 employees.',
    level: 'critical',
  },
  {
    id: 'inactive-streams',
    title: 'Streams paused',
    description: '2 streams haven’t distributed in 25 days.',
    level: 'high',
  },
  {
    id: 'pending-approvals',
    title: 'Pending approvals',
    description: '3 invitation approvals waiting for action.',
    level: 'medium',
  },
];

const levelStyles: Record<
  AlertLevel,
  {
    container: string;
    badge: string;
    badgeText: string;
    iconColor: string;
  }
> = {
  critical: {
    container: 'border-destructive/40 bg-destructive/10',
    badge: 'bg-destructive/15 border border-destructive/20',
    badgeText: 'text-destructive',
    iconColor: 'text-destructive',
  },
  high: {
    container: 'border-amber-500/40 bg-amber-500/10',
    badge: 'bg-amber-500/15 border border-amber-500/20',
    badgeText: 'text-amber-600',
    iconColor: 'text-amber-600',
  },
  medium: {
    container: 'border-sky-500/40 bg-sky-500/10',
    badge: 'bg-sky-500/15 border border-sky-500/20',
    badgeText: 'text-sky-600',
    iconColor: 'text-sky-600',
  },
};

const levelLabels: Record<AlertLevel, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
};

const getLevelIcon = (level: AlertLevel) => {
  switch (level) {
    case 'critical':
      return ShieldAlert;
    case 'high':
      return Flame;
    default:
      return AlertTriangle;
  }
};

export function DashboardRightRail() {
  const { setIsTopUpModalOpen, accountState } = useDashboard();
  const isNewAccount = accountState === AccountState.NEW_ACCOUNT || accountState === AccountState.ONBOARDING;

  const hasFundingData = !isNewAccount;
  const hasAlerts = !isNewAccount && alertItems.length > 0;

  return (
    <div className="flex min-h-full flex-col gap-5 px-4 py-6 sm:px-5 md:px-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold">Funding summary</CardTitle>
              <p className="text-xs text-muted-foreground">Monitor balances and keep runway healthy.</p>
            </div>
            <Badge variant="outline" className="text-xs font-medium">
              Updated 5m ago
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasFundingData ? (
            fundingMetrics.map((metric) => (
              <div key={metric.label} className="rounded-lg border border-border/70 bg-muted/10 px-3 py-3">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{metric.label}</p>
                <p className="mt-1 text-xl leading-tight font-semibold">{metric.value}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{metric.helper}</p>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-muted-foreground/40 bg-muted/10 px-4 py-6 text-center">
              <Sparkles className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">No funding data yet</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Top up your vault or connect a treasury source to start tracking balances and runway.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="sm" onClick={() => setIsTopUpModalOpen(true)}>
            <PiggyBank className="mr-2 h-4 w-4" />
            Top up account
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold">Alerts</CardTitle>
              <p className="text-xs text-muted-foreground">Prioritize these actions to keep payouts flowing.</p>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground">
              View all
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {hasAlerts ? (
            alertItems.map((alert) => {
              const Icon = getLevelIcon(alert.level);
              const styles = levelStyles[alert.level];

              return (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 rounded-lg border px-3 py-3 ${styles.container}`}
                >
                  <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${styles.iconColor}`} />
                  <div className="min-w-0 flex-1 space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <p className="leading-none font-medium">{alert.title}</p>
                      <Badge className={`${styles.badge} ${styles.badgeText}`} variant="outline">
                        {levelLabels[alert.level]}
                      </Badge>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">{alert.description}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-muted-foreground/40 bg-muted/10 px-4 py-6 text-center">
              <Sparkles className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">No alerts right now</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  We’ll surface the most important risks here as soon as your team starts streaming.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
