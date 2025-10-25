'use client';

import { Check } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  step: number;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'wallet',
    title: 'Connect employer wallet',
    description: 'Verify your Solana wallet is connected and funded',
    completed: true,
    step: 1,
  },
  {
    id: 'token-account',
    title: 'Verify token account funded',
    description: 'Ensure your token account has sufficient balance',
    completed: false,
    step: 2,
  },
  {
    id: 'employee',
    title: 'Add first employee profile',
    description: 'Create an employee record with wallet address',
    completed: false,
    step: 3,
  },
  {
    id: 'stream',
    title: 'Create payment stream',
    description: 'Set up your first hourly payment stream',
    completed: false,
    step: 4,
  },
];

export function OverviewChecklist() {
  const completedCount = CHECKLIST_ITEMS.filter((item) => item.completed).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Setup Checklist</CardTitle>
          <Badge variant="secondary">
            {completedCount}/{CHECKLIST_ITEMS.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {CHECKLIST_ITEMS.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="mt-1 shrink-0">
                {item.completed ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-muted-foreground text-xs font-semibold text-muted-foreground">
                    {item.step}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${item.completed ? 'text-muted-foreground line-through' : ''}`}>
                  {item.title}
                </p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
