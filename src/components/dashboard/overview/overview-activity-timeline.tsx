'use client';

import { useState } from 'react';

import { ChevronDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivityEvent {
  id: string;
  type: 'stream_created' | 'top_up' | 'withdrawal' | 'refresh' | 'emergency' | 'close' | 'employee_added';
  actor: string;
  amount?: string;
  description: string;
  timestamp: string;
  category: 'Funding' | 'Employee' | 'System';
}

const ACTIVITY_EVENTS: ActivityEvent[] = [
  {
    id: '1',
    type: 'stream_created',
    actor: 'You',
    description: 'Created payment stream for Alice Johnson',
    timestamp: '2 hours ago',
    category: 'System',
  },
  {
    id: '2',
    type: 'top_up',
    actor: 'You',
    amount: '$500',
    description: 'Topped up stream for Bob Smith',
    timestamp: '5 hours ago',
    category: 'Funding',
  },
  {
    id: '3',
    type: 'employee_added',
    actor: 'You',
    description: 'Added employee Carol Davis',
    timestamp: '1 day ago',
    category: 'Employee',
  },
  {
    id: '4',
    type: 'withdrawal',
    actor: 'Alice Johnson',
    amount: '$150',
    description: 'Withdrew vested funds',
    timestamp: '2 days ago',
    category: 'Funding',
  },
  {
    id: '5',
    type: 'refresh',
    actor: 'System',
    description: 'Refreshed activity for all streams',
    timestamp: '3 days ago',
    category: 'System',
  },
];

const FILTER_OPTIONS = ['All', 'Funding', 'Employee', 'System'];

export function OverviewActivityTimeline() {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredEvents =
    selectedFilter === 'All' ? ACTIVITY_EVENTS : ACTIVITY_EVENTS.filter((e) => e.category === selectedFilter);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Funding':
        return 'bg-blue-500/10 text-blue-700';
      case 'Employee':
        return 'bg-purple-500/10 text-purple-700';
      case 'System':
        return 'bg-gray-500/10 text-gray-700';
      default:
        return 'bg-gray-500/10 text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredEvents.map((event) => (
            <div key={event.id} className="flex gap-4 border-b border-border pb-3 last:border-0">
              <div className="mt-1 shrink-0">
                <div className={`h-2 w-2 rounded-full ${getCategoryColor(event.category).split(' ')[0]}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{event.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {event.actor} • {event.timestamp}
                    </p>
                  </div>
                  {event.amount && <p className="shrink-0 text-sm font-semibold">{event.amount}</p>}
                </div>
                <Badge variant="secondary" className={`mt-2 text-xs ${getCategoryColor(event.category)}`}>
                  {event.category}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <Button variant="ghost" className="mt-4 w-full">
          View All Activity
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
