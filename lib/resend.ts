import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const isResendConfigured = Boolean(resendApiKey && resendApiKey.startsWith('re_'));

/**
 * Send 6-Digit Security Verification OTP Email for Login (HR / Admin vs Employee)
 */
export async function sendLoginOtpEmail(
  toEmail: string,
  otpCode: string,
  role: 'hr' | 'admin' | 'employee' = 'employee',
  userName?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Dayflow HRMS <onboarding@resend.dev>';
  const isHR = role === 'hr' || role === 'admin';
  const roleTitle = isHR ? 'HR & Administration Portal' : 'Employee Workspace';
  const roleColor = isHR ? '#7e22ce' : '#0284c7';
  const badgeBg = isHR ? '#f3e8ff' : '#e0f2fe';
  const badgeText = isHR ? '🛡️ HR & Admin Gate' : '⚡ Employee Authentication';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .logo-badge { display: inline-block; background: ${badgeBg}; color: ${roleColor}; font-weight: 700; font-size: 11px; padding: 4px 12px; border-radius: 20px; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.05em; }
          h1 { color: #0f172a; font-size: 20px; font-weight: 800; margin: 0 0 8px 0; }
          p { color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0; }
          .otp-card { background: #f8fafc; border: 2px dashed ${isHR ? '#c084fc' : '#38bdf8'}; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
          .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 900; letter-spacing: 6px; color: ${roleColor}; margin: 0; }
          .meta-text { color: #94a3b8; font-size: 12px; margin-top: 8px; }
          .role-box { background: ${badgeBg}; border-radius: 8px; padding: 12px; margin: 16px 0; font-size: 13px; color: #0f172a; }
          .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 11px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo-badge">${badgeText}</div>
          <h1>${isHR ? 'HR / Administrator Verification' : 'Employee Sign-In Passcode'}</h1>
          <p>Hello ${userName ? `<strong>${userName}</strong>` : ''},</p>
          <p>You requested sign-in access for <code>${toEmail}</code>.</p>
          
          <div class="role-box">
            <strong>Target Destination:</strong> Automatically routing to <strong>${roleTitle}</strong> upon verification.
          </div>

          <div class="otp-card">
            <div class="otp-code">${otpCode}</div>
            <div class="meta-text">Valid for 10 minutes • Single-use authorization token</div>
          </div>

          <p>Enter this 6-digit code on the Dayflow sign-in screen to proceed.</p>
          <p style="font-size: 12px; color: #64748b;">If you did not initiate this sign-in, please ignore this email or contact support.</p>
          
          <div class="footer">
            Dayflow HRMS • 2026 Code Titans Edition • Powered by Resend Email Delivery
          </div>
        </div>
      </body>
    </html>
  `;

  if (resend) {
    try {
      const response = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        subject: isHR
          ? `[Dayflow HR Admin] ${otpCode} is your HR Command Center Passcode`
          : `[Dayflow] ${otpCode} is your Employee Sign-In Passcode`,
        html: htmlContent,
      });

      if (response.error) {
        console.warn('Resend API error:', response.error);
        return { success: false, error: response.error.message };
      }

      return { success: true, id: response.data?.id };
    } catch (err: any) {
      console.warn('Resend dispatch error (fallback active):', err?.message || err);
      return { success: false, error: err?.message || 'Failed to dispatch email' };
    }
  }

  // Fallback logging
  console.info(`[Resend Fallback] Mock OTP Email sent to ${toEmail} with code ${otpCode} (Role: ${role})`);
  return { success: true, id: `mock_${Date.now()}` };
}

/**
 * Send 6-Digit Security Verification OTP Email for HR & Admin Access
 */
export async function sendAdminVerificationEmail(toEmail: string, otpCode: string): Promise<{ success: boolean; id?: string; error?: string }> {
  return sendLoginOtpEmail(toEmail, otpCode, 'hr');
}

/**
 * Send Leave Request Status Email to Employee
 */
export async function sendLeaveDecisionEmail(
  toEmail: string,
  employeeName: string,
  leaveType: string,
  status: 'approved' | 'rejected',
  dates: { startDate: string; endDate: string; daysCount: number },
  adminComments?: string
): Promise<{ success: boolean; id?: string }> {
  if (!resend) return { success: true };

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Dayflow HRMS <onboarding@resend.dev>';
  const isApproved = status === 'approved';

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: ${isApproved ? '#166534' : '#991b1b'}; margin-top: 0;">
        Leave Request ${isApproved ? 'Approved ✅' : 'Rejected ❌'}
      </h2>
      <p>Hello <strong>${employeeName}</strong>,</p>
      <p>Your request for <strong>${leaveType.toUpperCase()}</strong> leave (${dates.daysCount} working day(s) from ${dates.startDate} to ${dates.endDate}) has been <strong>${status.toUpperCase()}</strong> by HR Administration.</p>
      ${adminComments ? `<p><strong>HR Comments:</strong> <em>${adminComments}</em></p>` : ''}
      <p style="font-size: 12px; color: #64748b; margin-top: 24px;">Dayflow HRMS Notification System</p>
    </div>
  `;

  try {
    const response = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `[Dayflow HR] Leave Application ${status.toUpperCase()} (${dates.startDate} - ${dates.endDate})`,
      html: htmlContent,
    });
    return { success: true, id: response.data?.id };
  } catch (err: any) {
    console.warn('Resend leave decision email error:', err?.message || err);
    return { success: false };
  }
}
