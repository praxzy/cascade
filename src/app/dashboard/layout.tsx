'use client';

import { ReactNode } from 'react';

import { DashboardProvider } from '@/components/dashboard/dashboard-context';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { EmployeeDashboardProvider } from '@/components/employee-dashboard/employee-dashboard-context';
import { EmployeeDashboardLayout } from '@/components/employee-dashboard/employee-dashboard-layout';

// TODO: Implement actual role detection
function getUserRole(): 'employer' | 'employee' {
  return 'employee';
}

export default function DashboardLayoutWrapper({
  children,
  employer,
  employee,
}: {
  children: ReactNode;
  employer: ReactNode;
  employee: ReactNode;
}) {
  const role = getUserRole();

  if (role === 'employee') {
    return (
      <EmployeeDashboardProvider>
        <EmployeeDashboardLayout>{employee || children}</EmployeeDashboardLayout>
      </EmployeeDashboardProvider>
    );
  }

  return (
    <DashboardProvider>
      <DashboardLayout>{employer || children}</DashboardLayout>
    </DashboardProvider>
  );
}
