/**
 * Dayflow HRMS - End-to-End API Integration & Smoke Test Script
 * 
 * Usage:
 *   node scripts/test-api.mjs [baseUrl]
 * Default baseUrl: http://localhost:3000
 */

const BASE_URL = process.argv[2] || process.env.APP_URL || 'http://localhost:3000';

console.log(`\n======================================================`);
console.log(`  DAYFLOW HRMS - AUTOMATED API VERIFICATION SUITE`);
console.log(`  Target Base URL: ${BASE_URL}`);
console.log(`======================================================\n`);

let passedTests = 0;
let failedTests = 0;

async function testEndpoint(name, url, options = {}, validator = () => true) {
  process.stdout.write(`• Testing [${options.method || 'GET'}] ${name}... `);
  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });

    const contentType = res.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}: ${JSON.stringify(data)}`);
    }

    const isValid = validator(data, res);
    if (isValid !== true) {
      throw new Error(typeof isValid === 'string' ? isValid : 'Validation check failed');
    }

    console.log(`\x1b[32mPASSED\x1b[0m (Status: ${res.status})`);
    passedTests++;
    return data;
  } catch (err) {
    console.log(`\x1b[31mFAILED\x1b[0m`);
    console.error(`  Error: ${err.message}\n`);
    failedTests++;
    return null;
  }
}

async function runAllTests() {
  const testEmpId = 'EMP-1001';

  // 1. Auth Me endpoint
  await testEndpoint(
    'Auth / Me (Employee Lookup)',
    `/api/auth/me?employeeId=${testEmpId}`,
    { method: 'GET' },
    (data) => data.success === true && data.employee?.employeeId === testEmpId
  );

  // 2. Auth Login endpoint
  await testEndpoint(
    'Auth / Login (Switch Persona)',
    '/api/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ employeeId: 'EMP-1002' }),
    },
    (data) => data.success === true && data.employee?.name === 'Sarah Chen'
  );

  // 3. Auth Register endpoint
  const tempEmail = `test.user.${Date.now()}@dayflow.internal`;
  const registered = await testEndpoint(
    'Auth / Register (New Employee)',
    '/api/auth/register',
    {
      method: 'POST',
      body: JSON.stringify({
        name: 'Jordan Taylor',
        email: tempEmail,
        phone: '+1 (555) 321-9988',
        department: 'Quality Assurance',
        jobPosition: 'QA Automation Engineer',
      }),
    },
    (data) => data.success === true && !!data.employee?.employeeId
  );

  const registeredId = registered?.employee?.employeeId || testEmpId;

  // 4. Attendance GET
  await testEndpoint(
    'Attendance (Fetch Records & Stats)',
    `/api/attendance?employeeId=${testEmpId}`,
    { method: 'GET' },
    (data) => data.success === true && Array.isArray(data.records) && data.stats !== undefined
  );

  // 5. Attendance Check-In POST (using newly registered user to avoid duplicate check-in error)
  await testEndpoint(
    'Attendance (Record Check-In)',
    '/api/attendance',
    {
      method: 'POST',
      body: JSON.stringify({
        employeeId: registeredId,
        action: 'check_in',
        workMode: 'remote',
        notes: 'Automated test remote punch',
      }),
    },
    (data) => data.success === true && data.record?.status !== undefined
  );

  // 6. Attendance Check-Out POST
  await testEndpoint(
    'Attendance (Record Check-Out)',
    '/api/attendance',
    {
      method: 'POST',
      body: JSON.stringify({
        employeeId: registeredId,
        action: 'check_out',
        notes: 'Automated test punch out',
      }),
    },
    (data) => data.success === true && !!data.record?.checkOut
  );

  // 7. Leave GET
  await testEndpoint(
    'Leave (Fetch Balances & Requests)',
    `/api/leave?employeeId=${testEmpId}`,
    { method: 'GET' },
    (data) => data.success === true && Array.isArray(data.balances) && Array.isArray(data.requests)
  );

  // 8. Leave POST (Apply for Casual Leave)
  const appliedLeave = await testEndpoint(
    'Leave (Submit Leave Request)',
    '/api/leave',
    {
      method: 'POST',
      body: JSON.stringify({
        employeeId: testEmpId,
        leaveType: 'casual',
        startDate: '2026-11-10',
        endDate: '2026-11-10',
        reason: 'Automated test leave application',
      }),
    },
    (data) => data.success === true && data.leave?.status === 'pending'
  );

  // 9. Leave DELETE (Cancel Leave Request)
  if (appliedLeave?.leave?.id) {
    await testEndpoint(
      'Leave (Cancel Leave Request)',
      `/api/leave?employeeId=${testEmpId}&leaveId=${appliedLeave.leave.id}`,
      { method: 'DELETE' },
      (data) => data.success === true && data.leave?.status === 'cancelled'
    );
  }

  // 10. Salary GET
  await testEndpoint(
    'Salary (Fetch Structure & Payslips)',
    `/api/salary?employeeId=${testEmpId}`,
    { method: 'GET' },
    (data) => data.success === true && data.salaryStructure?.currency === 'USD' && Array.isArray(data.payslips)
  );

  // 11. Notifications GET
  await testEndpoint(
    'Notifications (Fetch Alerts & Unread Count)',
    `/api/notifications?employeeId=${testEmpId}`,
    { method: 'GET' },
    (data) => data.success === true && Array.isArray(data.notifications)
  );

  // 12. Notifications PATCH (Mark All as Read)
  await testEndpoint(
    'Notifications (Mark All As Read via PATCH)',
    '/api/notifications',
    {
      method: 'PATCH',
      body: JSON.stringify({
        employeeId: testEmpId,
        markAll: true,
      }),
    },
    (data) => data.success === true
  );

  // 13. Profile GET
  await testEndpoint(
    'Profile (Fetch Employee Details)',
    `/api/profile?employeeId=${testEmpId}`,
    { method: 'GET' },
    (data) => data.success === true && data.profile?.employeeId === testEmpId
  );

  // 14. Profile PUT (Update Sandboxed Contact Fields)
  await testEndpoint(
    'Profile (Update Allowed Fields via PUT)',
    '/api/profile',
    {
      method: 'PUT',
      body: JSON.stringify({
        employeeId: testEmpId,
        phone: '+1 (555) 234-8901',
        bio: 'Senior Frontend Engineer passionate about design systems & HR tech.',
      }),
    },
    (data) => data.success === true && data.profile?.bio !== undefined
  );

  // 15. Reports GET
  await testEndpoint(
    'Reports (Fetch Personal Analytics)',
    `/api/reports?employeeId=${testEmpId}`,
    { method: 'GET' },
    (data) => data.success === true && data.report?.attendancePercentage !== undefined
  );

  // 16. Assistant GET
  await testEndpoint(
    'HR Assistant (Query Policies via GET)',
    '/api/assistant?q=leave%20policy',
    { method: 'GET' },
    (data) => data.success === true && typeof data.answer === 'string'
  );

  // 17. Assistant POST
  await testEndpoint(
    'HR Assistant (Query Policies via POST)',
    '/api/assistant',
    {
      method: 'POST',
      body: JSON.stringify({ query: 'What are the standard work hours?' }),
    },
    (data) => data.success === true && typeof data.answer === 'string'
  );

  console.log(`\n======================================================`);
  console.log(`  TEST RESULTS: ${passedTests} Passed, ${failedTests} Failed (Total: ${passedTests + failedTests})`);
  console.log(`======================================================\n`);

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
