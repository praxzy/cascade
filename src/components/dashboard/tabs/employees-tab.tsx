'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { PiggyBank, Plus, UserPlus, Wallet } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { EmployeeSummary } from '@/types/employee';

import { useDashboard } from '../dashboard-context';
import { EmployeeDetailPanel } from '../employees/employee-detail-panel';
import { EmployeeDirectory } from '../employees/employee-directory';
import { EmptyState } from '../empty-state';

type EmployeeFilterStatus = 'all' | 'ready' | 'draft' | 'invited' | 'archived';

interface EmployeesTabProps {
  filterState?: string;
  employees: EmployeeSummary[];
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

export function EmployeesTab({ filterState, employees }: EmployeesTabProps) {
  const {
    setIsAddEmployeeModalOpen,
    setupProgress,
    setIsTopUpAccountModalOpen,
    setSelectedEmployee,
    setSelectedEmployeeId: setDashboardSelectedEmployeeId,
  } = useDashboard();
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
    setDashboardSelectedEmployeeId(null);
    setSelectedEmployee(null);

    const nextPageKey = employeeStatusToPageKey[status];
    setOptimisticPageKey(nextPageKey);

    startTransition(() => {
      router.push(employeeStatusToPath[status]);
    });
  };

  const hasEmployees = useMemo(() => employees.length > 0, [employees]);
  const needsFundingPrompt = setupProgress.walletConnected && !setupProgress.tokenAccountFunded;
  const selectedEmployee = useMemo(
    () => employees.find((employee) => employee.id === selectedEmployeeId) ?? null,
    [employees, selectedEmployeeId],
  );

  useEffect(() => {
    if (!selectedEmployee) {
      setDashboardSelectedEmployeeId(null);
      setSelectedEmployee(null);
      return;
    }
    setDashboardSelectedEmployeeId(selectedEmployee.id);
    setSelectedEmployee(selectedEmployee);
  }, [selectedEmployee, setDashboardSelectedEmployeeId, setSelectedEmployee]);

  const handleSelectEmployee = (employee: EmployeeSummary) => {
    setSelectedEmployeeId(employee.id);
    setDashboardSelectedEmployeeId(employee.id);
    setSelectedEmployee(employee);
  };

  const handleCloseDetail = () => {
    setSelectedEmployeeId(null);
    setDashboardSelectedEmployeeId(null);
    setSelectedEmployee(null);
  };

  return (
    <div className="space-y-6" aria-busy={isPending}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="text-muted-foreground">Manage your employee directory</p>
        </div>
        <Button
          onClick={() => setIsAddEmployeeModalOpen(true)}
          className="gap-2"
          disabled={!setupProgress.walletConnected}
        >
          <Plus className="h-4 w-4" />
          Invite Employee
        </Button>
      </div>

      {needsFundingPrompt ? (
        <div className="flex flex-col gap-3 rounded-lg border border-dashed border-amber-500/50 bg-amber-500/10 px-4 py-4 text-sm text-amber-700">
          <div className="flex items-start gap-3">
            <PiggyBank className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div className="space-y-1">
              <p className="font-medium text-amber-700">Optional: fund your payroll token account</p>
              <p className="text-xs text-amber-700/90">
                Top ups unlock automated payout summaries, but you can continue managing employees without funding.
              </p>
            </div>
          </div>
          <div>
            <Button size="sm" variant="outline" onClick={() => setIsTopUpAccountModalOpen(true)}>
              Top Up Account
            </Button>
          </div>
        </div>
      ) : null}

      {!setupProgress.walletConnected ? (
        <EmptyState
          icon={<Wallet className="h-12 w-12 text-muted-foreground" />}
          title="Connect your employer wallet"
          description="Link a treasury wallet before inviting or managing employees."
        />
      ) : !hasEmployees ? (
        <EmptyState
          icon={<UserPlus className="h-12 w-12 text-muted-foreground" />}
          title="Invite your first employee"
          description="Create a profile or send an invitation so you can spin up a stream."
          action={{
            label: 'Add Employee',
            onClick: () => setIsAddEmployeeModalOpen(true),
          }}
        />
      ) : (
        <div>
          <EmployeeDirectory
            filterStatus={filterStatus}
            onFilterChange={handleFilterChange}
            onSelectEmployee={handleSelectEmployee}
            selectedEmployeeId={selectedEmployeeId}
            employees={employees}
            onInviteEmployee={() => setIsAddEmployeeModalOpen(true)}
          />
        </div>
      )}

      {selectedEmployee && (
        <EmployeeDetailPanel employee={selectedEmployee} onClose={handleCloseDetail} isOpen={!!selectedEmployee} />
      )}
    </div>
  );
}
