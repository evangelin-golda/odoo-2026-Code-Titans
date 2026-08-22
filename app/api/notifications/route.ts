import { NextRequest, NextResponse } from 'next/server';
import {
  getEmployeeNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId') || 'EMP-1001';

    const notifications = await getEmployeeNotifications(employeeId);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function handleUpdateNotifications(req: NextRequest) {
  try {
    const body = await req.json();
    const { employeeId, notificationId, markAll, markAllAsRead } = body;

    if (!employeeId) {
      return NextResponse.json({ error: 'Employee ID is required.' }, { status: 400 });
    }

    const shouldMarkAll = Boolean(markAll || markAllAsRead);

    if (shouldMarkAll) {
      await markAllNotificationsRead(employeeId);
      return NextResponse.json({ success: true, message: 'All notifications marked as read.' });
    }

    if (notificationId) {
      await markNotificationRead(employeeId, notificationId);
      return NextResponse.json({ success: true, message: 'Notification marked as read.' });
    }

    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  return handleUpdateNotifications(req);
}

export async function PUT(req: NextRequest) {
  return handleUpdateNotifications(req);
}
