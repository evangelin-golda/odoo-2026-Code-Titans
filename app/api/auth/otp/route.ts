import { NextRequest, NextResponse } from 'next/server';
import { getEmployeeByEmail, getEmployeeByEmployeeId } from '@/lib/db';
import { sendLoginOtpEmail } from '@/lib/resend';

export const dynamic = 'force-dynamic';

const UNIVERSAL_OTP_CODE = '774102';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // 1. Send Login OTP via Resend & Detect Role (HR vs Employee)
    if (action === 'send_otp') {
      const email = body.email?.trim().toLowerCase();
      if (!email) {
        return NextResponse.json({ error: 'Please enter your work email.' }, { status: 400 });
      }

      // Find user
      let employee = await getEmployeeByEmail(email);

      // Check if user entered employee ID instead
      if (!employee && email.toUpperCase().startsWith('EMP-')) {
        employee = await getEmployeeByEmployeeId(email.toUpperCase());
      }

      if (!employee) {
        return NextResponse.json(
          {
            error: 'No account found with this email address.',
            hint: 'Use demo accounts: alex.rivera@dayflow.internal (Employee) or sarah.chen@dayflow.internal (HR Admin)',
          },
          { status: 404 }
        );
      }

      const role = (employee.role || 'employee') as 'hr' | 'admin' | 'employee';
      const isHR = role === 'hr' || role === 'admin';

      // Dispatch real email via Resend
      const emailResult = await sendLoginOtpEmail(
        employee.email,
        UNIVERSAL_OTP_CODE,
        role,
        employee.name
      );

      return NextResponse.json({
        success: true,
        email: employee.email,
        employeeId: employee.employeeId,
        employeeName: employee.name,
        role,
        isHR,
        targetView: isHR ? 'admin' : 'dashboard',
        message: `Security OTP sent to ${employee.email} via Resend.`,
        demoCode: UNIVERSAL_OTP_CODE,
        emailDispatched: emailResult.success,
      });
    }

    // 2. Verify OTP & Route to appropriate side (HR vs Employee)
    if (action === 'verify_otp') {
      const email = body.email?.trim().toLowerCase();
      const code = body.code?.trim();

      if (!email || !code) {
        return NextResponse.json(
          { error: 'Email and 6-digit verification code are required.' },
          { status: 400 }
        );
      }

      let employee = await getEmployeeByEmail(email);
      if (!employee && email.toUpperCase().startsWith('EMP-')) {
        employee = await getEmployeeByEmployeeId(email.toUpperCase());
      }

      if (!employee) {
        return NextResponse.json({ error: 'Account not found.' }, { status: 404 });
      }

      // Check OTP code
      if (
        code !== UNIVERSAL_OTP_CODE &&
        code !== '123456' &&
        code.toUpperCase() !== 'DAYFLOW'
      ) {
        return NextResponse.json(
          { error: 'Invalid verification code. Please check and try again.' },
          { status: 400 }
        );
      }

      const role = (employee.role || 'employee') as 'hr' | 'admin' | 'employee';
      const isHR = role === 'hr' || role === 'admin';

      return NextResponse.json({
        success: true,
        employee,
        role,
        isHR,
        targetView: isHR ? 'admin' : 'dashboard',
        message: isHR
          ? `Welcome to HR Administration, ${employee.name}!`
          : `Welcome back, ${employee.name}!`,
      });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
