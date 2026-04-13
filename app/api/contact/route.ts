import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { name, contact, message } = await req.json();

    if (!name || !message) {
      return NextResponse.json({ error: '필수 항목을 입력해주세요.' }, { status: 400 });
    }

    // DB 저장
    await pool.query(
      'INSERT INTO dlab.inquiries (name, contact, message) VALUES ($1, $2, $3)',
      [name, contact || null, message]
    );

    // 이메일 발송
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_EMAIL || 'juuuno1116@gmail.com',
      subject: `[디랩 협업 문의] ${name}`,
      html: `
        <div style="font-family: 'Apple SD Gothic Neo', sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0B2447; padding: 28px 32px;">
            <span style="color: #60A5FA; font-size: 18px; font-weight: 900; letter-spacing: -0.02em;">:</span>
            <span style="color: white; font-size: 18px; font-weight: 900; letter-spacing: -0.02em;">DLAB</span>
            <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 8px 0 0;">새로운 협업 문의가 도착했습니다</p>
          </div>
          <div style="background: white; padding: 32px; border: 1px solid #e5e7eb; border-top: none;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px; width: 80px;">이름/소속</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">연락처</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px;">${contact || '미입력'}</td>
              </tr>
            </table>
            <div style="margin-top: 24px;">
              <p style="color: #6b7280; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; margin-bottom: 10px;">문의 내용</p>
              <div style="background: #f9fafb; padding: 18px; color: #374151; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${message}</div>
            </div>
          </div>
          <div style="padding: 16px 32px; background: #f9fafb; border: 1px solid #e5e7eb; border-top: none; text-align: center;">
            <p style="color: #9ca3af; font-size: 11px; margin: 0;">이로운 일을 더 이롭게, 같이 가치 만들어요. — designdlab.co.kr</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Contact error:', e);
    return NextResponse.json({ error: '오류가 발생했습니다.' }, { status: 500 });
  }
}
