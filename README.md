# 일상속의 철학자들 🤔

> "온라인에서도 대화는 가능하다"

싸움이 아닌 대화를 통해 다양한 정치적 관점을 나누는 온라인 플랫폼

## 📋 프로젝트 소개

**일상속의 철학자들**은 극단적인 온라인 정치 토론 문화를 개선하기 위한 새로운 형태의 대화 플랫폼입니다.

### 핵심 특징
- 🚫 **댓글 없는 시스템** - 싸움과 인신공격 원천 차단
- 🎭 **철학자 매칭** - 정치 성향을 철학적 관점으로 재해석
- 📊 **반응 통계** - 다양한 관점의 분포를 시각적으로 확인
- 🔒 **완전한 익명성** - 철학 유형만 표시, 권위 요소 배제

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.17.0 이상
- npm 9.0.0 이상

### 설치 방법

```bash
# 1. 저장소 클론
git clone https://github.com/your-username/philosophers-in-daily-life.git
cd philosophers-in-daily-life

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 열어서 필요한 값들을 입력

# 4. 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

## 📦 기술 스택

### Frontend
- **Next.js 14** - React 프레임워크
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 스타일링
- **Framer Motion** - 애니메이션
- **date-fns** - 날짜 처리

### Backend (예정)
- **Supabase** - 데이터베이스 및 인증
- **PostgreSQL** - 관계형 데이터베이스

### 개발 도구
- **ESLint** - 코드 린팅
- **Prettier** - 코드 포맷팅
- **SWR** - 데이터 페칭

## 📁 프로젝트 구조

```
philosophers-in-daily-life/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 메인 페이지
│   └── globals.css        # 글로벌 스타일
├── components/            # React 컴포넌트
│   ├── MainFeed.tsx      # 메인 피드
│   ├── PostDetail.tsx    # 글 상세
│   └── PhilosophyTest.tsx # 철학 테스트
├── lib/                   # 유틸리티 함수
├── hooks/                 # React 커스텀 훅
├── types/                 # TypeScript 타입 정의
├── public/                # 정적 파일
└── styles/                # 추가 스타일 파일
```

## 🎨 디자인 시스템

### 색상 팔레트
- **배경**: 따뜻한 오프화이트 (#FAFAF8)
- **텍스트**: 차콜 (#2C2C2C) / 그레이 (#4A4A4A)
- **동의**: 차분한 하늘색 (#6B9BD1)
- **다른의견**: 부드러운 살구색 (#E8B88B)

### 타이포그래피
- **본문**: Noto Sans KR, 16px, 행간 1.8
- **제목**: Noto Serif KR, 품격있는 세리프체

## 🔧 주요 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 코드 린팅
npm run lint

# 타입 체크
npm run type-check

# 코드 포맷팅
npm run format
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 라이선스

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 감사의 말

- 모든 건설적인 대화를 추구하는 시민들
- 온라인 토론 문화 개선을 위해 노력하는 분들

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

---

**"대화는 서로 다른 철학이 만나는 곳에서 시작됩니다"**
"# debates" 
