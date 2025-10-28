import type { ReactNode } from 'react';

export default function EmployerSlotLayout({ children }: { children: ReactNode }) {
  // The slot layout just passes through children
  // The actual dashboard layout is handled by the parent layout.tsx
  return <>{children}</>;
}
