'use client';

import { useState } from 'react';

import { Filter, Plus, Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

import { EmptyState } from '../empty-state';

interface Stream {
  id: string;
  employeeName: string;
  employeeAddress: string;
  mint: string;
  hourlyRate: number;
  vaultBalance: number;
  availableToWithdraw: number;
  status: 'active' | 'suspended' | 'closed' | 'draft';
  lastActivity: string;
}

// Mock data
const MOCK_STREAMS: Stream[] = [
  {
    id: '1',
    employeeName: 'Alice Johnson',
    employeeAddress: '7xL...abc',
    mint: 'USDC',
    hourlyRate: 50,
    vaultBalance: 2400,
    availableToWithdraw: 1200,
    status: 'active',
    lastActivity: '2 hours ago',
  },
  {
    id: '2',
    employeeName: 'Bob Smith',
    employeeAddress: '7xL...def',
    mint: 'USDC',
    hourlyRate: 45,
    vaultBalance: 1800,
    availableToWithdraw: 900,
    status: 'active',
    lastActivity: '5 hours ago',
  },
  {
    id: '3',
    employeeName: 'Carol Davis',
    employeeAddress: '7xL...ghi',
    mint: 'USDC',
    hourlyRate: 55,
    vaultBalance: 500,
    availableToWithdraw: 250,
    status: 'active',
    lastActivity: '1 day ago',
  },
  {
    id: '4',
    employeeName: 'David Wilson',
    employeeAddress: '7xL...jkl',
    mint: 'USDC',
    hourlyRate: 40,
    vaultBalance: 0,
    availableToWithdraw: 0,
    status: 'suspended',
    lastActivity: '30 days ago',
  },
];

interface StreamsListProps {
  filterStatus: 'all' | 'active' | 'inactive' | 'closed' | 'draft' | 'needs-attention';
  onFilterChange: (status: 'all' | 'active' | 'inactive' | 'closed' | 'draft' | 'needs-attention') => void;
  onSelectStream: (streamId: string) => void;
  selectedStreamId: string | null;
}

export function StreamsList({ filterStatus, onFilterChange, onSelectStream, selectedStreamId }: StreamsListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStreams = MOCK_STREAMS.filter((stream) => {
    // Filter by status
    if (filterStatus === 'active' && stream.status !== 'active') return false;
    if (filterStatus === 'inactive' && stream.status === 'active') return false;
    if (filterStatus === 'closed' && stream.status !== 'closed') return false;
    if (filterStatus === 'draft' && stream.status !== 'draft') return false;
    if (filterStatus === 'needs-attention' && stream.vaultBalance > 1000) return false;

    // Filter by search
    if (
      searchQuery &&
      !stream.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !stream.employeeAddress.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-700';
      case 'suspended':
        return 'bg-red-500/10 text-red-700';
      case 'closed':
        return 'bg-gray-500/10 text-gray-700';
      case 'draft':
        return 'bg-yellow-500/10 text-yellow-700';
      default:
        return 'bg-gray-500/10 text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle>Payment Streams</CardTitle>
          <div className="flex gap-2">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onFilterChange('all')}>
                  All Streams {filterStatus === 'all' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange('active')}>
                  Active {filterStatus === 'active' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange('inactive')}>
                  Inactive {filterStatus === 'inactive' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange('closed')}>
                  Closed {filterStatus === 'closed' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange('draft')}>
                  Draft {filterStatus === 'draft' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange('needs-attention')}>
                  Needs Attention {filterStatus === 'needs-attention' && '✓'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredStreams.length === 0 ? (
          <EmptyState
            icon={<Plus className="h-12 w-12 text-muted-foreground" />}
            title="No streams found"
            description={
              filterStatus === 'all'
                ? 'Create your first payment stream to get started'
                : `No ${filterStatus} streams at the moment`
            }
            action={
              filterStatus === 'all'
                ? {
                    label: 'Create Stream',
                    onClick: () => console.log('Create stream'),
                  }
                : undefined
            }
          />
        ) : (
          <div className="space-y-2">
            {filteredStreams.map((stream) => (
              <button
                key={stream.id}
                onClick={() => onSelectStream(stream.id)}
                className={`w-full rounded-lg border p-4 text-left transition-colors ${
                  selectedStreamId === stream.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="truncate font-semibold">{stream.employeeName}</h3>
                      <Badge className={getStatusColor(stream.status)} variant="secondary">
                        {stream.status}
                      </Badge>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">{stream.employeeAddress}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Hourly Rate</p>
                        <p className="font-semibold">${stream.hourlyRate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Vault Balance</p>
                        <p className="font-semibold">${stream.vaultBalance}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Available</p>
                        <p className="font-semibold">${stream.availableToWithdraw}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Last Activity</p>
                        <p className="text-xs font-semibold">{stream.lastActivity}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
