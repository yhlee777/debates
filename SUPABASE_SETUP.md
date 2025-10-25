# Supabase 데이터베이스 연결 가이드

이 가이드는 "일상속의 철학자들" 프로젝트를 Supabase 데이터베이스와 연결하는 방법을 설명합니다.

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 로그인
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - Name: `philosophers-daily` (또는 원하는 이름)
   - Database Password: 안전한 비밀번호 생성
   - Region: `Seoul (ap-northeast-2)` 선택 (한국 사용자 대상)
4. "Create new project" 클릭 (약 2분 소요)

## 2. 데이터베이스 스키마 설정

1. Supabase 대시보드에서 좌측 메뉴의 "SQL Editor" 클릭
2. "New query" 클릭
3. `database_schema.sql` 파일의 내용 전체를 복사하여 붙여넣기
4. 우측 상단의 "Run" 버튼 클릭
5. 성공 메시지 확인

## 3. 환경 변수 설정

1. Supabase 대시보드에서 Settings > API 페이지로 이동
2. 다음 정보를 확인:
   - `Project URL`: NEXT_PUBLIC_SUPABASE_URL에 사용
   - `anon public`: NEXT_PUBLIC_SUPABASE_ANON_KEY에 사용

3. 프로젝트 루트에 `.env.local` 파일 생성:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**⚠️ 주의:** `.env.local` 파일은 절대 Git에 커밋하지 마세요!

## 4. 인증 설정 (이메일 인증)

### 기본 설정
1. Supabase 대시보드에서 Authentication > Settings 이동
2. "Enable Email Confirmations" 활성화
3. Site URL 설정:
   - Development: `http://localhost:3000`
   - Production: 실제 도메인 (예: `https://philosophers-daily.vercel.app`)

### 이메일 템플릿 커스터마이징 (선택사항)
1. Authentication > Email Templates
2. 회원가입 확인 이메일 한국어로 수정:

```html
<h2>일상속의 철학자들에 오신 것을 환영합니다</h2>
<p>아래 링크를 클릭하여 이메일을 인증해주세요:</p>
<p><a href="{{ .ConfirmationURL }}">이메일 인증하기</a></p>
```

## 5. Row Level Security (RLS) 확인

스키마 실행 시 RLS 정책이 자동으로 설정됩니다. 확인하려면:

1. Database > Tables에서 각 테이블 선택
2. "Policies" 탭에서 정책 확인
3. 모든 테이블이 RLS Enabled 상태인지 확인

### RLS 정책 요약
- **users**: 본인 데이터만 조회/수정
- **philosophy_test_results**: 본인 결과만 조회/수정
- **posts**: 모두 조회 가능, 본인 글만 작성/수정/삭제
- **reactions**: 모두 조회 가능, 본인 반응만 추가/수정/삭제

## 6. 파일 구조

프로젝트에 추가된 파일들:

```
📁 lib/
  📄 supabase.ts          # Supabase 클라이언트 설정
  📁 api/
    📄 auth.ts            # 인증 API
    📄 philosophy.ts      # 철학 테스트 API
    📄 posts.ts           # 게시글 API
    📄 reactions.ts       # 반응 API
  📁 hooks/
    📄 useAuth.ts         # 인증 Hook
    📄 usePosts.ts        # 게시글 Hooks
    📄 useReactions.ts    # 반응 Hooks

📁 types/
  📄 database.ts          # 데이터베이스 타입 정의

📄 database_schema.sql    # 데이터베이스 스키마
```

## 7. 테스트

### 데이터베이스 연결 테스트

개발 서버를 실행한 후:

```bash
npm run dev
```

브라우저 콘솔에서 다음 코드로 연결 테스트:

```javascript
// 브라우저 개발자 도구 콘솔에서 실행
import { supabase } from '@/lib/supabase';

// 연결 테스트
const { data, error } = await supabase.from('users').select('count');
console.log('연결 성공:', data);
```

### 회원가입 테스트

1. `/auth` 페이지로 이동
2. 이메일과 비밀번호로 회원가입
3. 이메일 인증 링크 클릭
4. 철학 테스트 진행
5. Supabase 대시보드 > Table Editor에서 데이터 확인

## 8. 프로덕션 배포

### Vercel 배포 시

1. Vercel 대시보드에서 프로젝트 선택
2. Settings > Environment Variables
3. 환경 변수 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Redeploy

### Site URL 업데이트

1. Supabase 대시보드 > Authentication > URL Configuration
2. Site URL을 프로덕션 도메인으로 변경
3. Redirect URLs에 다음 추가:
   - `https://your-domain.com/auth/callback`
   - `https://your-domain.com/auth/reset-password`

## 9. 보안 체크리스트

- [ ] `.env.local`이 `.gitignore`에 포함되어 있는지 확인
- [ ] Supabase Service Role Key는 절대 클라이언트에 노출하지 않기
- [ ] RLS 정책이 모든 테이블에 적용되어 있는지 확인
- [ ] 이메일 인증이 활성화되어 있는지 확인
- [ ] 프로덕션 Site URL이 올바르게 설정되어 있는지 확인

## 10. 문제 해결

### "Failed to fetch" 오류
- 환경 변수가 올바르게 설정되었는지 확인
- Supabase 프로젝트가 활성화되어 있는지 확인
- 브라우저 콘솔에서 CORS 오류 확인

### RLS 정책 오류
- Supabase 대시보드 > Database > Policies에서 정책 확인
- 로그인 상태인지 확인
- `auth.uid()`가 올바른 사용자 ID를 반환하는지 확인

### 이메일 인증이 안 됨
- Supabase 대시보드 > Authentication > Settings 확인
- 스팸 폴더 확인
- Site URL이 올바른지 확인

## 11. 추가 리소스

- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase + Next.js 가이드](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [Supabase Auth 가이드](https://supabase.com/docs/guides/auth)
- [Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security)

## 12. 샘플 데이터 추가 (선택사항)

테스트용 샘플 데이터를 추가하려면 Supabase SQL Editor에서 다음 실행:

```sql
-- 샘플 사용자 (Supabase Auth를 통해 실제 회원가입 필요)
-- 아래는 참고용 구조

-- 샘플 게시글 추가
INSERT INTO posts (user_id, title, content, author_type, author_philosopher)
VALUES 
  ('user-uuid-1', '피로사회의 자발적 착취', '디지털 시대의 피로사회에서...', '성찰의 철학자', '한병철'),
  ('user-uuid-2', '주거는 기본권인가', '주거는 기본권입니다...', '평등의 수호자', '롤스');
```

---

**다음 단계:** 컴포넌트들을 Supabase API와 연결하여 실제 데이터를 사용하도록 업데이트
