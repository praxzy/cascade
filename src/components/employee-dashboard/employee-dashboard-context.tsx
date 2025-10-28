'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

interface EmployeeDashboardContextType {
  selectedStreamId: string | null;
  setSelectedStreamId: (id: string | null) => void;
  isWithdrawing: boolean;
  setIsWithdrawing: (value: boolean) => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const EmployeeDashboardContext = createContext<EmployeeDashboardContextType | undefined>(undefined);

export function EmployeeDashboardProvider({ children }: { children: ReactNode }) {
  const [selectedStreamId, setSelectedStreamId] = useState<string | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <EmployeeDashboardContext.Provider
      value={{
        selectedStreamId,
        setSelectedStreamId,
        isWithdrawing,
        setIsWithdrawing,
        refreshTrigger,
        triggerRefresh,
      }}
    >
      {children}
    </EmployeeDashboardContext.Provider>
  );
}

export function useEmployeeDashboard() {
  const context = useContext(EmployeeDashboardContext);
  if (!context) {
    throw new Error('useEmployeeDashboard must be used within EmployeeDashboardProvider');
  }
  return context;
}
