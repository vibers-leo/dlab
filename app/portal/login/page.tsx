'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PortalLoginPage() {
  const router = useRouter();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/portal/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login_id: loginId, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? '로그인에 실패했습니다.');
        return;
      }

      router.push('/portal');
    } catch {
      setError('서버에 연결할 수 없습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
      style={{ backgroundColor: '#051226' }}>
      {/* 도트 그리드 배경 */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, #60A5FA 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      {/* 장식 원 */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-blue-600/8 blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-4 h-4 rounded-full pointer-events-none" style={{ backgroundColor: 'rgba(96,165,250,0.15)' }} />
      <div className="absolute bottom-1/3 left-1/5 w-3 h-3 rounded-full pointer-events-none" style={{ backgroundColor: 'rgba(96,165,250,0.1)' }} />

      {/* 로그인 카드 */}
      <div className="relative w-full max-w-sm rounded-2xl p-8"
        style={{
          backgroundColor: 'rgba(10,25,50,0.6)',
          border: '1px solid rgba(96,165,250,0.1)',
          backdropFilter: 'blur(16px)',
        }}>
        {/* 로고 */}
        <div className="text-center mb-8">
          <span className="text-2xl font-extrabold" style={{ letterSpacing: '-0.02em' }}>
            <span style={{ color: '#60A5FA' }}>:</span>
            <span className="text-white/80">DLAB</span>
          </span>
          <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>클라이언트 포털</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={loginId}
              onChange={e => setLoginId(e.target.value)}
              placeholder="아이디"
              required
              className="w-full px-4 py-3 rounded-xl text-sm text-white bg-transparent outline-none transition-all focus:ring-1 focus:ring-blue-400/30"
              style={{ border: '1px solid rgba(96,165,250,0.15)' }}
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
              className="w-full px-4 py-3 rounded-xl text-sm text-white bg-transparent outline-none transition-all focus:ring-1 focus:ring-blue-400/30"
              style={{ border: '1px solid rgba(96,165,250,0.15)' }}
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-full text-sm font-bold text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: '#3B82F6' }}
          >
            {submitting ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.25)' }}>
          외주를 의뢰하고 싶으신가요?{' '}
          <Link href="/portal/inquiry" className="underline transition-colors" style={{ color: 'rgba(96,165,250,0.6)' }}>
            문의하기
          </Link>
        </p>
      </div>
    </div>
  );
}
