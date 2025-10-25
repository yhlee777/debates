# localStorage에서 Supabase로 마이그레이션 가이드

이 문서는 현재 localStorage를 사용하는 코드를 Supabase로 마이그레이션하는 방법을 설명합니다.

## 📋 마이그레이션 체크리스트

### 1단계: Supabase 설정 (완료)
- [x] Supabase 프로젝트 생성
- [x] 데이터베이스 스키마 실행
- [x] 환경 변수 설정
- [x] API 서비스 레이어 구현
- [x] React Hooks 구현

### 2단계: 컴포넌트 업데이트
다음 컴포넌트들을 Supabase API를 사용하도록 업데이트해야 합니다:

#### 인증 관련
- [ ] `app/auth/page.tsx` - 회원가입/로그인
  ```typescript
  // 기존: localStorage 사용
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // 변경: Supabase API 사용
  import { signUp, signIn } from '@/lib/api/auth';
  await signUp({ email, password });
  ```

#### 철학 테스트
- [ ] `components/PhilosophyTest.tsx` - 테스트 결과 저장
  ```typescript
  // 기존: localStorage 사용
  localStorage.setItem('philosopher_type', JSON.stringify(result));
  
  // 변경: Supabase API 사용
  import { saveTestResult } from '@/lib/api/philosophy';
  await saveTestResult({
    userId: user.id,
    answers,
    dimensions,
    philosopherType,
    matchedPhilosopher,
    matchPercentage,
  });
  ```

#### 메인 피드
- [ ] `components/MainFeed.tsx` - 게시글 목록 조회
  ```typescript
  // 기존: 하드코딩된 mock 데이터
  const mockPosts = [...];
  
  // 변경: Supabase Hook 사용
  import { usePosts } from '@/lib/hooks/usePosts';
  const { posts, loading } = usePosts();
  ```

#### 게시글 작성
- [ ] `app/write/page.tsx` - 글 작성
  ```typescript
  // 기존: localStorage 사용
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  posts.push(newPost);
  localStorage.setItem('posts', JSON.stringify(posts));
  
  // 변경: Supabase API 사용
  import { createPost } from '@/lib/api/posts';
  await createPost({
    userId: user.id,
    title,
    content,
    authorType,
    authorPhilosopher,
  });
  ```

#### 게시글 상세
- [ ] `app/post/[id]/page.tsx` - 글 상세 조회
  ```typescript
  // 기존: localStorage에서 찾기
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  const post = posts.find(p => p.id === id);
  
  // 변경: Supabase Hook 사용
  import { usePost } from '@/lib/hooks/usePosts';
  const { post, loading } = usePost(postId);
  ```

#### 반응 (동의/다른의견)
- [ ] `components/PostCard.tsx` - 반응 추가/변경
  ```typescript
  // 기존: 상태로만 관리
  const [userReaction, setUserReaction] = useState(null);
  
  // 변경: Supabase Hook 사용
  import { useReactionToggle } from '@/lib/hooks/useReactions';
  const { toggleReaction, currentReaction } = useReactionToggle(
    postId,
    userType,
    userPhilosopher
  );
  ```

#### 프로필
- [ ] `components/ProfileDropdown.tsx` - 사용자 정보
  ```typescript
  // 기존: localStorage 사용
  const user = JSON.parse(localStorage.getItem('current_user') || '{}');
  
  // 변경: useAuth Hook 사용
  import { useAuth } from '@/lib/hooks/useAuth';
  const { user } = useAuth();
  ```

## 🔄 컴포넌트별 마이그레이션 예시

### 1. 인증 페이지 (app/auth/page.tsx)

```typescript
// 기존 코드
const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const newUser = {
    id: Date.now().toString(),
    email,
    password: btoa(password),
  };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  router.push('/');
};

// 새 코드
import { signUp } from '@/lib/api/auth';
import { getErrorMessage } from '@/lib/utils';

const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    await signUp({ email, password });
    // 이메일 인증 안내
    setMessage('가입 확인 이메일을 발송했습니다. 이메일을 확인해주세요.');
  } catch (error) {
    setError(getErrorMessage(error));
  } finally {
    setLoading(false);
  }
};
```

### 2. 철학 테스트 (components/PhilosophyTest.tsx)

```typescript
// 기존 코드
const handleComplete = () => {
  const result = calculateResult(answers);
  localStorage.setItem('philosophy_test_completed', 'true');
  localStorage.setItem('philosopher_type', JSON.stringify(result));
  onComplete();
};

// 새 코드
import { saveTestResult } from '@/lib/api/philosophy';
import { useAuth } from '@/lib/hooks/useAuth';

const handleComplete = async () => {
  const { user } = useAuth();
  const dimensions = calculatePhilosophicalDimensions(answers);
  const match = matchPhilosopher(dimensions);
  
  try {
    await saveTestResult({
      userId: user!.id,
      answers,
      dimensions,
      philosopherType: match.type,
      matchedPhilosopher: match.philosopher,
      matchPercentage: match.match,
      rivalPhilosopher: match.rival?.philosopher,
      rivalPercentage: match.rival?.match,
    });
    
    onComplete();
  } catch (error) {
    console.error('테스트 결과 저장 실패:', error);
    alert('결과 저장 중 오류가 발생했습니다.');
  }
};
```

### 3. 메인 피드 (components/MainFeed.tsx)

```typescript
// 기존 코드
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const mockPosts = [...]; // 하드코딩
  setPosts(mockPosts);
  setLoading(false);
}, []);

// 새 코드
import { usePosts, useDialoguePosts, useSameTypePosts } from '@/lib/hooks/usePosts';
import { useAuth } from '@/lib/hooks/useAuth';
import { getTestResult } from '@/lib/api/philosophy';

const { user } = useAuth();
const [filter, setFilter] = useState('recent');
const [philosophyResult, setPhilosophyResult] = useState(null);

useEffect(() => {
  if (user) {
    getTestResult(user.id).then(setPhilosophyResult);
  }
}, [user]);

const { posts: recentPosts, loading: recentLoading } = usePosts();
const { posts: dialoguePosts, loading: dialogueLoading } = useDialoguePosts();
const { posts: myTypePosts, loading: myTypeLoading } = useSameTypePosts(
  philosophyResult?.philosopher_type || null
);

const posts = filter === 'recent' ? recentPosts 
  : filter === 'dialogue' ? dialoguePosts 
  : myTypePosts;

const loading = filter === 'recent' ? recentLoading 
  : filter === 'dialogue' ? dialogueLoading 
  : myTypeLoading;
```

### 4. 게시글 작성 (app/write/page.tsx)

```typescript
// 기존 코드
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const newPost = {
    id: Date.now().toString(),
    title,
    content,
    authorType: userType,
    authorPhilosopher: userPhilosopher,
    createdAt: new Date(),
    agreeCount: 0,
    disagreeCount: 0,
  };
  
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  posts.unshift(newPost);
  localStorage.setItem('posts', JSON.stringify(posts));
  
  router.push('/feed');
};

// 새 코드
import { createPost } from '@/lib/api/posts';
import { useAuth } from '@/lib/hooks/useAuth';
import { getTestResult } from '@/lib/api/philosophy';

const { user } = useAuth();
const [philosophyResult, setPhilosophyResult] = useState(null);

useEffect(() => {
  if (user) {
    getTestResult(user.id).then(setPhilosophyResult);
  }
}, [user]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    await createPost({
      userId: user!.id,
      title,
      content,
      authorType: philosophyResult!.philosopher_type,
      authorPhilosopher: philosophyResult!.matched_philosopher,
    });
    
    router.push('/feed');
  } catch (error) {
    console.error('글 작성 실패:', error);
    alert('글 작성 중 오류가 발생했습니다.');
  } finally {
    setLoading(false);
  }
};
```

### 5. 반응 처리 (components/PostCard.tsx)

```typescript
// 기존 코드
const [userReaction, setUserReaction] = useState(null);

const handleReaction = (type: 'agree' | 'disagree') => {
  setUserReaction(prev => prev === type ? null : type);
  // 로컬 상태만 업데이트
};

// 새 코드
import { useReactionToggle } from '@/lib/hooks/useReactions';

const { toggleReaction, currentReaction } = useReactionToggle(
  post.id,
  userType,
  userPhilosopher
);

const handleReaction = async (type: 'agree' | 'disagree') => {
  try {
    await toggleReaction(type);
  } catch (error) {
    console.error('반응 처리 실패:', error);
    alert('반응을 처리하는 중 오류가 발생했습니다.');
  }
};
```

## 🗑️ 제거할 코드

마이그레이션 완료 후 다음 코드들을 제거할 수 있습니다:

1. **localStorage 관련 코드**
   ```typescript
   // 모든 localStorage.getItem, setItem, removeItem 호출
   localStorage.getItem('users');
   localStorage.setItem('posts', ...);
   localStorage.removeItem('current_user');
   ```

2. **Mock 데이터**
   ```typescript
   // 하드코딩된 샘플 데이터
   const mockPosts = [...];
   const mockUsers = [...];
   ```

3. **수동 쿠키 관리**
   ```typescript
   // Supabase Auth가 자동으로 처리
   document.cookie = 'is_logged_in=...';
   ```

## 🧪 테스트 방법

마이그레이션 후 다음 시나리오를 테스트하세요:

1. **회원가입 & 로그인**
   - [ ] 이메일로 회원가입
   - [ ] 이메일 인증 링크 클릭
   - [ ] 로그인/로그아웃

2. **철학 테스트**
   - [ ] 테스트 진행 및 결과 저장
   - [ ] 재테스트 기능

3. **게시글**
   - [ ] 글 작성
   - [ ] 글 목록 조회 (최신순, 대화순, 같은 유형)
   - [ ] 글 상세 조회
   - [ ] 글 수정/삭제

4. **반응**
   - [ ] 동의/다른의견 추가
   - [ ] 반응 변경
   - [ ] 반응 취소
   - [ ] 반응 통계 조회

5. **다중 브라우저/기기**
   - [ ] 한 기기에서 로그인, 다른 기기에서도 동기화 확인
   - [ ] 세션 만료 처리

## ⚠️ 주의사항

1. **환경 변수 보안**
   - `.env.local` 파일을 절대 Git에 커밋하지 마세요
   - Service Role Key는 서버 사이드에서만 사용

2. **RLS 정책 확인**
   - 모든 테이블에 RLS가 활성화되어 있는지 확인
   - 사용자가 본인 데이터만 수정할 수 있는지 테스트

3. **에러 처리**
   - 네트워크 오류 처리
   - 인증 만료 처리
   - 사용자 친화적인 에러 메시지

4. **성능 최적화**
   - SWR의 캐싱 활용
   - 불필요한 리렌더링 방지
   - 페이지네이션 구현 (대량 데이터 시)

## 📚 추가 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [SWR 문서](https://swr.vercel.app/ko)
- [Next.js + Supabase 가이드](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
