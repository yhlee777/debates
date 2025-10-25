@echo off
echo ======================================
echo 🚀 일상속의 철학자들 프로젝트 시작하기
echo ======================================

REM Node.js 버전 확인
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✓ Node.js 버전: %NODE_VERSION%

REM npm 버전 확인
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✓ npm 버전: %NPM_VERSION%

REM 의존성 설치 확인
if not exist "node_modules" (
    echo.
    echo 📦 패키지 설치 중...
    call npm install
) else (
    echo ✓ 패키지 이미 설치됨
)

REM 환경 변수 파일 확인
if not exist ".env.local" (
    echo.
    echo ⚠️  환경 변수 파일이 없습니다!
    echo 📝 .env.local 파일을 생성합니다...
    copy .env.example .env.local
    echo ✓ .env.local 파일 생성 완료
    echo.
    echo ⚠️  중요: .env.local 파일을 열어서 Supabase 정보를 입력해주세요!
    echo    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    echo    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
    echo.
    set /p CONTINUE=환경 변수를 설정하셨나요? (y/n): 
    if /i not "%CONTINUE%"=="y" (
        echo 환경 변수를 설정한 후 다시 실행해주세요.
        pause
        exit /b 1
    )
)

echo.
echo ======================================
echo 🎨 일상속의 철학자들 개발 서버 시작
echo ======================================
echo 브라우저에서 http://localhost:3000 을 열어주세요
echo.
echo 종료하려면 Ctrl+C를 누르세요
echo.

REM 개발 서버 실행
call npm run dev
