'use client';

import { useState } from 'react';
import Link from 'next/link';

const CATEGORIES = ['웹개발', '디자인', '마케팅', 'AI', '컨설팅', '기타'];
const BUDGETS = ['500만원 미만', '500-1000만원', '1000-3000만원', '3000만원 이상'];

export default function InquiryPage() {
  const [form, setForm] = useState({
    company_name: '', contact_name: '', email: '', phone: '',
    category: '', budget_range: '', description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const r = await fetch('/api/portal/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!r.ok) throw new Error('전송 실패');
      setSuccess(true);
    } catch {
      setError('요청 전송에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    backgroundColor: 'rgba(96,165,250,0.04)',
    border: '1px solid rgba(96,165,250,0.12)',
    color: 'rgba(255,255,255,0.85)',
  };

  return (
    <div className="min-h-screen relative">
      {/* Dot grid */}
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, #60A5FA 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />
      <div className="fixed top-20 right-10 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-10 w-48 h-48 rounded-full bg-blue-600/8 blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(96,165,250,0.1)' }}>
        <div className="flex items-center gap-4">
          <Link href="/portal" className="text-base font-extrabold" style={{ letterSpacing: '-0.02em' }}>
            <span style={{ color: '#60A5FA' }}>:</span>
            <span className="text-white/80">DLAB</span>
          </Link>
          <span className="text-sm font-medium text-white/40">외주 요청</span>
        </div>
        <Link href="/portal/login" className="text-xs font-medium text-white/40 hover:text-white/60 transition-colors">
          로그인
        </Link>
      </header>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        {success ? (
          <div className="text-center py-20 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
              ✓
            </div>
            <h2 className="text-lg font-bold text-white/90">요청이 접수되었습니다</h2>
            <p className="text-sm text-white/50">빠른 시일 내 연락드리겠습니다.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl p-8 space-y-6" style={{ backgroundColor: 'rgba(96,165,250,0.03)', border: '1px solid rgba(96,165,250,0.1)' }}>
            <h2 className="text-lg font-bold text-white/90 mb-6">프로젝트 요청서</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-white/40">회사명 <span className="text-white/20">(선택)</span></label>
                <input type="text" value={form.company_name} onChange={e => set('company_name', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-blue-400/30" style={inputStyle} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-white/40">담당자명 <span className="text-red-400">*</span></label>
                <input type="text" required value={form.contact_name} onChange={e => set('contact_name', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-blue-400/30" style={inputStyle} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-white/40">이메일 <span className="text-red-400">*</span></label>
                <input type="email" required value={form.email} onChange={e => set('email', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-blue-400/30" style={inputStyle} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-white/40">연락처</label>
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-blue-400/30" style={inputStyle} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-white/40">카테고리</label>
                <select value={form.category} onChange={e => set('category', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-blue-400/30" style={inputStyle}>
                  <option value="">선택</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-white/40">예산 범위</label>
                <select value={form.budget_range} onChange={e => set('budget_range', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-blue-400/30" style={inputStyle}>
                  <option value="">선택</option>
                  {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-white/40">프로젝트 설명 <span className="text-red-400">*</span></label>
              <textarea required rows={5} value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="프로젝트에 대해 자세히 알려주세요"
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none focus:ring-1 focus:ring-blue-400/30" style={inputStyle} />
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <button type="submit" disabled={submitting}
              className="w-full py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
              style={{ backgroundColor: 'rgba(96,165,250,0.15)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.3)' }}>
              {submitting ? '전송 중...' : '요청서 보내기'}
            </button>

            <p className="text-center text-xs text-white/30">
              이미 계정이 있으신가요?{' '}
              <Link href="/portal/login" className="text-blue-400/60 hover:text-blue-400 transition-colors">로그인</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
