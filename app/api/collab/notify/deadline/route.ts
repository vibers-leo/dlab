import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import nodemailer from 'nodemailer';

export async function POST() {
  // 마감 D-7, D-3, D-1 프로젝트 조회
  const { rows: upcoming } = await pool.query(`
    SELECT p.id, p.title, p.deadline, p.status,
      array_agg(DISTINCT e.name) AS entity_names
    FROM collab.projects p
    LEFT JOIN collab.project_members pm ON pm.project_id = p.id
    LEFT JOIN collab.entities e ON e.id = pm.entity_id
    WHERE p.deadline IS NOT NULL
      AND p.status IN ('proposal', 'active')
      AND p.deadline BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
    GROUP BY p.id
    ORDER BY p.deadline
  `);

  if (!upcoming.length) return NextResponse.json({ sent: 0 });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_APP_PASSWORD },
  });

  const daysLeft = (deadline: string) =>
    Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);

  let sent = 0;
  for (const project of upcoming) {
    const d = daysLeft(project.deadline);
    if (![1, 3, 7].includes(d)) continue;

    const html = `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#051226;color:white;padding:32px;border-radius:16px;">
        <p style="color:#60A5FA;font-size:12px;font-weight:700;letter-spacing:0.1em;margin-bottom:8px;">VIBERS COLLAB HUB</p>
        <h2 style="font-size:20px;font-weight:900;margin-bottom:4px;">⏰ 마감 D-${d}</h2>
        <p style="color:rgba(255,255,255,0.6);margin-bottom:24px;">${project.title}</p>
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;font-size:13px;color:rgba(255,255,255,0.7);">
          <p>마감일: <strong style="color:white">${project.deadline.slice(0,10)}</strong></p>
          <p>참여 기관: ${(project.entity_names || []).join(', ')}</p>
        </div>
        <a href="https://dlab.vibers.co.kr/collab/projects/${project.id}" style="display:block;margin-top:20px;padding:14px;background:#3B82F6;color:white;text-align:center;border-radius:12px;text-decoration:none;font-weight:700;font-size:14px;">프로젝트 확인하기</a>
      </div>`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_EMAIL || 'juuuno1116@gmail.com',
      subject: `[디랩 Collab] ⏰ 마감 D-${d}: ${project.title}`,
      html,
    });

    await pool.query(
      'INSERT INTO collab.notifications (type, target_id, message) VALUES ($1,$2,$3)',
      ['deadline', project.id, `D-${d} 알림 발송: ${project.title}`]
    );
    sent++;
  }

  return NextResponse.json({ sent, projects: upcoming.map(p => p.title) });
}
