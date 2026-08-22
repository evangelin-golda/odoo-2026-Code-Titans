import { NextRequest, NextResponse } from 'next/server';
import { HR_POLICIES } from '@/lib/db';

export const dynamic = 'force-dynamic';

function getPolicyResponse(query: string) {
  const lowerQuery = query.toLowerCase();

  // Check matching policy
  const matches = HR_POLICIES.filter(policy =>
    policy.keywords.some(kw => lowerQuery.includes(kw)) ||
    policy.topic.toLowerCase().includes(lowerQuery)
  );

  if (matches.length > 0) {
    const topMatch = matches[0];
    return {
      success: true,
      topic: topMatch.topic,
      answer: topMatch.content,
      matched: true,
    };
  }

  // Default friendly assistant fallback
  return {
    success: true,
    topic: 'General Employee Guidance',
    answer: `Dayflow HR Policy Help:\n• For specific leave requests, navigate to the **Leave** tab and select 'Apply for Leave'.\n• For payslip queries, check the **Salary** section where detailed monthly slips and tax breakdowns are available.\n• For urgent requests, please contact your manager or write to hr-support@dayflow.internal.`,
    matched: false,
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || searchParams.get('query');

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query parameter (q) is required.' }, { status: 400 });
    }

    const result = getPolicyResponse(query);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body.query || body.q;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required.' }, { status: 400 });
    }

    const result = getPolicyResponse(query);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
