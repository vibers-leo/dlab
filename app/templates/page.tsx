'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Template = {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  featured?: boolean;
};

const CATEGORIES = ['전체', '뷰티/살롱', '다이닝/F&B', '카페/베이커리', '피트니스/요가', '병원/의료', '법률/전문직', '기업/브랜드', '쇼핑몰', '스테이/숙박', '공간/렌탈', '포트폴리오'] as const;

const TEMPLATES: Template[] = [
  { id: 1, name: 'LUMIER', category: '뷰티/살롱', description: '청담동 하이엔드 살롱 스타일. 고급스러운 세리프 폰트와 인물 중심 레이아웃.', image: '/images/templates/beauty_makeup.png', featured: true },
  { id: 2, name: '溫 (ON)', category: '다이닝/F&B', description: '여백의 미를 살린 모던 오마카세 다이닝 스타일. 갤러리 같은 메뉴 소개 디자인.', image: '/images/templates/dining_omakase.png', featured: true },
  { id: 3, name: '서촌 쉼', category: '스테이/숙박', description: '한옥의 정취를 담은 감성 스테이. 수평 스크롤 스토리텔링.', image: '/images/templates/cozy_stay.png', featured: true },
  { id: 4, name: '클린 싹싹', category: '공간/렌탈', description: '건물위생관리업 정식 등록업체. 신뢰감을 주는 블루톤의 전문 청소업체 템플릿.', image: '/images/templates/cleaning_main.png', featured: true },
  { id: 5, name: 'Sculpt & Soul', category: '피트니스/요가', description: '아티스틱 웰니스 브랜드 스타일. 감각적인 다크 모드와 타이포그래피.', image: '/images/templates/fitness_gym.png' },
  { id: 6, name: 'Focus Lab', category: '공간/렌탈', description: '건축적인 조형미가 돋보이는 스터디 랩 스타일. 집중력을 높이는 미니멀리즘.', image: '/images/templates/minimal_studio.png' },
  { id: 7, name: 'AETHER', category: '쇼핑몰', description: '이미지가 돋보이는 모던 시크 패션 브랜드. 상품 디테일을 살리는 레이아웃.', image: '/images/templates/shopping_new_arrivals.png' },
  { id: 8, name: 'Novus', category: '기업/브랜드', description: '신뢰감을 주는 블루톤의 IT 스타트업 스타일. 데이터 시각화 섹션 포함.', image: '/images/templates/novus_saas.png' },
  { id: 9, name: 'Daily Crumb', category: '카페/베이커리', description: '따뜻한 베이지톤의 감성 베이커리 스타일. 인스타그램 피드 연동 디자인.', image: '/images/templates/cafe_baguette.png' },
  { id: 10, name: 'ARCHIVE', category: '포트폴리오', description: '크리에이터를 위한 다크모드 그리드 갤러리. 작품에만 집중할 수 있는 디자인.', image: '/images/templates/portfolio_gallery.png' },
  { id: 11, name: 'Pure Clinic', category: '병원/의료', description: '깨끗하고 전문적인 느낌의 클리닉 스타일. 신뢰감을 주는 의료진 소개 섹션.', image: '/images/templates/skin_clinic_hero.png' },
  { id: 12, name: 'Trust & Logic', category: '법률/전문직', description: '세리프 폰트와 네이비 컬러로 무게감을 준 전문직. 성공 사례 중심 레이아웃.', image: '/images/templates/justice_law.png' },
  { id: 13, name: 'Bliss', category: '스테이/숙박', description: '우아하고 로맨틱한 웨딩 플래너/베뉴 템플릿. 감성적인 비주얼 스토리텔링.', image: '/images/templates/pension_spa.png' },
  { id: 14, name: 'Urban Fit', category: '피트니스/요가', description: '에너지 넘치는 현대적인 크로스핏/헬스장 템플릿. 강렬한 타이포그래피와 다이내믹한 레이아웃.', image: '/images/templates/urban_kicks.png' },
  { id: 15, name: 'Pet Palace', category: '쇼핑몰', description: '반려동물을 위한 프리미엄 케어 서비스. 부드러운 곡선과 따뜻한 파스텔톤 컬러.', image: '/images/templates/little_star.png' },
  { id: 16, name: 'Kids Station', category: '공간/렌탈', description: '아이들의 창의력을 자극하는 키즈카페. 알록달록한 컬러와 귀여운 일러스트 아이콘.', image: '/images/templates/kinder_classroom.png' },
  { id: 17, name: 'Camp Vibez', category: '스테이/숙박', description: '자연 속 힐링을 위한 감성 캠핑장. 예약 시스템 UI가 최적화된 아웃도어 스타일.', image: '/images/templates/camping_tent.png' },
  { id: 18, name: 'Flower & Garden', category: '쇼핑몰', description: '우아한 플로리스트 포트폴리오. 식물의 싱그러움을 담은 내추럴&보태니컬 디자인.', image: '/images/templates/flower_garden.png' },
  { id: 19, name: 'Burger House', category: '다이닝/F&B', description: '힙한 수제버거 브랜드. 식욕을 자극하는 비비드한 컬러와 굵은 고딕 폰트.', image: '/images/templates/the_avenue.png' },
  { id: 20, name: 'Wine Social', category: '다이닝/F&B', description: '어두운 조명의 분위기 있는 와인바. 고급스러운 블랙 배경과 골드 포인트.', image: '/images/templates/hotel_luxury.png' },
  { id: 21, name: 'Yoga Flow', category: '피트니스/요가', description: '마음의 평화를 찾는 요가 스튜디오. 차분한 그린과 화이트 톤의 힐링 디자인.', image: '/images/templates/yoga_flow.png' },
  { id: 22, name: 'Nail Artistry', category: '뷰티/살롱', description: '트렌디한 네일아트 살롱. 작품 갤러리와 예약 시스템이 돋보이는 핑크톤 디자인.', image: '/images/templates/flower_shop_hero_1.png' },
  { id: 23, name: 'Barber Classic', category: '뷰티/살롱', description: '클래식한 남성 이발소. 빈티지 감성의 브라운 톤과 레트로 타이포그래피.', image: '/images/templates/leather_atelier.png' },
  { id: 24, name: 'Skin Lab', category: '뷰티/살롱', description: '피부과학 기반 스킨케어 클리닉. 깔끔한 화이트 베이스와 과학적인 데이터 시각화.', image: '/images/templates/skin_clinic_hero.png' },
  { id: 25, name: 'Dental Care', category: '병원/의료', description: '밝고 친근한 치과 병원. 환자 중심의 따뜻한 블루 컬러와 안심 케어 메시지.', image: '/images/templates/hotel_grand.png' },
  { id: 26, name: 'Pet Hospital', category: '병원/의료', description: '반려동물 전문 동물병원. 귀여운 일러스트와 안심할 수 있는 파스텔 컬러.', image: '/images/templates/little_star.png' },
  { id: 27, name: 'Law Firm Pro', category: '법률/전문직', description: '대형 로펌 스타일. 신뢰와 권위를 상징하는 다크 네이비와 골드 포인트.', image: '/images/templates/law_office.png' },
  { id: 28, name: 'Accounting Plus', category: '법률/전문직', description: '회계법인 전문 템플릿. 숫자와 데이터를 효과적으로 보여주는 차트 중심 레이아웃.', image: '/images/templates/finance_invest.png' },
  { id: 29, name: 'Consulting Hub', category: '기업/브랜드', description: '경영 컨설팅 회사. 전문성을 강조하는 그레이 톤과 케이스 스터디 섹션.', image: '/images/templates/corporate_office.png' },
  { id: 30, name: 'Marketing Agency', category: '기업/브랜드', description: '크리에이티브 마케팅 에이전시. 화려한 그라데이션과 포트폴리오 갤러리.', image: '/images/templates/novus_saas.png' },
  { id: 31, name: 'Photo Studio', category: '포트폴리오', description: '순간을 기록하는 사진관. 갤러리 형태의 레이아웃으로 사진에 집중.', image: '/images/templates/minimal_studio.png' },
  { id: 32, name: 'Tattoo Ink', category: '포트폴리오', description: '개성을 새기는 타투샵. 강렬하고 힙한 분위기의 블랙&화이트 포트폴리오.', image: '/images/templates/portfolio_gallery.png' },
  { id: 33, name: 'Tax Pro', category: '법률/전문직', description: '신뢰받는 세무 파트너. 전문적인 느낌의 네이비 컬러와 깔끔한 아이콘.', image: '/images/templates/tax_partner.png' },
  { id: 34, name: 'Code Academy', category: '기업/브랜드', description: '코딩 교육 플랫폼. 테크 감성의 다크 테마와 인터랙티브한 커리큘럼 UI.', image: '/images/templates/code_academy.png' },
  { id: 35, name: 'Sweet Spot', category: '카페/베이커리', description: '파스텔 컬러의 감성 디저트 카페. 도넛 테마와 귀여운 일러스트.', image: '/images/templates/sweetspot_donut.png' },
  { id: 36, name: 'Salad Green', category: '다이닝/F&B', description: '신선한 샐러드 전문점. 팝 컬러와 커스텀 볼 주문 UI.', image: '/images/templates/salad_green.png' },
];

const CATEGORY_COLORS: Record<string, string> = {
  '뷰티/살롱': 'bg-pink-500/20 text-pink-300',
  '다이닝/F&B': 'bg-orange-500/20 text-orange-300',
  '카페/베이커리': 'bg-amber-500/20 text-amber-300',
  '피트니스/요가': 'bg-lime-500/20 text-lime-300',
  '병원/의료': 'bg-cyan-500/20 text-cyan-300',
  '법률/전문직': 'bg-slate-400/20 text-slate-300',
  '기업/브랜드': 'bg-blue-500/20 text-blue-300',
  '쇼핑몰': 'bg-violet-500/20 text-violet-300',
  '스테이/숙박': 'bg-emerald-500/20 text-emerald-300',
  '공간/렌탈': 'bg-teal-500/20 text-teal-300',
  '포트폴리오': 'bg-rose-500/20 text-rose-300',
};

export default function TemplatesPage() {
  const [filter, setFilter] = useState('전체');
  const [showCTA, setShowCTA] = useState(false);

  const filtered = filter === '전체' ? TEMPLATES : TEMPLATES.filter(t => t.category === filter);
  const featured = TEMPLATES.filter(t => t.featured);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#051226' }}>
      {/* 헤더 */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10" style={{ backgroundColor: 'rgba(5,18,38,0.85)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-extrabold" style={{ letterSpacing: '-0.02em' }}>
            <span style={{ color: '#60A5FA' }}>:</span>
            <span className="text-white">DLAB</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/works" className="text-sm text-white/50 hover:text-white/80 transition-colors">포트폴리오</Link>
            <button
              onClick={() => setShowCTA(true)}
              className="px-5 py-2 bg-blue-500 text-white text-sm font-bold rounded-full hover:bg-blue-400 transition-colors"
            >
              문의하기
            </button>
          </div>
        </div>
      </header>

      {/* 히어로 */}
      <section className="relative py-20 sm:py-28 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #60A5FA 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block border border-blue-400/50 text-blue-200 px-4 py-1 rounded-full text-xs tracking-widest mb-6">
            33+ 업종별 디자인
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-4 leading-tight">
            우리 업종에 딱 맞는<br />
            <span style={{ color: '#60A5FA' }}>사이트 디자인</span>
          </h1>
          <p className="text-lg text-blue-300/70 mb-8">
            카페부터 병원, 법률사무소까지.<br className="sm:hidden" />
            업종 특성에 최적화된 템플릿을 확인하세요.
          </p>
          <p className="text-sm text-white/40">
            마음에 드는 디자인을 골라 문의하면, 디랩이 맞춤 제작해드립니다.
          </p>
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <h2 className="text-sm font-bold text-blue-400 tracking-widest uppercase mb-6">Featured</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map(t => (
            <button
              key={t.id}
              onClick={() => setShowCTA(true)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 hover:border-blue-400/50 transition-all duration-300"
            >
              <Image
                src={t.image}
                alt={t.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-2 ${CATEGORY_COLORS[t.category]}`}>
                  {t.category}
                </span>
                <p className="text-white font-bold text-sm">{t.name}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 필터 탭 */}
      <section className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filter === cat
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
              }`}
            >
              {cat}
              {cat !== '전체' && (
                <span className="ml-1 opacity-60">
                  {TEMPLATES.filter(t => t.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* 템플릿 그리드 */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(t => (
            <button
              key={t.id}
              onClick={() => setShowCTA(true)}
              className="group text-left bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden hover:border-blue-400/40 hover:bg-white/[0.06] transition-all duration-300"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-5 py-2.5 bg-blue-500 text-white text-sm font-bold rounded-full">
                    이 디자인으로 문의
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${CATEGORY_COLORS[t.category]}`}>
                    {t.category}
                  </span>
                  {t.featured && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-300">Featured</span>
                  )}
                </div>
                <h3 className="text-white font-bold mb-1">{t.name}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{t.description}</p>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/30">
            해당 카테고리에 템플릿이 없습니다.
          </div>
        )}
      </section>

      {/* 하단 CTA */}
      <section className="border-t border-white/10 py-20 px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          원하는 디자인을 찾으셨나요?
        </h2>
        <p className="text-blue-300/60 mb-8">
          템플릿을 기반으로 맞춤 제작해드립니다. 수정, 기능 추가 모두 가능해요.
        </p>
        <button
          onClick={() => setShowCTA(true)}
          className="px-8 py-4 bg-blue-500 text-white font-bold text-sm tracking-wide rounded-full hover:bg-blue-400 transition-colors"
        >
          프로젝트 문의하기
        </button>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-white/10 py-6 px-10 flex flex-col sm:flex-row justify-between items-center gap-2">
        <span className="text-sm font-extrabold text-white/40" style={{ letterSpacing: '-0.02em' }}>
          <span className="text-blue-400/60">:</span>DLAB
        </span>
        <div className="flex gap-4 text-xs text-white/30">
          <Link href="/" className="hover:text-white/60 transition-colors">홈</Link>
          <Link href="/works" className="hover:text-white/60 transition-colors">포트폴리오</Link>
          <Link href="/privacy" className="hover:text-white/60 transition-colors">개인정보처리방침</Link>
          <Link href="/terms" className="hover:text-white/60 transition-colors">이용약관</Link>
        </div>
        <span className="text-sm text-white/20">&copy; {new Date().getFullYear()} 디랩</span>
      </footer>

      {/* 문의 모달 */}
      {showCTA && (
        <CTA onClose={() => setShowCTA(false)} />
      )}
    </div>
  );
}

function CTA({ onClose }: { onClose: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);

  if (result === 'success') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 text-center" onClick={e => e.stopPropagation()}>
          <div className="text-4xl mb-4">&#10003;</div>
          <p className="text-lg font-bold text-gray-900 mb-2">문의가 접수되었어요!</p>
          <p className="text-sm text-gray-400 mb-6">빠른 시일 내에 연락드릴게요.</p>
          <button onClick={onClose} className="px-6 py-2.5 bg-[#0B2447] text-white font-bold rounded-xl text-sm hover:bg-[#1565C0] transition-colors">
            닫기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        <h3 className="text-2xl font-extrabold text-gray-900 mb-1">맞춤 제작 문의</h3>
        <p className="text-gray-400 text-sm mb-6">원하시는 템플릿 이름과 함께 문의해주세요.</p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true);
            const data = new FormData(e.currentTarget);
            try {
              const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: data.get('name'),
                  contact: data.get('contact'),
                  message: data.get('message'),
                }),
              });
              setResult(res.ok ? 'success' : 'error');
            } catch {
              setResult('error');
            } finally {
              setSubmitting(false);
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">이름 / 소속</label>
            <input name="name" required placeholder="홍길동 / 카페이름"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">연락처</label>
            <input name="contact" placeholder="이메일 또는 전화번호"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">어떤 사이트를 만들고 싶으신가요?</label>
            <textarea name="message" required rows={4} placeholder="원하는 템플릿 이름, 업종, 필요한 기능 등을 알려주세요."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none" />
          </div>
          {result === 'error' && (
            <p className="text-xs text-red-500">오류가 발생했어요. 다시 시도해주세요.</p>
          )}
          <button type="submit" disabled={submitting}
            className="w-full bg-[#0B2447] text-white font-bold py-3.5 rounded-xl hover:bg-[#1565C0] transition-colors text-sm disabled:opacity-50">
            {submitting ? '보내는 중...' : '문의 보내기'}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-gray-400">
          또는 <a href="mailto:hello@designdlab.co.kr" className="underline hover:text-gray-600 transition-colors">hello@designdlab.co.kr</a>로 직접 메일 보내기
        </p>
      </div>
    </div>
  );
}
