'use client';

import { useMemo } from 'react';

import { CircleDollarSign, LineChart, Wallet } from 'lucide-react';

import { useSolana } from '@/components/solana/use-solana';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WalletDropdown } from '@/components/wallet-dropdown';

import { columns, Payment } from './columns';
import { DataTable } from './data-table';

export default function EmployeeHistoryPage() {
  const { account, connected } = useSolana();

  // Mock data - TODO: Fetch payment history from blockchain
  // Note: Employee works for one employer only
  const employerName = 'Acme Corp'; // This should come from blockchain/backend

  const allPayments: Payment[] = useMemo(
    () => [
      {
        id: '1',
        amount: 2400.0,
        employer: employerName,
        timestamp: new Date('2024-12-25T14:30:00'),
        txSignature: '4zKXtg2vJ8kxKFGH3qK9pL2mN5oP7rQ8sT9uV1wX2yZ3',
        status: 'completed' as const,
      },
      {
        id: '2',
        amount: 1800.5,
        employer: employerName,
        timestamp: new Date('2024-12-20T10:15:00'),
        txSignature: '5aLYuh3wK9lyLGHI4rL0qM3nO6pQ8sR9tU0vW2xY3zA4',
        status: 'completed' as const,
      },
      {
        id: '3',
        amount: 3200.25,
        employer: employerName,
        timestamp: new Date('2024-12-15T16:45:00'),
        txSignature: '6bMZvi4xL0mzMHIJ5sM1rN4oP7qR9tS0uV1wX3yZ4aB5',
        status: 'completed' as const,
      },
      {
        id: '4',
        amount: 1650.0,
        employer: employerName,
        timestamp: new Date('2024-11-28T09:20:00'),
        txSignature: '7cNAwj5yM1n0NIJk6tN2sO5pQ8rS0uT1vW2xY4zA5bC6',
        status: 'completed' as const,
      },
      {
        id: '5',
        amount: 2800.0,
        employer: employerName,
        timestamp: new Date('2024-11-15T13:00:00'),
        txSignature: '8dOBxk6zN2o1OJKl7uO3tP6qR9sT1vU2wX3yZ5aB6cD7',
        status: 'completed' as const,
      },
      {
        id: '6',
        amount: 950.75,
        employer: employerName,
        timestamp: new Date('2024-11-05T11:30:00'),
        txSignature: '9ePC1m7aO3p2PKLm8vP4uQ7rS0tU2wV3xY6zA7bC8dE9',
        status: 'completed' as const,
      },
      {
        id: '7',
        amount: 3600.0,
        employer: employerName,
        timestamp: new Date('2024-10-25T15:20:00'),
        txSignature: '1fQD2n8bP4q3QLNn9wQ5vR8sT1uV3xW4yZ7aB8cD9eF0',
        status: 'completed' as const,
      },
      {
        id: '8',
        amount: 2100.5,
        employer: employerName,
        timestamp: new Date('2024-10-12T10:00:00'),
        txSignature: '2gRE3o9cQ5r4RMOo0xR6wS9tU2vW4xX5yZ8aB9cD0eF1',
        status: 'completed' as const,
      },
      {
        id: '9',
        amount: 1275.25,
        employer: employerName,
        timestamp: new Date('2024-09-28T14:45:00'),
        txSignature: '3hSF4p0dR6s5SNPp1yS7xT0uV3wX5yY6zA9aB0cD1eF2',
        status: 'completed' as const,
      },
      {
        id: '10',
        amount: 4200.0,
        employer: employerName,
        timestamp: new Date('2024-09-15T09:30:00'),
        txSignature: '4iTG5q1eS7t6TOQq2zT8yU1vW4xY6zZ7aB0aC1cD2eF3',
        status: 'completed' as const,
      },
      {
        id: '11',
        amount: 1950.0,
        employer: employerName,
        timestamp: new Date('2024-08-28T11:15:00'),
        txSignature: '5jUH6r2fT8u7UPRr3AT9zV2wX5yZ8aB1aC2cD3eF4gG5',
        status: 'completed' as const,
      },
      {
        id: '12',
        amount: 3100.75,
        employer: employerName,
        timestamp: new Date('2024-08-15T14:20:00'),
        txSignature: '6kVI7s3gU9v8VQSs4BU0aW3xY6zA9aB2aC3cD4eF5gG6',
        status: 'completed' as const,
      },
      {
        id: '13',
        amount: 2250.5,
        employer: employerName,
        timestamp: new Date('2024-08-05T10:45:00'),
        txSignature: '7lWJ8t4hV0w9WRTt5CV1bX4yZ7aB0aC3cD5eF6gG7hH8',
        status: 'completed' as const,
      },
      {
        id: '14',
        amount: 1725.0,
        employer: employerName,
        timestamp: new Date('2024-07-20T16:30:00'),
        txSignature: '8mXK9u5iW1x0XSUu6DW2cY5zA8aB1aC4cD6eF7gG8hH9',
        status: 'completed' as const,
      },
      {
        id: '15',
        amount: 2900.25,
        employer: employerName,
        timestamp: new Date('2024-07-10T09:00:00'),
        txSignature: '9nYL0v6jX2y1YTVv7EX3dZ6aB9aC2cD5eF8gG9hH0iI1',
        status: 'completed' as const,
      },
    ],
    [],
  );

  const allTimeTotal = allPayments.reduce((sum, payment) => sum + payment.amount, 0);

  if (!connected || !account) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
              <p className="text-muted-foreground">Connect your wallet to view your payment history</p>
            </div>
            <WalletDropdown />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
        <p className="text-muted-foreground">View and manage your complete withdrawal history</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-2 text-xs font-medium sm:text-sm">
              <CircleDollarSign className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
              <span className="truncate">Total Withdrawn</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold sm:text-2xl">${allTimeTotal.toFixed(2)}</p>
            <p className="mt-1 text-xs text-muted-foreground">All-time withdrawals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-2 text-xs font-medium sm:text-sm">
              <Wallet className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
              <span className="truncate">Total Transactions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold sm:text-2xl">{allPayments.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Payment history</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-2 text-xs font-medium sm:text-sm">
              <LineChart className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
              <span className="truncate">Average Payment</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold sm:text-2xl">${(allTimeTotal / allPayments.length).toFixed(2)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={allPayments} />
      </Card>
    </div>
  );
}
