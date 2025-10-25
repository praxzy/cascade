'use client';

import { useState } from 'react';

import { Download, Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getAccountStateConfig } from '@/lib/config/account-states';

import { useDashboard } from '../dashboard-context';
import { EmptyState } from '../empty-state';

interface ActivityEvent {
  id: string;
  timestamp: string;
  type: 'funding' | 'employee' | 'stream' | 'system';
  action: string;
  description: string;
  actor: string;
  status: 'success' | 'pending' | 'failed';
}

const MOCK_ACTIVITY: ActivityEvent[] = [
  {
    id: '1',
    timestamp: '2024-10-23T14:32:00Z',
    type: 'funding',
    action: 'Deposit',
    description: 'Deposited 1000 USDC to vault',
    actor: 'admin@cascade.com',
    status: 'success',
  },
  {
    id: '2',
    timestamp: '2024-10-23T13:15:00Z',
    type: 'stream',
    action: 'Stream Created',
    description: 'Created payment stream for John Doe',
    actor: 'admin@cascade.com',
    status: 'success',
  },
  {
    id: '3',
    timestamp: '2024-10-23T12:00:00Z',
    type: 'employee',
    action: 'Employee Invited',
    description: 'Invited jane@example.com to join',
    actor: 'admin@cascade.com',
    status: 'pending',
  },
  {
    id: '4',
    timestamp: '2024-10-22T16:45:00Z',
    type: 'system',
    action: 'Settings Updated',
    description: 'Updated notification preferences',
    actor: 'admin@cascade.com',
    status: 'success',
  },
];

const typeColors = {
  funding: 'bg-blue-100 text-blue-800',
  employee: 'bg-purple-100 text-purple-800',
  stream: 'bg-green-100 text-green-800',
  system: 'bg-gray-100 text-gray-800',
};

const statusColors = {
  success: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
};

export function ActivityLogTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'funding' | 'employee' | 'stream' | 'system'>('all');
  const { accountState } = useDashboard();
  const config = getAccountStateConfig(accountState);

  const filteredActivity = MOCK_ACTIVITY.filter((event) => {
    const matchesSearch =
      event.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.actor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesType;
  });

  if (!config.showActivityLogTab) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Activity Log</h1>
          <p className="text-muted-foreground">View all organization activities and events</p>
        </div>
        <EmptyState
          icon={<Search className="h-12 w-12 text-muted-foreground" />}
          title="Activity Log Coming Soon"
          description="Complete your wallet setup to start tracking activities"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Activity Log</h1>
          <p className="text-muted-foreground">View all organization activities and events</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'funding', 'employee', 'stream', 'system'] as const).map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType(type)}
                  className="capitalize"
                >
                  {type === 'all' ? 'All' : type}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity list */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>{filteredActivity.length} events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredActivity.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No activities found</p>
            ) : (
              filteredActivity.map((event) => (
                <div key={event.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <Badge className={typeColors[event.type]}>{event.type}</Badge>
                      <Badge className={statusColors[event.status]} variant="secondary">
                        {event.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold">{event.action}</h3>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      By {event.actor} • {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
