'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEmployee } from '@/context/EmployeeContext';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  const { employee, isLoading } = useEmployee();

  useEffect(() => {
    // If user is already authenticated, redirect to workspace dashboard
    if (employee && !isLoading) {
      router.push('/');
    }
  }, [employee, isLoading, router]);

  const handleLoginSuccess = () => {
    router.push('/');
  };

  return (
    <AuthLayout
      title="Welcome Back to Dayflow"
      subtitle="Sign in with your work email or employee ID to access your workspace."
      activeTab="login"
    >
      <LoginForm
        onSuccess={handleLoginSuccess}
        onSwitchToSignup={() => router.push('/signup')}
      />
    </AuthLayout>
  );
}
