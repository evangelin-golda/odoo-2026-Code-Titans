import { NextRequest, NextResponse } from 'next/server';
import {
  getEmployeeAttendance,
  getTodayAttendanceRecord,
  recordCheckIn,
  recordCheckOut,
} from '@/lib/db';
import { WorkMode } from '@/types/hrms';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId') || 'EMP-1001';
    const month = searchParams.get('month') || undefined;
    const status = searchParams.get('status') || undefined;

    const records = getEmployeeAttendance(employeeId, { month, status });
    const today = getTodayAttendanceRecord(employeeId);

    // Calculate quick stats
    const totalPresent = records.filter(r => r.status === 'present' || r.status === 'late').length;
    const totalMinutes = records.reduce((acc, r) => acc + (r.durationMinutes || 0), 0);
    const avgMinutes = totalPresent > 0 ? Math.round(totalMinutes / totalPresent) : 0;
    const onTimeCount = records.filter(r => r.isOnTime).length;
    const onTimePercentage = totalPresent > 0 ? Math.round((onTimeCount / totalPresent) * 100) : 100;

    return NextResponse.json({
      success: true,
      records,
      today,
      stats: {
        totalDays: records.length,
        totalPresent,
        totalHours: (totalMinutes / 60).toFixed(1),
        avgDailyHours: (avgMinutes / 60).toFixed(1),
        onTimePercentage,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { employeeId, action, workMode, notes } = body;

    if (!employeeId) {
      return NextResponse.json({ error: 'Employee ID is required.' }, { status: 400 });
    }

    if (action === 'check_in') {
      const record = recordCheckIn(employeeId, (workMode as WorkMode) || 'office', notes);
      return NextResponse.json({
        success: true,
        message: 'Checked in successfully!',
        record,
      });
    } else if (action === 'check_out') {
      const record = recordCheckOut(employeeId, notes);
      return NextResponse.json({
        success: true,
        message: 'Checked out successfully!',
        record,
      });
    } else {
      return NextResponse.json({ error: 'Invalid action. Must be check_in or check_out.' }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Attendance action failed.' }, { status: 400 });
  }
}
