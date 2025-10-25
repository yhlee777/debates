-- 일상속의 철학자들 데이터베이스 스키마
-- Supabase SQL Editor에서 실행하세요

-- ============================================
-- 1. Users 테이블 (인증은 Supabase Auth 사용)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- 2. Philosophy Test Results 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS philosophy_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- 테스트 답변 (JSON 배열로 저장)
  answers JSONB NOT NULL,
  
  -- 계산된 차원 점수
  moral_reasoning INTEGER NOT NULL, -- -100 (의무론) ~ +100 (결과론)
  distributive_justice INTEGER NOT NULL, -- -100 (평등) ~ +100 (자유)
  change_orientation INTEGER NOT NULL, -- -100 (보수) ~ +100 (진보)
  
  -- 매칭된 철학자 정보
  philosopher_type TEXT NOT NULL, -- 예: "균형의 탐구자"
  matched_philosopher TEXT NOT NULL, -- 예: "한병철"
  match_percentage INTEGER NOT NULL, -- 0-100
  
  -- 정반대 철학자
  rival_philosopher TEXT,
  rival_percentage INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 한 사용자당 하나의 최신 결과만 유지 (재테스트 시 덮어쓰기)
  UNIQUE(user_id)
);

-- Philosophy Test Results 인덱스
CREATE INDEX IF NOT EXISTS idx_test_results_user ON philosophy_test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_type ON philosophy_test_results(philosopher_type);

-- ============================================
-- 3. Posts 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- 글 내용
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  
  -- 작성자의 철학 정보 (작성 시점 스냅샷)
  author_type TEXT NOT NULL,
  author_philosopher TEXT NOT NULL,
  
  -- 반응 카운트
  agree_count INTEGER DEFAULT 0,
  disagree_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 검색을 위한 전문 검색 인덱스
  tsv tsvector GENERATED ALWAYS AS (to_tsvector('korean', title || ' ' || content)) STORED
);

-- Posts 인덱스
CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author_type ON posts(author_type);
CREATE INDEX IF NOT EXISTS idx_posts_tsv ON posts USING GIN(tsv);

-- ============================================
-- 4. Reactions 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  
  -- 반응 유형
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('agree', 'disagree')),
  
  -- 반응한 사용자의 철학 정보 (반응 시점 스냅샷)
  user_type TEXT NOT NULL,
  user_philosopher TEXT NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 한 사용자는 한 글에 하나의 반응만 가능
  UNIQUE(user_id, post_id)
);

-- Reactions 인덱스
CREATE INDEX IF NOT EXISTS idx_reactions_user ON reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_reactions_post ON reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_reactions_type ON reactions(reaction_type);

-- ============================================
-- 5. Functions (자동 업데이트)
-- ============================================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Posts 테이블에 트리거 적용
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Users 테이블에 트리거 적용
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. Reaction Count 자동 업데이트
-- ============================================

-- Reaction 추가/삭제/변경 시 Posts의 카운트 자동 업데이트
CREATE OR REPLACE FUNCTION update_post_reaction_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- 새 반응 추가
    IF NEW.reaction_type = 'agree' THEN
      UPDATE posts SET agree_count = agree_count + 1 WHERE id = NEW.post_id;
    ELSE
      UPDATE posts SET disagree_count = disagree_count + 1 WHERE id = NEW.post_id;
    END IF;
    RETURN NEW;
    
  ELSIF TG_OP = 'UPDATE' THEN
    -- 반응 변경
    IF OLD.reaction_type = 'agree' AND NEW.reaction_type = 'disagree' THEN
      UPDATE posts 
      SET agree_count = agree_count - 1, disagree_count = disagree_count + 1 
      WHERE id = NEW.post_id;
    ELSIF OLD.reaction_type = 'disagree' AND NEW.reaction_type = 'agree' THEN
      UPDATE posts 
      SET agree_count = agree_count + 1, disagree_count = disagree_count - 1 
      WHERE id = NEW.post_id;
    END IF;
    RETURN NEW;
    
  ELSIF TG_OP = 'DELETE' THEN
    -- 반응 삭제
    IF OLD.reaction_type = 'agree' THEN
      UPDATE posts SET agree_count = agree_count - 1 WHERE id = OLD.post_id;
    ELSE
      UPDATE posts SET disagree_count = disagree_count - 1 WHERE id = OLD.post_id;
    END IF;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Reactions 테이블에 트리거 적용
DROP TRIGGER IF EXISTS update_reaction_counts ON reactions;
CREATE TRIGGER update_reaction_counts
  AFTER INSERT OR UPDATE OR DELETE ON reactions
  FOR EACH ROW
  EXECUTE FUNCTION update_post_reaction_counts();

-- ============================================
-- 7. Row Level Security (RLS) 정책
-- ============================================

-- RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE philosophy_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- Users: 본인 정보만 조회/수정 가능
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Philosophy Test Results: 본인 결과만 조회/생성/수정 가능
CREATE POLICY "Users can view own test results" ON philosophy_test_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own test results" ON philosophy_test_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own test results" ON philosophy_test_results
  FOR UPDATE USING (auth.uid() = user_id);

-- Posts: 모든 사용자가 조회 가능, 본인 글만 생성/수정/삭제 가능
CREATE POLICY "Anyone can view posts" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);

-- Reactions: 모든 사용자가 조회 가능, 본인 반응만 생성/수정/삭제 가능
CREATE POLICY "Anyone can view reactions" ON reactions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own reactions" ON reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reactions" ON reactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reactions" ON reactions
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 8. Views (편의성을 위한 뷰)
-- ============================================

-- 글과 작성자 철학 정보를 함께 조회하는 뷰
CREATE OR REPLACE VIEW posts_with_author AS
SELECT 
  p.*,
  ptr.philosopher_type,
  ptr.matched_philosopher,
  ptr.match_percentage
FROM posts p
LEFT JOIN philosophy_test_results ptr ON p.user_id = ptr.user_id;

-- 반응 통계 뷰
CREATE OR REPLACE VIEW reaction_statistics AS
SELECT 
  post_id,
  reaction_type,
  user_type,
  COUNT(*) as count
FROM reactions
GROUP BY post_id, reaction_type, user_type;

-- ============================================
-- 9. 샘플 데이터 (개발용)
-- ============================================

-- 철학자 유형 27가지 목록 (참고용)
/*
철학자 유형 27가지:
1. 평등의 수호자 (롤스형) - 평등주의 + 결과론 + 진보
2. 사회적 선구자 (센형) - 평등주의 + 결과론 + 중도
3. 공정한 보수주의자 - 평등주의 + 결과론 + 보수
4. 전통적 평등주의자 - 평등주의 + 의무론 + 진보
5. 공동체주의자 (샌델형) - 평등주의 + 의무론 + 중도
6. 보수적 연대주의자 - 평등주의 + 의무론 + 보수
7. 급진적 평등주의자 - 평등주의 + 극단결과론 + 극단진보
8. 자유의지론자 (노직형) - 자유주의 + 결과론 + 진보
9. 실용주의자 (밀형) - 자유주의 + 결과론 + 중도
10. 자유시장주의자 (하이에크형) - 자유주의 + 결과론 + 보수
11. 자유의 옹호자 - 자유주의 + 의무론 + 진보
12. 권리 중심주의자 - 자유주의 + 의무론 + 중도
13. 보수주의자 (버크형) - 자유주의 + 의무론 + 보수
14. 무정부주의자 - 자유주의 + 극단결과론 + 극단진보
15. 균형의 탐구자 - 중도 + 결과론 + 진보
16. 진보적 온건파 - 중도 + 결과론 + 중도
17. 중도 보수주의자 - 중도 + 결과론 + 보수
18. 성찰의 철학자 (한병철형) - 중도 + 의무론 + 진보
19. 실존주의자 - 중도 + 의무론 + 중도
20. 전통 중시형 - 중도 + 의무론 + 보수
21. 사회주의자 - 극단평등 + 결과론 + 극단진보
22. 공리주의자 - 중도 + 극단결과론 + 중도
23. 자유지상주의자 - 극단자유 + 결과론 + 진보
24. 완고한 보수주의자 - 중도 + 의무론 + 극단보수
25. 세계시민주의자 (싱어형) - 평등주의 + 극단결과론 + 진보
26. 의무론적 자유주의자 (칸트형) - 자유주의 + 극단의무론 + 중도
27. 포괄적 철학자 - 모든 차원에서 중도
*/
