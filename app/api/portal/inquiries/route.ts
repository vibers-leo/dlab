import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

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

  return NextResponse.json({ ok: true, id: rows[0].id }, { status: 201 });
}
