import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import pool from '@/lib/db';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY 미설정' }, { status: 503 });
  }

  const { rfp, entity_ids, project_type } = await req.json();

  // 참여 엔티티 정보 조회
  const { rows: entities } = await pool.query(
    'SELECT id, name, description, industry, color FROM collab.entities WHERE id = ANY($1)',
    [entity_ids]
  );

  // 과거 제안서 지식 조회 (RAG)
  const { rows: knowledgeDocs } = await pool.query(
    `SELECT title, category, content, result, year
     FROM collab.knowledge_docs
     WHERE entity_id = ANY($1) AND content IS NOT NULL
     ORDER BY year DESC NULLS LAST LIMIT 10`,
    [entity_ids]
  );

  const entityContext = entities.map((e: { name: string; description: string; industry: string }) =>
    `- ${e.name}: ${e.description || ''} (업종: ${e.industry || ''})`
  ).join('\n');

  const knowledgeContext = knowledgeDocs.length > 0
    ? knowledgeDocs.map((d: { title: string; result: string; content: string }) =>
        `[${d.title}${d.result ? ` / ${d.result}` : ''}]\n${d.content?.slice(0, 500)}`
      ).join('\n\n')
    : '(아직 등록된 과거 제안서 없음)';

  const prompt = `당신은 공공사업 제안서 작성 전문가입니다.

## 발주 정보
${rfp.title ? `- 사업명: ${rfp.title}` : ''}
${rfp.org ? `- 발주기관: ${rfp.org}` : ''}
${rfp.budget ? `- 예산: ${rfp.budget}원` : ''}
${rfp.deadline ? `- 마감일: ${rfp.deadline}` : ''}
${rfp.description ? `- 사업 개요: ${rfp.description}` : ''}
${rfp.requirements ? `- 주요 요구사항:\n${rfp.requirements}` : ''}
${rfp.evaluation ? `- 평가 기준:\n${rfp.evaluation}` : ''}
${project_type ? `- 사업 유형: ${project_type}` : ''}

## 참여 기관
${entityContext}

## 과거 수행 실적 (RAG)
${knowledgeContext}

## 요청
위 정보를 바탕으로 제안서 초안을 JSON 형식으로 생성해주세요.
모든 내용은 한국어로 작성하고, 발주기관의 요구사항과 평가 기준에 맞게 최적화하세요.
참여 기관의 강점을 실제로 반영하고, 구체적이고 실행 가능한 내용으로 작성하세요.

출력 형식 (반드시 유효한 JSON만 출력):
{
  "executive_summary": "사업 이해 및 추진 방향 (200자)",
  "slides": [
    {
      "slide_no": 1,
      "title": "슬라이드 제목",
      "type": "cover|toc|content|closing",
      "heading": "소제목 (선택)",
      "bullets": ["핵심 내용 1", "핵심 내용 2", "핵심 내용 3"],
      "note": "발표자 노트 (선택)"
    }
  ],
  "sections": {
    "understanding": "사업 이해 (사업 배경, 목적, 현황 분석)",
    "strategy": "수행 전략 (핵심 전략, 차별점, 기술 방법론)",
    "organization": "추진 체계 (역할 분담, 조직도 설명, 협력 구조)",
    "schedule": "수행 일정 (단계별 마일스톤)",
    "outcome": "기대 효과 (정량/정성 성과 지표)",
    "company": "회사 소개 (강점, 수행 실적, 보유 역량)"
  },
  "evaluation_mapping": [
    { "criterion": "평가 항목명", "score": "배점", "our_response": "우리의 대응 전략" }
  ]
}`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = (message.content[0] as { type: string; text: string }).text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('JSON 파싱 실패');
    const draft = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ draft, tokens: message.usage });
  } catch (e) {
    console.error('AI 생성 오류:', e);
    return NextResponse.json({ error: 'AI 생성 실패' }, { status: 500 });
  }
}
