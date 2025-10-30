'use client';

import { useEffect, useMemo, useState } from 'react';

import type { UiWalletAccount } from '@wallet-ui/react';
import { address, type Address } from 'gill';

import { useSolana } from '@/components/solana/use-solana';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetTokenAccountsQuery } from '@/features/account/data-access/use-get-token-accounts-query';
import { useCreateStreamMutation } from '@/features/cascade/data-access/use-create-stream-mutation';
import { AccountState } from '@/lib/enums';
import { ellipsify } from '@/lib/utils';

import { useDashboard } from '../dashboard-context';

type TokenAccountOption = {
  address: string;
  mint: string;
  decimals: number;
  rawAmount: bigint;
  uiAmount: number;
  uiAmountLabel: string;
};

interface CreateStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateStreamModal({ isOpen, onClose }: CreateStreamModalProps) {
  const { account } = useSolana();
  const { selectedEmployee, completeSetupStep, setAccountState } = useDashboard();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create payment stream</DialogTitle>
          <DialogDescription>
            Fund an escrow vault and start an hourly stream for your employee on-chain.
          </DialogDescription>
        </DialogHeader>

        {!account ? (
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Connect your employer treasury wallet to create a payment stream.
            </p>
          </div>
        ) : (
          <CreateStreamForm
            account={account}
            completeSetupStep={completeSetupStep}
            selectedEmployeeWallet={selectedEmployee?.primaryWallet ?? ''}
            selectedEmployeeName={selectedEmployee?.name ?? ''}
            setAccountState={setAccountState}
            onClose={onClose}
            isOpen={isOpen}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface CreateStreamFormProps {
  account: UiWalletAccount;
  selectedEmployeeWallet: string;
  selectedEmployeeName: string;
  completeSetupStep: (step: 'walletConnected' | 'tokenAccountFunded' | 'employeeAdded' | 'streamCreated') => void;
  setAccountState: (state: AccountState) => void;
  onClose: () => void;
  isOpen: boolean;
}

function CreateStreamForm({
  account,
  selectedEmployeeWallet,
  selectedEmployeeName,
  completeSetupStep,
  setAccountState,
  onClose,
  isOpen,
}: CreateStreamFormProps) {
  const [employeeAddress, setEmployeeAddress] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [initialDeposit, setInitialDeposit] = useState('');
  const [selectedTokenAccountAddress, setSelectedTokenAccountAddress] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const tokenAccountsQuery = useGetTokenAccountsQuery({
    address: account.address as Address,
    enabled: isOpen,
  });

  const tokenAccountOptions = useMemo<TokenAccountOption[]>(() => {
    const entries = tokenAccountsQuery.data as
      | Array<{
          pubkey?: string;
          account?: {
            data?: {
              parsed?: {
                info?: {
                  mint?: string;
                  tokenAmount?: {
                    amount?: string;
                    decimals?: number;
                    uiAmount?: number | null;
                    uiAmountString?: string;
                  };
                };
              };
            };
          };
        }>
      | undefined;

    if (!entries) return [];

    return entries
      .map((entry) => {
        const pubkey = entry?.pubkey;
        const info = entry?.account?.data?.parsed?.info;
        const mint = info?.mint;
        const tokenAmount = info?.tokenAmount;
        if (!pubkey || !mint || !tokenAmount?.amount) return null;

        let rawAmount: bigint;
        try {
          rawAmount = BigInt(tokenAmount.amount);
        } catch {
          return null;
        }

        const decimals = tokenAmount.decimals ?? 0;
        const uiAmountString =
          tokenAmount.uiAmountString ?? (tokenAmount.uiAmount != null ? tokenAmount.uiAmount.toString() : undefined);
        const fallbackLabel = formatBalance(rawAmount, decimals);
        const parsedUiAmount = uiAmountString ? Number.parseFloat(uiAmountString) : Number.parseFloat(fallbackLabel);

        return {
          address: pubkey,
          mint,
          decimals,
          rawAmount,
          uiAmount: Number.isFinite(parsedUiAmount) ? parsedUiAmount : 0,
          uiAmountLabel: uiAmountString ?? fallbackLabel,
        } satisfies TokenAccountOption;
      })
      .filter((option): option is TokenAccountOption => option !== null)
      .sort((a, b) => b.uiAmount - a.uiAmount);
  }, [tokenAccountsQuery.data]);

  const selectedTokenAccount = useMemo(
    () => tokenAccountOptions.find((option) => option.address === selectedTokenAccountAddress) ?? null,
    [tokenAccountOptions, selectedTokenAccountAddress],
  );

  useEffect(() => {
    if (isOpen) {
      setEmployeeAddress(selectedEmployeeWallet);
      setFormError(null);
    } else {
      setEmployeeAddress('');
      setHourlyRate('');
      setInitialDeposit('');
      setSelectedTokenAccountAddress('');
      setFormError(null);
    }
  }, [isOpen, selectedEmployeeWallet]);

  useEffect(() => {
    if (!tokenAccountOptions.length) {
      setSelectedTokenAccountAddress('');
      return;
    }
    setSelectedTokenAccountAddress((current) => {
      if (current && tokenAccountOptions.some((option) => option.address === current)) {
        return current;
      }
      return tokenAccountOptions[0]?.address ?? '';
    });
  }, [tokenAccountOptions]);

  const decimals = selectedTokenAccount?.decimals ?? 0;

  const hourlyRateBase = useMemo(
    () => (decimals >= 0 ? toBaseUnits(hourlyRate, decimals) : null),
    [hourlyRate, decimals],
  );
  const totalDepositBase = useMemo(
    () => (decimals >= 0 ? toBaseUnits(initialDeposit, decimals) : null),
    [initialDeposit, decimals],
  );

  const insufficientBalance =
    selectedTokenAccount != null &&
    totalDepositBase != null &&
    totalDepositBase > 0n &&
    totalDepositBase > selectedTokenAccount.rawAmount;

  const runwayHours =
    hourlyRateBase != null && hourlyRateBase > 0n && totalDepositBase != null
      ? Number(totalDepositBase / hourlyRateBase)
      : null;
  const runwayDays = runwayHours != null ? runwayHours / 24 : null;

  const createStreamMutation = useCreateStreamMutation({ account });
  const isSubmitting = createStreamMutation.isPending;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!selectedTokenAccount) {
      setFormError('Select a payroll token account to fund the stream.');
      return;
    }

    let employeeAddressKey: Address;
    try {
      employeeAddressKey = address(employeeAddress.trim());
    } catch {
      setFormError('Enter a valid employee wallet address.');
      return;
    }

    if (!hourlyRateBase || hourlyRateBase <= 0n) {
      setFormError('Enter a valid hourly rate greater than zero.');
      return;
    }

    if (!totalDepositBase || totalDepositBase <= 0n) {
      setFormError('Enter a valid initial deposit greater than zero.');
      return;
    }

    if (insufficientBalance) {
      setFormError('Initial deposit exceeds the balance of the selected token account.');
      return;
    }

    try {
      await createStreamMutation.mutateAsync({
        employee: employeeAddressKey,
        mint: address(selectedTokenAccount.mint),
        employerTokenAccount: address(selectedTokenAccount.address),
        hourlyRate: hourlyRateBase,
        totalDeposit: totalDepositBase,
      });

      setAccountState(AccountState.FIRST_STREAM_CREATED);
      completeSetupStep('streamCreated');
      setEmployeeAddress(selectedEmployeeWallet);
      setHourlyRate('');
      setInitialDeposit('');
      setFormError(null);
      onClose();
    } catch (error) {
      console.error('Failed to create stream', error);
      if (error instanceof Error) {
        setFormError(error.message);
      } else if (typeof error === 'string') {
        setFormError(error);
      } else {
        setFormError('Failed to create stream. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <form className="space-y-6 pt-2" onSubmit={handleSubmit}>
      <section className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="employee-address">Employee wallet address</Label>
          {selectedEmployeeName ? <span className="text-xs text-muted-foreground">{selectedEmployeeName}</span> : null}
        </div>
        <Input
          id="employee-address"
          placeholder="Enter the employee's Solana address"
          value={employeeAddress}
          onChange={(event) => setEmployeeAddress(event.target.value)}
          autoComplete="off"
        />
      </section>

      <section className="space-y-2">
        <Label htmlFor="token-account">Payroll token account</Label>
        {tokenAccountsQuery.isLoading ? (
          <div className="h-9 w-full animate-pulse rounded-md border border-dashed border-border" />
        ) : tokenAccountOptions.length === 0 ? (
          <div className="rounded-md border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">
            No SPL token accounts detected for this wallet. Fund a token account before creating a stream.
          </div>
        ) : (
          <Select value={selectedTokenAccountAddress} onValueChange={setSelectedTokenAccountAddress}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a token account" />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {tokenAccountOptions.map((option) => (
                <SelectItem key={option.address} value={option.address}>
                  <div className="flex flex-col">
                    <span className="font-medium">{formatMintLabel(option.mint)}</span>
                    <span className="text-xs text-muted-foreground">
                      {option.uiAmountLabel} • {ellipsify(option.address, 4)}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {selectedTokenAccount ? (
          <p className="text-xs text-muted-foreground">
            Mint: {selectedTokenAccount.mint} · Balance: {selectedTokenAccount.uiAmountLabel}
          </p>
        ) : null}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="hourly-rate">Hourly rate ({decimals} decimals)</Label>
          <Input
            id="hourly-rate"
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            value={hourlyRate}
            onChange={(event) => setHourlyRate(event.target.value)}
            min="0"
            step="0.000001"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="initial-deposit">Initial deposit</Label>
          <Input
            id="initial-deposit"
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            value={initialDeposit}
            onChange={(event) => setInitialDeposit(event.target.value)}
            min="0"
            step="0.000001"
          />
        </div>
      </section>

      {runwayHours != null && Number.isFinite(runwayHours) ? (
        <div className="rounded-md border border-border bg-muted/30 px-4 py-3 text-sm">
          <p>
            Runway: <span className="font-medium">{runwayHours.toLocaleString()} hours</span>
            {runwayDays != null ? (
              <span className="ml-1 text-muted-foreground">(~{runwayDays.toFixed(1)} days)</span>
            ) : null}
          </p>
        </div>
      ) : null}

      {insufficientBalance ? (
        <div className="rounded-md border border-destructive/60 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Deposit exceeds the available balance in the selected token account.
        </div>
      ) : null}

      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

      <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            isSubmitting ||
            !employeeAddress ||
            !selectedTokenAccount ||
            !hourlyRate ||
            !initialDeposit ||
            insufficientBalance
          }
        >
          {isSubmitting ? 'Creating...' : 'Create stream'}
        </Button>
      </div>
    </form>
  );
}

function toBaseUnits(input: string, decimals: number): bigint | null {
  if (!input.trim()) return null;
  const sanitized = input.trim();
  if (!/^\d+(\.\d+)?$/.test(sanitized)) return null;
  const [wholePart, fractionalPart = ''] = sanitized.split('.');
  const normalizedWhole = wholePart.replace(/^0+(?=\d)/, '') || '0';
  const truncatedFraction = fractionalPart.slice(0, decimals);
  const paddedFraction = truncatedFraction.padEnd(decimals, '0');
  const combined = `${normalizedWhole}${paddedFraction}`;
  try {
    return BigInt(combined);
  } catch {
    return null;
  }
}

function formatMintLabel(mint: string) {
  switch (mint) {
    case 'So11111111111111111111111111111111111111112':
      return 'wSOL';
    default:
      return ellipsify(mint, 4);
  }
}

function formatBalance(rawAmount: bigint, decimals: number) {
  const rawString = rawAmount.toString();
  if (decimals === 0) {
    return rawString;
  }

  const padded = rawString.padStart(decimals + 1, '0');
  const whole = padded.slice(0, -decimals) || '0';
  const fraction = padded.slice(-decimals).replace(/0+$/, '');
  return fraction ? `${whole}.${fraction}` : whole;
}
