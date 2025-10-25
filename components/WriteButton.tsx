'use client';

import { useRouter } from 'next/navigation';
import styles from './WriteButton.module.css';

export default function WriteButton() {
  const router = useRouter();

  const handleClick = () => {
    // 로그인 체크
    const isLoggedIn = localStorage.getItem('is_logged_in');
    if (!isLoggedIn) {
      router.push('/auth');
      return;
    }

    // 철학 테스트 완료 체크
    const testCompleted = localStorage.getItem('philosophy_test_completed');
    if (!testCompleted) {
      if (confirm('철학 테스트를 먼저 완료해야 글을 작성할 수 있습니다. 테스트 페이지로 이동하시겠습니까?')) {
        router.push('/');
      }
      return;
    }

    router.push('/write');
  };

  return (
    <button
      className={styles.button}
      onClick={handleClick}
      aria-label="글 작성하기"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L12 22M2 12L22 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className={styles.tooltip}>생각 나누기</span>
    </button>
  );
}