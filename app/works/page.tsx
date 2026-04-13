'use client';

import Link from 'next/link';
import { useState } from 'react';
import { works } from './data';

const categories = ['All', '이벤트', '기업', '앱', '제안서'];

export default function WorksPage() {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? works : works.filter((w) => w.category === filter);

  return (
    <main style={{ fontFamily: "'Paperlogy', sans-serif" }}>
      {/* 헤더 */}
      <section className="bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-900 px-6 pt-12 pb-16">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-violet-300 hover:text-white text-sm font-medium mb-10 transition-colors duration-200"
          >
            ← 홈으로
          </Link>
          <div>
            <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-violet-200 text-sm font-semibold tracking-wide">
              포트폴리오
            </span>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight">
              작업물
            </h1>
            <p className="text-violet-300 mt-4 text-lg max-w-xl">
              디랩이 함께한 프로젝트들입니다.
            </p>
          </div>
        </div>
      </section>

      {/* 카테고리 필터 탭 */}
      <section className="bg-white border-b border-gray-100 px-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-1 overflow-x-auto py-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`flex-none px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                  filter === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 카드 그리드 */}
      <section className="bg-gray-50 py-16 px-6 min-h-[60vh]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <Link
                key={item.id}
                href={`/works/${item.slug}`}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-200"
              >
                {/* 컬러 바 */}
                <div className="h-1" style={{ backgroundColor: item.color }} />

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: item.color + '18', color: item.color }}
                    >
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{item.year}</span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{item.desc}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="text-sm font-semibold transition-colors duration-200" style={{ color: item.color }}>
                    자세히 보기 →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-gray-400 py-20">해당 카테고리에 작업물이 없습니다.</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-950 py-8 px-6 text-center text-indigo-400 text-sm">
        <p className="font-semibold text-white/70 mb-1">디랩(D.Lab) | 계발자들 협력사</p>
        <p>&copy; {new Date().getFullYear()} 디랩. All rights reserved.</p>
      </footer>
    </main>
  );
}
