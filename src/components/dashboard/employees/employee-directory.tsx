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

interface Employee {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  department: string;
  location: string;
  employmentType: string;
  status: 'ready' | 'draft' | 'invited' | 'archived';
  hourlyWage: number;
  linkedStreams: number;
}

// Mock data
const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    walletAddress: '7xL...abc',
    department: 'Engineering',
    location: 'San Francisco, CA',
    employmentType: 'Full-time',
    status: 'ready',
    hourlyWage: 50,
    linkedStreams: 1,
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    walletAddress: '7xL...def',
    department: 'Design',
    location: 'New York, NY',
    employmentType: 'Full-time',
    status: 'ready',
    hourlyWage: 45,
    linkedStreams: 1,
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@example.com',
    walletAddress: '',
    department: 'Marketing',
    location: 'Austin, TX',
    employmentType: 'Part-time',
    status: 'draft',
    hourlyWage: 35,
    linkedStreams: 0,
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david@example.com',
    walletAddress: '7xL...jkl',
    department: 'Sales',
    location: 'Chicago, IL',
    employmentType: 'Full-time',
    status: 'invited',
    hourlyWage: 40,
    linkedStreams: 0,
  },
];

interface EmployeeDirectoryProps {
  filterStatus: 'all' | 'ready' | 'draft' | 'invited' | 'archived';
  onFilterChange: (status: 'all' | 'ready' | 'draft' | 'invited' | 'archived') => void;
  onSelectEmployee: (employeeId: string) => void;
  selectedEmployeeId: string | null;
}

export function EmployeeDirectory({
  filterStatus,
  onFilterChange,
  onSelectEmployee,
  selectedEmployeeId,
}: EmployeeDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = MOCK_EMPLOYEES.filter((employee) => {
    // Filter by status
    if (filterStatus !== 'all' && employee.status !== filterStatus) return false;

    // Filter by search
    if (
      searchQuery &&
      !employee.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !employee.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !employee.walletAddress.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-500/10 text-green-700';
      case 'draft':
        return 'bg-yellow-500/10 text-yellow-700';
      case 'invited':
        return 'bg-blue-500/10 text-blue-700';
      case 'archived':
        return 'bg-gray-500/10 text-gray-700';
      default:
        return 'bg-gray-500/10 text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle>Employee Directory</CardTitle>
          <div className="flex gap-2">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
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
                  All {filterStatus === 'all' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange('ready')}>
                  Ready {filterStatus === 'ready' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange('draft')}>
                  Draft {filterStatus === 'draft' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange('invited')}>
                  Invited {filterStatus === 'invited' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange('archived')}>
                  Archived {filterStatus === 'archived' && '✓'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredEmployees.length === 0 ? (
          <EmptyState
            icon={<Plus className="h-12 w-12 text-muted-foreground" />}
            title="No employees found"
            description={
              filterStatus === 'all'
                ? 'Invite your first employee to get started'
                : `No ${filterStatus} employees at the moment`
            }
            action={
              filterStatus === 'all'
                ? {
                    label: 'Invite Employee',
                    onClick: () => console.log('Invite employee'),
                  }
                : undefined
            }
          />
        ) : (
          <div className="space-y-2">
            {filteredEmployees.map((employee) => (
              <button
                key={employee.id}
                onClick={() => onSelectEmployee(employee.id)}
                className={`w-full rounded-lg border p-4 text-left transition-colors ${
                  selectedEmployeeId === employee.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="truncate font-semibold">{employee.name}</h3>
                      <Badge className={getStatusColor(employee.status)} variant="secondary">
                        {employee.status}
                      </Badge>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">{employee.email}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Department</p>
                        <p className="font-medium">{employee.department}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="font-medium">{employee.location}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Hourly Wage</p>
                        <p className="font-medium">${employee.hourlyWage}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Linked Streams</p>
                        <p className="font-medium">{employee.linkedStreams}</p>
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
