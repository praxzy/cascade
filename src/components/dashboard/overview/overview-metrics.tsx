'use client';

import { HelpCircle } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MetricCardProps {
  label: string;
  value: string;
  tooltip: string;
}

function MetricCard({ label, value, tooltip }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{label}</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

export function OverviewMetrics() {
  // TODO: Replace with actual data from queries
  const metrics = [
    {
      label: 'Active Streams',
      value: '5',
      tooltip: 'Count of streams with is_active=true',
    },
    {
      label: 'Monthly Burn',
      value: '$3,600',
      tooltip: 'Σ(hourly_rate × 24 × 30 ÷ decimals)',
    },
    {
      label: 'Total Deposited',
      value: '$18,500',
      tooltip: 'Σ(total_deposited) across active streams',
    },
    {
      label: 'Vault Coverage',
      value: '5.1 days',
      tooltip: 'Σ(vault_balance) ÷ Σ(hourly_rate) in hours/days',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} {...metric} />
      ))}
    </div>
  );
}
