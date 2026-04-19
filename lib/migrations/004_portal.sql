-- 004_portal.sql
-- 디랩 클라이언트 포털: 계정, 크레딧, 상품, 주문, 문의, 포트폴리오

-- 1. 클라이언트 계정
CREATE TABLE IF NOT EXISTS collab.clients (
  id            SERIAL       PRIMARY KEY,
  entity_id     INTEGER      REFERENCES collab.entities(id),
  login_id      VARCHAR(64)  UNIQUE NOT NULL,
  password_hash VARCHAR(256) NOT NULL,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(200),
  phone         VARCHAR(20),
  role          VARCHAR(20)  DEFAULT 'client',
  credits       INTEGER      DEFAULT 0,
  is_active     BOOLEAN      DEFAULT true,
  last_login    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- 2. 크레딧 거래 내역
CREATE TABLE IF NOT EXISTS collab.credit_transactions (
  id            SERIAL       PRIMARY KEY,
  client_id     INTEGER      NOT NULL REFERENCES collab.clients(id),
  type          VARCHAR(20)  NOT NULL,
  amount        INTEGER      NOT NULL,
  balance_after INTEGER      NOT NULL,
  description   VARCHAR(300),
  reference_id  VARCHAR(128),
  created_by    INTEGER,
  created_at    TIMESTAMPTZ  DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_credit_tx_client ON collab.credit_transactions(client_id);

-- 3. 상품 카탈로그
CREATE TABLE IF NOT EXISTS collab.products (
  id            SERIAL       PRIMARY KEY,
  slug          VARCHAR(64)  UNIQUE NOT NULL,
  name          VARCHAR(100) NOT NULL,
  category      VARCHAR(40),
  description   TEXT,
  price         INTEGER      NOT NULL,
  duration_days INTEGER,
  is_active     BOOLEAN      DEFAULT true,
  sort_order    INTEGER      DEFAULT 0,
  created_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- 4. 주문
CREATE TABLE IF NOT EXISTS collab.orders (
  id            SERIAL       PRIMARY KEY,
  client_id     INTEGER      NOT NULL REFERENCES collab.clients(id),
  product_id    INTEGER      NOT NULL REFERENCES collab.products(id),
  status        VARCHAR(20)  DEFAULT 'pending',
  price         INTEGER      NOT NULL,
  requirements  TEXT,
  started_at    DATE,
  completed_at  DATE,
  created_at    TIMESTAMPTZ  DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_orders_client ON collab.orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON collab.orders(status);

-- 5. 주문 코멘트
CREATE TABLE IF NOT EXISTS collab.order_comments (
  id            SERIAL       PRIMARY KEY,
  order_id      INTEGER      NOT NULL REFERENCES collab.orders(id),
  client_id     INTEGER      NOT NULL REFERENCES collab.clients(id),
  content       TEXT         NOT NULL,
  attachment_url VARCHAR(500),
  created_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- 6. 외주 요청 (비회원)
CREATE TABLE IF NOT EXISTS collab.inquiries (
  id            SERIAL       PRIMARY KEY,
  company_name  VARCHAR(100),
  contact_name  VARCHAR(50)  NOT NULL,
  email         VARCHAR(200) NOT NULL,
  phone         VARCHAR(20),
  category      VARCHAR(40),
  budget_range  VARCHAR(40),
  description   TEXT         NOT NULL,
  status        VARCHAR(20)  DEFAULT 'new',
  created_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- 7. 포트폴리오
CREATE TABLE IF NOT EXISTS collab.portfolio (
  id            SERIAL       PRIMARY KEY,
  title         VARCHAR(200) NOT NULL,
  category      VARCHAR(40),
  client_name   VARCHAR(100),
  description   TEXT,
  image_url     VARCHAR(500),
  link_url      VARCHAR(500),
  tags          TEXT[],
  is_featured   BOOLEAN      DEFAULT false,
  sort_order    INTEGER      DEFAULT 0,
  created_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- 기본 상품 데이터
INSERT INTO collab.products (slug, name, category, description, price, duration_days, sort_order) VALUES
  ('landing-page', '랜딩페이지 제작', 'web', '반응형 원페이지 랜딩 사이트', 300, 14, 1),
  ('brand-site', '브랜드 사이트', 'web', '기업/브랜드 소개 웹사이트 (5페이지 이내)', 800, 30, 2),
  ('web-app', '웹 애플리케이션', 'web', '풀스택 웹앱 (관리자 포함)', 2000, 60, 3),
  ('brand-identity', '브랜드 아이덴티티', 'design', 'BI/CI 디자인 + 가이드라인', 500, 21, 4),
  ('ui-ux-design', 'UI/UX 디자인', 'design', '앱/웹 UI 디자인 (피그마)', 600, 21, 5),
  ('sns-marketing', 'SNS 마케팅', 'marketing', '인스타그램/유튜브 콘텐츠 운영 (월)', 200, 30, 6),
  ('seo-aeo', 'SEO/AEO 최적화', 'marketing', '검색엔진 + AI엔진 최적화', 400, 30, 7),
  ('ai-integration', 'AI 기능 통합', 'ai', 'AI 챗봇/자동화 기능 도입', 1000, 30, 8),
  ('consulting', '기술 컨설팅', 'consulting', '아키텍처 설계 + 기술 자문 (회)', 150, 1, 9)
ON CONFLICT (slug) DO NOTHING;
