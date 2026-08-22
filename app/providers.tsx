'use client';

import React from 'react';
import { ToastProvider } from '@/components/ui/Toast';
import { EmployeeProvider } from '@/context/EmployeeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <EmployeeProvider>{children}</EmployeeProvider>
    </ToastProvider>
  );
}
