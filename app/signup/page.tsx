'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEmployee } from '@/context/EmployeeContext';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
  const router = useRouter();
  const { employee, isLoading } = useEmployee();

  useEffect(() => {
    // If user is already authenticated, redirect to workspace dashboard
    if (employee && !isLoading) {
      router.push('/');
    }
  }, [employee, isLoading, router]);

  const handleSignupSuccess = () => {
    router.push('/');
  };

  return (
    <AuthLayout
      title="Create Your Employee Account"
      subtitle="Register your corporate profile to unlock attendance, time-off, and payroll tracking."
      activeTab="signup"
    >
      <SignupForm
        onSuccess={handleSignupSuccess}
        onSwitchToLogin={() => router.push('/login')}
      />
    </AuthLayout>
  );
}
