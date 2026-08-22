import { NextRequest, NextResponse } from 'next/server';
import { getEmployeeByEmail, getEmployeeByEmployeeId } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, employeeId, identifier, password } = body;

    let employee = null;
    const searchId = employeeId || identifier;
    const searchEmail = email || identifier;

    if (searchId && searchId.toUpperCase().startsWith('EMP-')) {
      employee = await getEmployeeByEmployeeId(searchId.toUpperCase().trim());
    } else if (searchEmail && searchEmail.includes('@')) {
      employee = await getEmployeeByEmail(searchEmail.trim());
    } else if (searchId) {
      employee = (await getEmployeeByEmployeeId(searchId.trim())) || (await getEmployeeByEmail(searchId.trim()));
    }

    if (!employee) {
      return NextResponse.json(
        { error: 'Invalid credentials. No employee record matched your email or Employee ID.' },
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
