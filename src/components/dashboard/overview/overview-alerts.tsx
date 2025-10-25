'use client';

import type React from 'react';

import { BarChart3, Plus, Settings, Users, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  variant: 'default' | 'secondary' | 'outline';
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'create-stream',
    label: 'Create Stream',
    description: 'Set up a new payment stream',
    icon: <Plus className="h-4 w-4" />,
    variant: 'default',
  },
  {
    id: 'add-employee',
    label: 'Add Employee',
    description: 'Invite team member',
    icon: <Users className="h-4 w-4" />,
    variant: 'secondary',
  },
  {
    id: 'configure-token',
    label: 'Token Account',
    description: 'Manage token settings',
    icon: <Zap className="h-4 w-4" />,
    variant: 'outline',
  },
  {
    id: 'view-reports',
    label: 'View Reports',
    description: 'Check analytics & insights',
    icon: <BarChart3 className="h-4 w-4" />,
    variant: 'outline',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Configure preferences',
    icon: <Settings className="h-4 w-4" />,
    variant: 'outline',
  },
];

export function OverviewAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {QUICK_ACTIONS.map((action) => (
          <Button key={action.id} variant={action.variant} className="h-auto w-full justify-start gap-3 py-2.5">
            <div className="shrink-0">{action.icon}</div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">{action.label}</p>
              <p className="text-xs opacity-75">{action.description}</p>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
