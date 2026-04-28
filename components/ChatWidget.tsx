'use client';

import { useState, useRef, useEffect } from 'react';

const ZEROCLAW_URL = 'http://49.50.138.93:42629';
const ZEROCLAW_TOKEN = 'zc_771330da3b33cbe7a45212da4d3ea80fcb1da5f99f7605460f641e9f351956e5';

type Message = { role: 'user' | 'bot'; text: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Message[]>([
    { role: 'bot', text: '안녕하세요! 디랩입니다.\n궁금한 점을 물어봐 주세요 😊' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMsgs(prev => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      // 1차 호출
      let res = await fetch(`${ZEROCLAW_URL}/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ZEROCLAW_TOKEN}`,
        },
        body: JSON.stringify({ message: text }),
      });
      let data = await res.json();
      let answer = data.response || '';

      // tool_code 응답이면 2차 호출 (멀티턴)
      if (answer.includes('<tool_code>') || answer.includes('file_read')) {
        res = await fetch(`${ZEROCLAW_URL}/webhook`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ZEROCLAW_TOKEN}`,
          },
          body: JSON.stringify({ message: '위 정보를 바탕으로 한국어로 간결하게 답변해줘' }),
        });
        data = await res.json();
        answer = data.response || '';
      }

      // 마크다운 태그 정리
      answer = answer
        .replace(/<tool_code>[\s\S]*?<\/tool_code>/g, '')
        .replace(/```[\s\S]*?```/g, '')
        .trim();

      if (!answer) answer = '죄송합니다. 잠시 후 다시 시도해 주세요.';
      setMsgs(prev => [...prev, { role: 'bot', text: answer }]);
    } catch {
      setMsgs(prev => [...prev, { role: 'bot', text: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 플로팅 버튼 */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[999] w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', boxShadow: '0 4px 20px rgba(59,130,246,0.4)' }}
          aria-label="채팅 열기"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* 채팅 패널 */}
      {open && (
        <div
          className="fixed bottom-4 right-4 z-[999] flex flex-col overflow-hidden shadow-2xl"
          style={{
            width: 'min(380px, calc(100vw - 32px))',
            height: 'min(540px, calc(100dvh - 32px))',
            borderRadius: 20,
            border: '1px solid rgba(96,165,250,0.15)',
            background: '#0a1628',
          }}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid rgba(96,165,250,0.1)', background: 'rgba(4,14,30,0.95)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' }}>
                <span className="text-white text-xs font-black">:D</span>
              </div>
              <div>
                <p className="text-white text-sm font-bold" style={{ letterSpacing: '-0.02em' }}>디랩 AI</p>
                <p className="text-xs" style={{ color: 'rgba(96,165,250,0.6)' }}>무엇이든 물어보세요</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-all">
              ✕
            </button>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: 'none' }}>
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
                  style={m.role === 'user'
                    ? { background: '#3B82F6', color: 'white', borderRadius: '16px 16px 4px 16px' }
                    : { background: 'rgba(96,165,250,0.08)', color: 'rgba(255,255,255,0.85)', borderRadius: '16px 16px 16px 4px', border: '1px solid rgba(96,165,250,0.1)' }
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl" style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.1)' }}>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-400/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-blue-400/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-blue-400/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* 입력 */}
          <div className="px-3 pb-3 pt-1" style={{ borderTop: '1px solid rgba(96,165,250,0.08)' }}>
            <form
              onSubmit={e => { e.preventDefault(); send(); }}
              className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.1)' }}
            >
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0"
                style={{
                  background: input.trim() ? '#3B82F6' : 'rgba(96,165,250,0.1)',
                  color: input.trim() ? 'white' : 'rgba(96,165,250,0.3)',
                }}
              >
                ↑
              </button>
            </form>
            <p className="text-center mt-1.5" style={{ color: 'rgba(96,165,250,0.25)', fontSize: 10 }}>Powered by ZeroClaw AI</p>
          </div>
        </div>
      )}
    </>
  );
}
