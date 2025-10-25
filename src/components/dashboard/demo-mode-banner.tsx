'use client';

import { useEffect, useState } from 'react';

import { AlertCircle, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { isDemoModeEnabled, setDemoMode } from '@/lib/state-persistence';

export function DemoModeBanner() {
  const [showBanner, setShowBanner] = useState<boolean | null>(null);

  useEffect(() => {
    const enabled = isDemoModeEnabled();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowBanner((current) => (current === enabled ? current : enabled));
  }, []);

  if (!showBanner) return null;

  return (
    <div className="flex items-center justify-between border-b border-amber-200 bg-amber-50 px-6 py-3">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600" />
        <div>
          <p className="text-sm font-medium text-amber-900">Demo Mode Enabled</p>
          <p className="text-xs text-amber-700">
            You&apos;re viewing a demo with sample data. Use the state switcher to explore different account states.
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setDemoMode(false);
          setShowBanner(false);
        }}
        className="h-6 w-6"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
