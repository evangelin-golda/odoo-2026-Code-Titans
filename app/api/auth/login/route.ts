import { NextRequest, NextResponse } from 'next/server';
import { getEmployeeByEmail, getEmployeeByEmployeeId } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, employeeId, password } = body;

    let employee = null;
    if (employeeId) {
      employee = getEmployeeByEmployeeId(employeeId);
    } else if (email) {
      employee = getEmployeeByEmail(email);
    }

    if (!employee) {
      return NextResponse.json(
        { error: 'Invalid credentials. No employee record matched.' },
        { status: 401 }
      );
    }

    // For demo hackathon purposes, authenticate employee
    // Return sanitized employee profile and session info
    return NextResponse.json({
      success: true,
      message: 'Login successful. Welcome back, ' + employee.name,
      employee,
      sessionToken: `sess_${employee.employeeId}_${Date.now()}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Authentication failed.' },
      { status: 500 }
    );
  }
}
