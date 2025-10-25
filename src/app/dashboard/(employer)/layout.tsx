import type { ReactNode } from 'react';

import { DashboardProvider } from '@/components/dashboard/dashboard-context';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

export default function DashboardSectionLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </DashboardProvider>
  );
}
