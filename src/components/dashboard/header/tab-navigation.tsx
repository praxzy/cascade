'use client';

import { BarChart3, Settings, Users, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'streams', label: 'Streams', icon: Zap },
  { id: 'employees', label: 'Employees', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex gap-1">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        return (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            size={isMobile ? 'icon' : 'sm'}
            onClick={() => onTabChange(tab.id)}
            className="gap-2"
          >
            <Icon className="h-4 w-4" />
            {!isMobile && <span>{tab.label}</span>}
          </Button>
        );
      })}
    </div>
  );
}
