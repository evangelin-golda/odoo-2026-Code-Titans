'use client';

import React from 'react';
import { ToastProvider } from '@/components/ui/Toast';
import { EmployeeProvider } from '@/context/EmployeeContext';
import { AppShell } from '@/components/layout/AppShell';

export default function HomePage() {
  return (
    <ToastProvider>
      <EmployeeProvider>
        <AppShell />
      </EmployeeProvider>
    </ToastProvider>
  );
}
