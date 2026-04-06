import Link from "next/link";

const works = [
  { id: 1, title: "2026 부산 봄꽃 전시회", category: "이벤트", desc: "부산 지역 봄꽃 페스티벌 공식 홈페이지", tags: ["Next.js", "이벤트"], color: "#6366f1", year: "2026" },
  { id: 2, title: "올루올루 프랜차이즈", category: "기업", desc: "올루올루 브랜드 공식 사이트 & 가맹 안내", tags: ["FanEasy", "브랜드"], color: "#f59e0b", year: "2025", url: "https://oluolu.co.kr" },
  { id: 3, title: "비즈온마케팅", category: "기업", desc: "마케팅 에이전시 기업 소개 사이트", tags: ["브랜드", "Rails"], color: "#10b981", year: "2025", url: "https://bizonmarketing.co.kr" },
  { id: 4, title: "CPR마케팅", category: "기업", desc: "SNS 마케팅 전문 에이전시 홈페이지", tags: ["브랜드"], color: "#ef4444", year: "2025", url: "https://cprmarketing.co.kr" },
  { id: 5, title: "야화혼술바", category: "기업", desc: "혼술 콘셉트 바 브랜드 사이트", tags: ["FanEasy", "브랜드"], color: "#8b5cf6", year: "2025", url: "https://yahwabar.com" },
  { id: 6, title: "누수체크", category: "앱", desc: "누수 탐지 서비스 앱 & 랜딩", tags: ["Next.js", "앱"], color: "#06b6d4", year: "2026", url: "https://nusucheck.com" },
  { id: 7, title: "세모폰", category: "앱", desc: "중고폰 거래 플랫폼", tags: ["Next.js", "커머스"], color: "#f97316", year: "2026", url: "https://semophone.co.kr" },
  { id: 8, title: "바이브폴리오", category: "앱", desc: "포트폴리오 빌더 SaaS", tags: ["Next.js", "SaaS"], color: "#ec4899", year: "2026", url: "https://vibefolio.net" },
];

const categories = ["All", "이벤트", "기업", "앱", "제안서"];

export default function WorksPage() {
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

      {/* 카테고리 필터 탭 (정적) */}
      <section className="bg-white border-b border-gray-100 px-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {categories.map((cat) => (
              <span
                key={cat}
                className={`flex-none px-5 py-2 rounded-full text-sm font-semibold cursor-default transition-colors duration-200 ${
                  cat === "All"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 카드 그리드 */}
      <section className="bg-gray-50 py-16 px-6 min-h-[60vh]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {works.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-200"
              >
                {/* 컬러 바 */}
                <div className="h-1" style={{ backgroundColor: item.color }} />

                <div className="p-6">
                  {/* 카테고리 뱃지 + 연도 */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: item.color + "18",
                        color: item.color,
                      }}
                    >
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{item.year}</span>
                  </div>

                  {/* 타이틀 */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                    {item.title}
                  </h3>

                  {/* 설명 */}
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{item.desc}</p>

                  {/* 태그 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 사이트 링크 */}
                  {"url" in item && item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold transition-colors duration-200"
                      style={{ color: item.color }}
                    >
                      사이트 보기 →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-950 py-8 px-6 text-center text-indigo-400 text-sm">
        <p className="font-semibold text-white/70 mb-1">디랩(D.Lab) | 계발자들 협력사 | designdlab.co.kr</p>
        <p>© {new Date().getFullYear()} 디랩. All rights reserved.</p>
      </footer>
    </main>
  );
}
