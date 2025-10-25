'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './auth.module.css';

type AuthMode = 'login' | 'register' | 'verify';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 이메일 유효성 검사
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // 회원가입 처리
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      // 실제로는 서버에 요청
      // const response = await fetch('/api/auth/register', { ... });
      
      // 임시: localStorage에 저장 (실제로는 서버에서 처리)
      const tempUser = {
        email,
        password: btoa(password), // 임시 인코딩 (실제로는 서버에서 해싱)
        verified: false,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('temp_user', JSON.stringify(tempUser));
      
      // 인증 코드 생성 (실제로는 이메일로 전송)
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem('verification_code', code);
      
      console.log('인증 코드 (개발용):', code);
      alert(`인증 코드: ${code}\n(실제 서비스에서는 이메일로 전송됩니다)`);
      
      setMode('verify');
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 이메일 인증 처리
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const storedCode = localStorage.getItem('verification_code');
      
      if (verificationCode !== storedCode) {
        setError('인증 코드가 올바르지 않습니다.');
        setLoading(false);
        return;
      }

      // 인증 완료 처리
      const tempUser = JSON.parse(localStorage.getItem('temp_user') || '{}');
      tempUser.verified = true;
      
      // 실제로는 서버에 저장
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push({
        ...tempUser,
        id: Date.now().toString(),
        philosopherType: null
      });
      localStorage.setItem('users', JSON.stringify(users));
      
      // 자동 로그인 (쿠키 설정)
      const setCookie = (name: string, value: string, days: number = 30) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
      };
      
      localStorage.setItem('current_user', JSON.stringify({
        email: tempUser.email,
        id: Date.now().toString()
      }));
      
      localStorage.setItem('is_logged_in', 'true');
      setCookie('is_logged_in', 'true', 30); // 30일 유지
      setCookie('user_email', tempUser.email, 30);
      localStorage.removeItem('temp_user');
      localStorage.removeItem('verification_code');
      
      // 철학 테스트 페이지로 이동
      router.push('/');
    } catch (err) {
      setError('인증 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 로그인 처리
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    setLoading(true);

    try {
      // 실제로는 서버에 인증 요청
      // const response = await fetch('/api/auth/login', { ... });
      
      // 임시: localStorage에서 확인
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => 
        u.email === email && atob(u.password) === password
      );
      
      if (!user) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        setLoading(false);
        return;
      }

      // 로그인 성공 (쿠키 설정)
      const setCookie = (name: string, value: string, days: number = 30) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
      };
      
      localStorage.setItem('current_user', JSON.stringify({
        email: user.email,
        id: user.id,
        philosopherType: user.philosopherType
      }));
      
      localStorage.setItem('is_logged_in', 'true');
      setCookie('is_logged_in', 'true', 30); // 30일 유지
      setCookie('user_email', user.email, 30);
      
      // 철학 테스트 완료 여부 확인
      if (user.philosopherType) {
        localStorage.setItem('philosophy_test_completed', 'true');
        localStorage.setItem('philosopher_type', JSON.stringify(user.philosopherType));
        router.push('/feed');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>일상속의 철학자들</h1>
          <p className={styles.subtitle}>온라인에서도 대화는 가능하다</p>
        </div>

        {mode === 'login' && (
          <form onSubmit={handleLogin} className={styles.form}>
            <h2 className={styles.formTitle}>로그인</h2>
            
            <div className={styles.inputGroup}>
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </button>

            <p className={styles.switchMode}>
              계정이 없으신가요?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className={styles.linkButton}
              >
                회원가입
              </button>
            </p>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister} className={styles.form}>
            <h2 className={styles.formTitle}>회원가입</h2>
            
            <div className={styles.inputGroup}>
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={loading}
              />
              <small className={styles.hint}>
                인증 코드가 이메일로 전송됩니다
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="최소 6자 이상"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? '처리 중...' : '인증 코드 받기'}
            </button>

            <p className={styles.switchMode}>
              이미 계정이 있으신가요?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className={styles.linkButton}
              >
                로그인
              </button>
            </p>
          </form>
        )}

        {mode === 'verify' && (
          <form onSubmit={handleVerify} className={styles.form}>
            <h2 className={styles.formTitle}>이메일 인증</h2>
            
            <p className={styles.verifyText}>
              {email}로 전송된 6자리 인증 코드를 입력해주세요
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="code">인증 코드</label>
              <input
                type="text"
                id="code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                required
                disabled={loading}
                className={styles.codeInput}
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? '인증 중...' : '인증 완료'}
            </button>

            <p className={styles.switchMode}>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className={styles.linkButton}
              >
                ← 이메일 다시 입력
              </button>
            </p>
          </form>
        )}

        <div className={styles.notice}>
          <p>최소한의 정보만 수집하며, 광고나 마케팅 목적으로 사용하지 않습니다.</p>
        </div>
      </div>
    </div>
  );
}