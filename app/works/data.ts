export type Work = {
  id: number;
  slug: string;
  title: string;
  category: string;
  desc: string;
  fullDesc: string;
  tags: string[];
  color: string;
  year: string;
  url?: string;
  points: string[];
};

export const works: Work[] = [
  {
    id: 1,
    slug: 'busan-spring',
    title: '2026 부산 봄꽃 전시회',
    category: '이벤트',
    desc: '부산 지역 봄꽃 페스티벌 공식 홈페이지',
    fullDesc: '부산 지역 최대 봄꽃 페스티벌의 공식 디지털 거점. 행사 일정, 장소 안내, 프로그램 소개를 담은 홈페이지를 기획·제작했습니다. 방문객이 모바일에서도 빠르게 정보를 찾을 수 있도록 가벼운 Next.js 정적 사이트로 구성했습니다.',
    tags: ['Next.js', '이벤트'],
    color: '#6366f1',
    year: '2026',
    points: ['모바일 최적화 반응형 UI', '행사 일정 · 프로그램 안내', '빠른 정적 페이지 로딩'],
  },
  {
    id: 2,
    slug: 'oluolu',
    title: '올루올루 프랜차이즈',
    category: '기업',
    desc: '올루올루 브랜드 공식 사이트 & 가맹 안내',
    fullDesc: '올루올루 프랜차이즈 브랜드의 공식 사이트와 가맹 문의 시스템을 구축했습니다. FanEasy 플랫폼을 기반으로 빠르게 브랜드 사이트를 론칭했으며, 가맹 신청 폼과 매장 현황 페이지를 포함합니다.',
    tags: ['FanEasy', '브랜드'],
    color: '#f59e0b',
    year: '2025',
    url: 'https://oluolu.co.kr',
    points: ['FanEasy 플랫폼 기반 빠른 론칭', '가맹 문의 폼 연동', '브랜드 스토리 페이지'],
  },
  {
    id: 3,
    slug: 'bizon',
    title: '비즈온마케팅',
    category: '기업',
    desc: '마케팅 에이전시 기업 소개 사이트',
    fullDesc: '마케팅 에이전시 비즈온의 기업 소개 사이트를 기획·제작했습니다. 서비스 소개, 포트폴리오, 팀 소개, 문의 시스템을 갖춘 풀 페이지 구성으로, 에이전시의 전문성과 신뢰도를 강조하는 디자인을 적용했습니다.',
    tags: ['브랜드', 'Rails'],
    color: '#10b981',
    year: '2025',
    url: 'https://bizonmarketing.co.kr',
    points: ['서비스 소개 · 포트폴리오 섹션', '문의 폼 이메일 연동', '반응형 기업 사이트'],
  },
  {
    id: 4,
    slug: 'cpr',
    title: 'CPR마케팅',
    category: '기업',
    desc: 'SNS 마케팅 전문 에이전시 홈페이지',
    fullDesc: 'SNS 마케팅 전문 에이전시 CPR의 홈페이지를 제작했습니다. 주요 서비스와 성과 지표를 강조하는 레이아웃으로 잠재 고객의 신뢰를 높이는 데 집중했습니다.',
    tags: ['브랜드'],
    color: '#ef4444',
    year: '2025',
    url: 'https://cprmarketing.co.kr',
    points: ['SNS 마케팅 서비스 소개', '성과 지표 시각화 섹션', '빠른 문의 CTA'],
  },
  {
    id: 5,
    slug: 'yahwa',
    title: '야화혼술바',
    category: '기업',
    desc: '혼술 콘셉트 바 브랜드 사이트',
    fullDesc: '혼술 콘셉트의 감성 바 야화의 브랜드 사이트를 FanEasy로 구축했습니다. 브랜드 스토리, 메뉴, 위치 안내를 담았으며 감성적인 다크 톤 디자인으로 브랜드 아이덴티티를 표현했습니다.',
    tags: ['FanEasy', '브랜드'],
    color: '#8b5cf6',
    year: '2025',
    url: 'https://yahwabar.com',
    points: ['브랜드 스토리텔링 디자인', '메뉴 · 위치 안내 페이지', '감성 다크 테마'],
  },
  {
    id: 6,
    slug: 'nusucheck',
    title: '누수체크',
    category: '앱',
    desc: 'IoT 연동 누수 탐지 서비스',
    fullDesc: 'IoT 센서와 연동되는 누수 탐지 플랫폼의 서비스 랜딩 및 관리자 앱을 개발했습니다. 실시간 알림, 센서 상태 모니터링, 누수 이력 관리 기능을 포함한 풀스택 개발 프로젝트입니다.',
    tags: ['Next.js', '앱', 'IoT'],
    color: '#06b6d4',
    year: '2026',
    url: 'https://nusucheck.com',
    points: ['IoT 센서 실시간 데이터 연동', '누수 알림 · 이력 관리', '서비스 랜딩 + 관리자 대시보드'],
  },
  {
    id: 7,
    slug: 'semophone',
    title: '세모폰',
    category: '앱',
    desc: '중고폰 거래 플랫폼',
    fullDesc: '중고 스마트폰 거래 플랫폼 세모폰의 웹 서비스를 개발했습니다. 기기 시세 조회, 판매 신청, 배송 추적 기능을 갖춘 Next.js 풀스택 앱입니다. 빠른 시세 확인 UX와 신뢰도 높은 거래 프로세스에 집중했습니다.',
    tags: ['Next.js', '커머스'],
    color: '#f97316',
    year: '2026',
    url: 'https://semophone.co.kr',
    points: ['기기 시세 조회 · 판매 신청 플로우', '배송 추적 기능', '빠른 거래 UX'],
  },
  {
    id: 8,
    slug: 'vibefolio',
    title: '바이브폴리오',
    category: '앱',
    desc: '포트폴리오 빌더 SaaS',
    fullDesc: '개발자 · 디자이너를 위한 포트폴리오 빌더 SaaS 바이브폴리오를 기획·개발했습니다. 템플릿 선택, 프로젝트 관리, 커스텀 도메인 연결까지 비개발자도 쉽게 포트폴리오를 만들 수 있는 플랫폼입니다.',
    tags: ['Next.js', 'SaaS'],
    color: '#ec4899',
    year: '2026',
    url: 'https://vibefolio.net',
    points: ['템플릿 기반 포트폴리오 빌더', '커스텀 도메인 연결', '멀티테넌시 SaaS 아키텍처'],
  },
];
