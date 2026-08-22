import { NextRequest, NextResponse } from 'next/server';
import {
  getAdminOverview,
  getAllEmployees,
  getAllLeaves,
  adminApproveLeave,
  adminRejectLeave,
  registerNewEmployee,
  getEmployeeByEmail,
} from '@/lib/db';
import { sendAdminVerificationEmail, sendLeaveDecisionEmail } from '@/lib/resend';

export const dynamic = 'force-dynamic';

// List of pre-authorized HR & Admin emails
const AUTHORIZED_HR_ADMIN_EMAILS = [
  'sarah.chen@dayflow.internal',
  'marcus.vance@dayflow.internal',
  'admin@dayflow.internal',
  'hr@dayflow.internal',
];

// Universal demo OTP verification passcode
const DEMO_OTP_CODE = '774102';

export async function GET(req: NextRequest) {
  try {
    const overview = await getAdminOverview();
    return NextResponse.json({
      success: true,
      overview,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // 1. Send OTP / Email Verification Challenge via Resend
    if (action === 'send_verification_code') {
      const email = body.email?.trim().toLowerCase();
      if (!email) {
        return NextResponse.json({ error: 'Please provide your HR/Admin email.' }, { status: 400 });
      }

      // Check if user exists or is in authorized list
      const employee = await getEmployeeByEmail(email);
      const isAuthorizedRole = employee?.role === 'hr' || employee?.role === 'admin';
      const isAuthorizedList = AUTHORIZED_HR_ADMIN_EMAILS.includes(email);

      if (!isAuthorizedRole && !isAuthorizedList) {
        return NextResponse.json(
          {
            error: 'Access Denied. This email is not registered with HR or Administrator privileges.',
            hint: 'Use demo HR email: sarah.chen@dayflow.internal or marcus.vance@dayflow.internal',
          },
          { status: 403 }
        );
      }

      // Dispatch real email via Resend
      const emailResult = await sendAdminVerificationEmail(email, DEMO_OTP_CODE);

      return NextResponse.json({
        success: true,
        message: `A 6-digit security authorization code has been dispatched via Resend to ${email}.`,
        demoCode: DEMO_OTP_CODE,
        emailDispatched: emailResult.success,
        emailId: emailResult.id,
      });
    }

    // 2. Verify Email OTP Code
    if (action === 'verify_email') {
      const email = body.email?.trim().toLowerCase();
      const code = body.code?.trim();

      if (!email || !code) {
        return NextResponse.json(
          { error: 'Email and 6-digit verification code are required.' },
          { status: 400 }
        );
      }

      const employee = await getEmployeeByEmail(email);
      const isAuthorizedRole = employee?.role === 'hr' || employee?.role === 'admin';
      const isAuthorizedList = AUTHORIZED_HR_ADMIN_EMAILS.includes(email);

      if (!isAuthorizedRole && !isAuthorizedList) {
        return NextResponse.json(
          { error: 'Unauthorized email address for HR Administration.' },
          { status: 403 }
        );
      }

      // Check OTP code (Matches DEMO_OTP_CODE or '123456' or 'DAYFLOW')
      if (code !== DEMO_OTP_CODE && code !== '123456' && code.toUpperCase() !== 'DAYFLOW') {
        return NextResponse.json(
          { error: 'Invalid or expired verification code. Please check and try again.' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Security authorization confirmed. Welcome to the HR & Admin Portal.',
        adminEmail: email,
        adminUser: employee || {
          name: 'Sarah Chen',
          email,
          role: 'hr',
          jobPosition: 'HR Partner',
        },
        sessionToken: `adm_sess_${Date.now()}`,
      });
    }

    // 3. Approve Leave Request + Notify via Resend
    if (action === 'approve_leave') {
      const { leaveId, adminName, comments } = body;
      if (!leaveId) {
        return NextResponse.json({ error: 'Leave ID is required.' }, { status: 400 });
      }
      const updated = await adminApproveLeave(leaveId, adminName || 'HR Admin', comments);

      // Send decision email to employee if email is available
      if (updated.employeeId) {
        const emp = await getEmployeeByEmail(updated.employeeId) || await getEmployeeByEmail(`${updated.employeeId.toLowerCase()}@dayflow.internal`);
        if (emp?.email) {
          sendLeaveDecisionEmail(emp.email, updated.employeeName, updated.leaveType, 'approved', {
            startDate: updated.startDate,
            endDate: updated.endDate,
            daysCount: updated.daysCount,
          }, comments);
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Leave request approved successfully!',
        leave: updated,
      });
    }

    // 4. Reject Leave Request + Notify via Resend
    if (action === 'reject_leave') {
      const { leaveId, adminName, comments } = body;
      if (!leaveId) {
        return NextResponse.json({ error: 'Leave ID is required.' }, { status: 400 });
      }
      const updated = await adminRejectLeave(leaveId, adminName || 'HR Admin', comments);

      // Send decision email to employee
      if (updated.employeeId) {
        const emp = await getEmployeeByEmail(updated.employeeId) || await getEmployeeByEmail(`${updated.employeeId.toLowerCase()}@dayflow.internal`);
        if (emp?.email) {
          sendLeaveDecisionEmail(emp.email, updated.employeeName, updated.leaveType, 'rejected', {
            startDate: updated.startDate,
            endDate: updated.endDate,
            daysCount: updated.daysCount,
          }, comments);
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Leave request rejected.',
        leave: updated,
      });
    }

    // 5. Add New Employee to Roster
    if (action === 'add_employee') {
      const { name, email, phone, department, jobPosition, workMode, workLocation } = body;
      if (!name || !email) {
        return NextResponse.json({ error: 'Name and Email are required.' }, { status: 400 });
      }
      const newEmp = await registerNewEmployee({
        name,
        email,
        phone,
        department,
        jobPosition,
        workMode,
        workLocation,
      });
      return NextResponse.json({
        success: true,
        message: `Employee ${newEmp.name} (${newEmp.employeeId}) added successfully!`,
        employee: newEmp,
      });
    }

    return NextResponse.json({ error: 'Invalid admin action.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
