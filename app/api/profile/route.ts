import { NextRequest, NextResponse } from 'next/server';
import { getEmployeeByEmployeeId, updateEmployeeProfile } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const empId = searchParams.get('employeeId') || 'EMP-1001';

    const employee = getEmployeeByEmployeeId(empId);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile: employee });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { employeeId, phone, address, bio, emergencyContact, avatarUrl } = body;

    if (!employeeId) {
      return NextResponse.json({ error: 'Employee ID is required.' }, { status: 400 });
    }

    // Attempting to send restricted fields will be safely ignored or filtered
    const updated = updateEmployeeProfile(employeeId, {
      phone,
      address,
      bio,
      emergencyContact,
      avatarUrl,
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully!',
      profile: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Profile update failed.' }, { status: 400 });
  }
}
