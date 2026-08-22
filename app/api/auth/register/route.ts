import { NextRequest, NextResponse } from 'next/server';
import { registerNewEmployee } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, department, jobPosition, workMode, password } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Full name and work email are required.' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Securely register strictly as Employee
    const newEmployee = await registerNewEmployee({
      name,
      email,
      phone,
      department,
      jobPosition,
      workMode,
      password,
    });

    return NextResponse.json({
      success: true,
      message: `Account created successfully! Your Employee ID is ${newEmployee.employeeId}`,
      employee: newEmployee,
      sessionToken: `sess_${newEmployee.employeeId}_${Date.now()}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Registration failed.' },
      { status: 400 }
    );
  }
}
