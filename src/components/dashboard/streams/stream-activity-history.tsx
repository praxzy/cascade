'use client';

import { Card, CardContent } from '@/components/ui/card';

interface ActivityEvent {
  id: string;
  type: string;
  description: string;
  amount?: string;
  timestamp: string;
}

const MOCK_ACTIVITY: ActivityEvent[] = [
  {
    id: '1',
    type: 'withdrawal',
    description: 'Employee withdrew vested funds',
    amount: '$150',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    type: 'refresh',
    description: 'Activity refreshed',
    timestamp: '5 hours ago',
  },
  {
    id: '3',
    type: 'top_up',
    description: 'Stream topped up',
    amount: '$500',
    timestamp: '1 day ago',
  },
];

export function StreamActivityHistory() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {MOCK_ACTIVITY.map((event) => (
            <div key={event.id} className="flex items-start justify-between border-b border-border pb-3 last:border-0">
              <div>
                <p className="text-sm font-medium">{event.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">{event.timestamp}</p>
              </div>
              {event.amount && <p className="text-sm font-semibold">{event.amount}</p>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
