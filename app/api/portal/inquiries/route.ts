import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import nodemailer from 'nodemailer';

const BUDGET_LABEL: Record<string, string> = {
  'under-500': '500만원 미만',
  '500-1000': '500~1,000만원',
  '1000-3000': '1,000~3,000만원',
  'over-3000': '3,000만원 이상',
};

export async function POST(req: NextRequest) {
  const { company_name, contact_name, email, phone, category, budget_range, description } =
    await req.json();

  if (!contact_name?.trim() || !email?.trim() || !description?.trim()) {
    return NextResponse.json(
      { error: '담당자명, 이메일, 프로젝트 설명은 필수입니다' },
      { status: 400 },
    );
  }

  const { rows } = await pool.query(
    `INSERT INTO collab.inquiries (company_name, contact_name, email, phone, category, budget_range, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
    [company_name, contact_name, email, phone, category, budget_range, description],
  );

  // 관리자 이메일 알림
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_APP_PASSWORD },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_EMAIL || 'juuuno1116@gmail.com',
      subject: `[디랩 외주 요청] ${company_name || contact_name}`,
      html: `
        <div style="font-family: 'Apple SD Gothic Neo', sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0B2447; padding: 28px 32px;">
            <span style="color: #60A5FA; font-size: 18px; font-weight: 900;">:</span>
            <span style="color: white; font-size: 18px; font-weight: 900;">DLAB</span>
            <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 8px 0 0;">새로운 외주 요청이 접수되었습니다</p>
          </div>
          <div style="background: white; padding: 32px; border: 1px solid #e5e7eb; border-top: none;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px; width: 80px;">회사명</td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px; font-weight: 600;">${company_name || '-'}</td></tr>
              <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">담당자</td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px;">${contact_name}</td></tr>
              <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">이메일</td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px;">${email}</td></tr>
              <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">연락처</td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px;">${phone || '-'}</td></tr>
              <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">분야</td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px;">${category || '-'}</td></tr>
              <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">예산</td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px;">${BUDGET_LABEL[budget_range] || budget_range || '-'}</td></tr>
            </table>
            <div style="margin-top: 24px;">
              <p style="color: #6b7280; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; margin-bottom: 10px;">요청 내용</p>
              <div style="background: #f9fafb; padding: 18px; color: #374151; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${description}</div>
            </div>
          </div>
          <div style="padding: 16px 32px; background: #f9fafb; border: 1px solid #e5e7eb; border-top: none; text-align: center;">
            <a href="https://dlab.vibers.co.kr/portal/admin/inquiries" style="color: #3B82F6; font-size: 13px; text-decoration: none;">포털 어드민에서 확인하기 →</a>
          </div>
        </div>
      `,
    });
  } catch (e) {
    console.error('Inquiry email error:', e);
  }

  return NextResponse.json({ ok: true, id: rows[0].id }, { status: 201 });
}
