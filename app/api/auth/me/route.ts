import { NextRequest, NextResponse } from 'next/server';
import { getEmployeeByEmployeeId } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const empId = searchParams.get('employeeId') || 'EMP-1001';

    const employee = await getEmployeeByEmployeeId(empId);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, employee });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
