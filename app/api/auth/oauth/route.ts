import { NextRequest, NextResponse } from 'next/server';
import { getEmployeeByEmail, registerNewEmployee } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider, email, name, avatarUrl, rolePreference } = body;

    if (!email) {
      return NextResponse.json({ error: 'OAuth email address is required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name || cleanEmail.split('@')[0] || 'User').trim();

    // Check if user already exists
    let employee = await getEmployeeByEmail(cleanEmail);

    if (!employee) {
      // Auto-provision new employee profile from OAuth data
      const isHRAccount =
        cleanEmail.includes('bharani') ||
        cleanEmail.includes('admin') ||
        cleanEmail.includes('hr') ||
        rolePreference === 'hr';

      employee = await registerNewEmployee({
        name: cleanName,
        email: cleanEmail,
        phone: '+1 (555) 000-0000',
        department: isHRAccount ? 'HR & People Operations' : 'Engineering',
        jobPosition: isHRAccount ? 'Lead HR & Administrator' : 'Software Engineer',
        workMode: 'hybrid',
        role: isHRAccount ? 'admin' : 'employee',
      });

      if (avatarUrl) {
        employee.avatarUrl = avatarUrl;
      }
    }

    const role = employee.role || 'employee';
    const isHR = role === 'hr' || role === 'admin';

    return NextResponse.json({
      success: true,
      message: `Signed in successfully with ${provider === 'github' ? 'GitHub' : 'Google'} as ${employee.name}`,
      provider: provider || 'google',
      employee,
      role,
      isHR,
      targetView: isHR ? 'admin' : 'dashboard',
      sessionToken: `oauth_${provider}_${employee.employeeId}_${Date.now()}`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'OAuth authentication failed.' }, { status: 500 });
  }
}
