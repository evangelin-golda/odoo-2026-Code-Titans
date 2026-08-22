import { NextRequest, NextResponse } from 'next/server';
import { getSalaryDetails, getPayslipById } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId') || 'EMP-1001';
    const payslipId = searchParams.get('payslipId');

    if (payslipId) {
      const slip = getPayslipById(employeeId, payslipId);
      if (!slip) {
        return NextResponse.json({ error: 'Payslip not found.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, payslip: slip });
    }

    const { salaryStructure, payslips } = getSalaryDetails(employeeId);

    // Compute annual earnings & deductions summary
    const annualGross = salaryStructure.baseAnnual + (salaryStructure.performanceBonus * 12);
    const monthlyGross = salaryStructure.baseMonthly + salaryStructure.hra + salaryStructure.specialAllowance + salaryStructure.performanceBonus;
    const monthlyDeductions = salaryStructure.providentFund + salaryStructure.professionalTax + salaryStructure.healthInsurance;
    const calculatedNet = monthlyGross - monthlyDeductions;

    return NextResponse.json({
      success: true,
      salaryStructure: {
        ...salaryStructure,
        calculatedMonthlyGross: monthlyGross,
        calculatedMonthlyDeductions: monthlyDeductions,
        calculatedNet,
        annualGross,
      },
      payslips,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to retrieve salary data.' }, { status: 500 });
  }
}
