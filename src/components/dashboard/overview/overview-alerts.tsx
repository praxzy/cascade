'use client';

import { Flame, ShieldAlert, Sparkles, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { OverviewAlert, OverviewAlertLevel } from '@/lib/dashboard/stream-insights';

const LEVEL_LABELS: Record<OverviewAlertLevel, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
};

const LEVEL_STYLES: Record<OverviewAlertLevel, { container: string; badge: string; icon: typeof ShieldAlert }> = {
  critical: {
    container: 'border-destructive/40 bg-destructive/10',
    badge: 'bg-destructive/15 text-destructive border border-destructive/20',
    icon: ShieldAlert,
  },
  high: {
    container: 'border-amber-500/40 bg-amber-500/10',
    badge: 'bg-amber-500/15 text-amber-600 border border-amber-500/20',
    icon: Flame,
  },
  medium: {
    container: 'border-sky-500/40 bg-sky-500/10',
    badge: 'bg-sky-500/15 text-sky-600 border border-sky-500/20',
    icon: Sparkles,
  },
};

export function OverviewAlerts({
  alerts,
  onCreateStream,
  onAddEmployee,
  hasSetupProgress,
  isFundingReady,
}: {
  alerts: OverviewAlert[];
  onCreateStream: () => void;
  onAddEmployee: () => void;
  hasSetupProgress: boolean;
  isFundingReady: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length > 0 ? (
          alerts.map((alert) => {
            const styles = LEVEL_STYLES[alert.level];
            const Icon = styles.icon;
            return (
              <div key={alert.id} className={`flex items-start gap-3 rounded-lg border px-3 py-3 ${styles.container}`}>
                <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm leading-tight font-semibold">{alert.title}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles.badge}`}>
                      {LEVEL_LABELS[alert.level]}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{alert.description}</p>
                </div>
              </div>
            );
          })
        ) : hasSetupProgress ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-muted-foreground/40 bg-muted/10 px-4 py-6 text-center">
            <Sparkles className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">No alerts right now</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Keep your treasury funded and we’ll highlight any risks as they appear.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={onCreateStream}
              disabled={!hasSetupProgress || !isFundingReady}
            >
              Create Stream
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-muted-foreground/40 bg-muted/10 px-4 py-6 text-center">
            <UserPlus className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Add your first employee</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Invite a team member to start receiving payroll alerts here.
              </p>
            </div>
            <Button size="sm" onClick={onAddEmployee}>
              Add Employee
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
