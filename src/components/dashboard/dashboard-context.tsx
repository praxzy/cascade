'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import { getAccountStateConfig } from '@/lib/config/account-states';
import { AccountState } from '@/lib/enums';
import {
  getSavedAccountState,
  isOnboardingWizardDismissed,
  saveAccountState,
  setDemoMode,
  setOnboardingWizardDismissed,
} from '@/lib/state-persistence';

interface DashboardContextType {
  selectedStreamId: string | null;
  setSelectedStreamId: (id: string | null) => void;
  isCreateStreamModalOpen: boolean;
  setIsCreateStreamModalOpen: (open: boolean) => void;
  isAddEmployeeModalOpen: boolean;
  setIsAddEmployeeModalOpen: (open: boolean) => void;
  isTopUpModalOpen: boolean;
  setIsTopUpModalOpen: (open: boolean) => void;
  isTopUpAccountModalOpen: boolean;
  setIsTopUpAccountModalOpen: (open: boolean) => void;
  isEmergencyWithdrawModalOpen: boolean;
  setIsEmergencyWithdrawModalOpen: (open: boolean) => void;
  isCloseStreamModalOpen: boolean;
  setIsCloseStreamModalOpen: (open: boolean) => void;
  isViewStreamsModalOpen: boolean;
  setIsViewStreamsModalOpen: (open: boolean) => void;
  isEditEmployeeModalOpen: boolean;
  setIsEditEmployeeModalOpen: (open: boolean) => void;
  isArchiveEmployeeModalOpen: boolean;
  setIsArchiveEmployeeModalOpen: (open: boolean) => void;
  selectedEmployeeId: string | null;
  setSelectedEmployeeId: (id: string | null) => void;
  accountState: AccountState;
  setAccountState: (state: AccountState) => void;
  isOnboardingWizardOpen: boolean;
  hasDismissedOnboarding: boolean;
  resumeOnboardingWizard: () => void;
  dismissOnboardingWizard: () => void;
  completeOnboardingWizard: () => void;
  resetAllModals: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [selectedStreamId, setSelectedStreamId] = useState<string | null>(null);
  const [isCreateStreamModalOpen, setIsCreateStreamModalOpen] = useState(false);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isTopUpAccountModalOpen, setIsTopUpAccountModalOpen] = useState(false);
  const [isEmergencyWithdrawModalOpen, setIsEmergencyWithdrawModalOpen] = useState(false);
  const [isCloseStreamModalOpen, setIsCloseStreamModalOpen] = useState(false);
  const [isViewStreamsModalOpen, setIsViewStreamsModalOpen] = useState(false);
  const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
  const [isArchiveEmployeeModalOpen, setIsArchiveEmployeeModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const [accountState, setAccountStateInternal] = useState<AccountState>(() => getSavedAccountState());
  const [hasDismissedOnboarding, setHasDismissedOnboarding] = useState<boolean>(() => isOnboardingWizardDismissed());
  const [isOnboardingWizardOpen, setIsOnboardingWizardOpen] = useState<boolean>(() => {
    const initialState = getSavedAccountState();
    const dismissed = isOnboardingWizardDismissed();
    const config = getAccountStateConfig(initialState);
    return config.showOnboarding && !dismissed;
  });

  useEffect(() => {
    setDemoMode(true);
  }, []);

  const setAccountState = (state: AccountState) => {
    setAccountStateInternal(state);
    saveAccountState(state);
    if (state === AccountState.NEW_ACCOUNT || state === AccountState.ONBOARDING) {
      setHasDismissedOnboarding(false);
      setOnboardingWizardDismissed(false);
      const config = getAccountStateConfig(state);
      if (config.showOnboarding) {
        setIsOnboardingWizardOpen(true);
      }
    } else {
      setIsOnboardingWizardOpen(false);
    }
  };

  const resumeOnboardingWizard = () => {
    setHasDismissedOnboarding(false);
    setOnboardingWizardDismissed(false);
    setIsOnboardingWizardOpen(true);
    if (accountState !== AccountState.ONBOARDING) {
      setAccountState(AccountState.ONBOARDING);
    }
  };

  const dismissOnboardingWizard = () => {
    setIsOnboardingWizardOpen(false);
    setHasDismissedOnboarding(true);
    setOnboardingWizardDismissed(true);
  };

  const completeOnboardingWizard = () => {
    setIsOnboardingWizardOpen(false);
    setHasDismissedOnboarding(false);
    setOnboardingWizardDismissed(false);
    setAccountState(AccountState.WALLET_CONNECTED);
  };

  const resetAllModals = () => {
    setIsCreateStreamModalOpen(false);
    setIsAddEmployeeModalOpen(false);
    setIsTopUpModalOpen(false);
    setIsTopUpAccountModalOpen(false);
    setIsEmergencyWithdrawModalOpen(false);
    setIsCloseStreamModalOpen(false);
    setIsViewStreamsModalOpen(false);
    setIsEditEmployeeModalOpen(false);
    setIsArchiveEmployeeModalOpen(false);
  };

  return (
    <DashboardContext.Provider
      value={{
        selectedStreamId,
        setSelectedStreamId,
        isCreateStreamModalOpen,
        setIsCreateStreamModalOpen,
        isAddEmployeeModalOpen,
        setIsAddEmployeeModalOpen,
        isTopUpModalOpen,
        setIsTopUpModalOpen,
        isTopUpAccountModalOpen,
        setIsTopUpAccountModalOpen,
        isEmergencyWithdrawModalOpen,
        setIsEmergencyWithdrawModalOpen,
        isCloseStreamModalOpen,
        setIsCloseStreamModalOpen,
        isViewStreamsModalOpen,
        setIsViewStreamsModalOpen,
        isEditEmployeeModalOpen,
        setIsEditEmployeeModalOpen,
        isArchiveEmployeeModalOpen,
        setIsArchiveEmployeeModalOpen,
        selectedEmployeeId,
        setSelectedEmployeeId,
        accountState,
        setAccountState,
        isOnboardingWizardOpen,
        hasDismissedOnboarding,
        resumeOnboardingWizard,
        dismissOnboardingWizard,
        completeOnboardingWizard,
        resetAllModals,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}
