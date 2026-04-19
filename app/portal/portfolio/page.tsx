'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PortfolioItem {
  id: number;
  title: string;
  description: string | null;
  client_name: string | null;
  category: string;
  image_url: string | null;
  link_url: string | null;
  tags: string[];
  is_featured: boolean;
}

const CATEGORIES = ['전체', '웹개발', '디자인', '마케팅', 'AI'] as const;

function PublicHeader({ title }: { title: string }) {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(96,165,250,0.1)' }}>
      <div className="flex items-center gap-4">
        <Link href="/portal" className="text-base font-extrabold" style={{ letterSpacing: '-0.02em' }}>
          <span style={{ color: '#60A5FA' }}>:</span>
          <span className="text-white/80">DLAB</span>
        </Link>
        <span className="text-sm font-medium text-white/40">{title}</span>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/portal/inquiry" className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all" style={{ color: '#60A5FA', border: '1px solid rgba(96,165,250,0.2)' }}>
          외주 문의
        </Link>
        <Link href="/portal/login" className="text-xs font-medium text-white/40 hover:text-white/60 transition-colors">
          로그인
        </Link>
      </div>
    </header>
  );
}

function DotGridBg() {
  return (
    <>
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, #60A5FA 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />
      <div className="fixed top-20 right-10 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-10 w-48 h-48 rounded-full bg-blue-600/8 blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 left-1/3 w-3 h-3 rounded-full border border-blue-400/10 pointer-events-none" />
      <div className="fixed top-1/4 right-1/4 w-5 h-5 rounded-full border border-blue-400/8 pointer-events-none" />
    </>
  );
}

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('전체');

  useEffect(() => {
    fetch('/api/portal/portfolio')
      .then(r => r.json())
      .then(d => setItems(d.items ?? d ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === '전체' ? items : items.filter(i => i.category === activeCategory);

  return (
    <div className="min-h-screen relative">
      <DotGridBg />
      <PublicHeader title="포트폴리오" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
              style={activeCategory === cat
                ? { backgroundColor: 'rgba(96,165,250,0.15)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.3)' }
                : { color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(96,165,250,0.08)' }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/30 text-sm">포트폴리오를 준비 중입니다</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {filtered.map(item => (
              <div key={item.id}
                className="break-inside-avoid mb-4 rounded-xl overflow-hidden transition-all hover:scale-[1.01]"
                style={{
                  backgroundColor: 'rgba(96,165,250,0.04)',
                  border: item.is_featured ? '1px solid rgba(234,179,8,0.4)' : '1px solid rgba(96,165,250,0.1)',
                }}
              >
                {item.link_url ? (
                  <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="block">
                    <CardContent item={item} />
                  </a>
                ) : (
                  <CardContent item={item} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CardContent({ item }: { item: PortfolioItem }) {
  return (
    <>
      {item.image_url && (
        <img src={item.image_url} alt={item.title} className="w-full rounded-t-xl object-cover" style={{ maxHeight: 240 }} />
      )}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(96,165,250,0.12)', color: '#60A5FA' }}>
            {item.category}
          </span>
          {item.is_featured && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(234,179,8,0.12)', color: '#EAB308' }}>
              Featured
            </span>
          )}
        </div>
        <h3 className="text-sm font-bold text-white/90">{item.title}</h3>
        {item.client_name && <p className="text-xs text-white/30">{item.client_name}</p>}
        {item.description && <p className="text-xs text-white/50 line-clamp-3">{item.description}</p>}
        {item.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {item.tags.map(tag => (
              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(96,165,250,0.06)', color: 'rgba(96,165,250,0.5)' }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
