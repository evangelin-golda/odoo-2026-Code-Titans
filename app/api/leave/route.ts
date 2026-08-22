import { NextRequest, NextResponse } from 'next/server';
import {
  getLeaveBalances,
  getEmployeeLeaves,
  applyForLeave,
  cancelLeaveRequest,
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId') || 'EMP-1001';

    const balances = getLeaveBalances(employeeId);
    const requests = getEmployeeLeaves(employeeId);

    // Summary counts
    const pendingCount = requests.filter(r => r.status === 'pending').length;
    const approvedCount = requests.filter(r => r.status === 'approved').length;
    const rejectedCount = requests.filter(r => r.status === 'rejected').length;

    return NextResponse.json({
      success: true,
      balances,
      requests,
      summary: {
        pendingCount,
        approvedCount,
        rejectedCount,
        totalRequests: requests.length,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
      isHalfDay,
      halfDayPeriod,
      emergencyContact,
    } = body;

    if (!employeeId || !leaveType || !startDate || !endDate || !reason) {
      return NextResponse.json(
        { error: 'All fields including leave type, dates, and reason are required.' },
        { status: 400 }
      );
    }

    const newRequest = applyForLeave(employeeId, {
      leaveType,
      startDate,
      endDate,
      reason,
      isHalfDay,
      halfDayPeriod,
      emergencyContact,
    });

    return NextResponse.json({
      success: true,
      message: 'Leave application submitted successfully!',
      leave: newRequest,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to submit leave.' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId');
    const leaveId = searchParams.get('leaveId');

    if (!employeeId || !leaveId) {
      return NextResponse.json(
        { error: 'Employee ID and Leave ID are required.' },
        { status: 400 }
      );
    }

    const cancelled = cancelLeaveRequest(employeeId, leaveId);
    return NextResponse.json({
      success: true,
      message: 'Leave request cancelled successfully.',
      leave: cancelled,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to cancel leave.' }, { status: 400 });
  }
}
