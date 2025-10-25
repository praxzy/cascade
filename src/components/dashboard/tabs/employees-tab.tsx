'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useDashboard } from '../dashboard-context';
import { EmployeeDetailPanel } from '../employees/employee-detail-panel';
import { EmployeeDirectory } from '../employees/employee-directory';

type EmployeeFilterStatus = 'all' | 'ready' | 'draft' | 'invited' | 'archived';

interface EmployeesTabProps {
  filterState?: string;
}

const employeeStatusToPath: Record<EmployeeFilterStatus, string> = {
  all: '/dashboard/employees',
  ready: '/dashboard/employees',
  draft: '/dashboard/employees',
  invited: '/dashboard/employees/invitations',
  archived: '/dashboard/employees/archived',
};

const employeeStatusToPageKey: Record<EmployeeFilterStatus, string> = {
  all: 'directory',
  ready: 'directory',
  draft: 'directory',
  invited: 'invitations',
  archived: 'archived',
};

function deriveEmployeeStatus(pageKey?: string): EmployeeFilterStatus {
  switch (pageKey) {
    case 'invitations':
      return 'invited';
    case 'archived':
      return 'archived';
    default:
      return 'all';
  }
}

export function EmployeesTab({ filterState }: EmployeesTabProps) {
  const { setIsAddEmployeeModalOpen } = useDashboard();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticPageKey, setOptimisticPageKey] = useState(filterState);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  useEffect(() => {
    setOptimisticPageKey(filterState);
  }, [filterState]);

  const filterStatus = useMemo<EmployeeFilterStatus>(
    () => deriveEmployeeStatus(optimisticPageKey),
    [optimisticPageKey],
  );

  const handleFilterChange = (status: EmployeeFilterStatus) => {
    setSelectedEmployeeId(null);

    const nextPageKey = employeeStatusToPageKey[status];
    setOptimisticPageKey(nextPageKey);

    startTransition(() => {
      router.push(employeeStatusToPath[status]);
    });
  };

  return (
    <div className="space-y-6" aria-busy={isPending}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="text-muted-foreground">Manage your employee directory</p>
        </div>
        <Button onClick={() => setIsAddEmployeeModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Invite Employee
        </Button>
      </div>

      <div>
        <EmployeeDirectory
          filterStatus={filterStatus}
          onFilterChange={handleFilterChange}
          onSelectEmployee={setSelectedEmployeeId}
          selectedEmployeeId={selectedEmployeeId}
        />
      </div>

      {selectedEmployeeId && (
        <EmployeeDetailPanel
          employeeId={selectedEmployeeId}
          onClose={() => setSelectedEmployeeId(null)}
          isOpen={!!selectedEmployeeId}
        />
      )}
    </div>
  );
}
