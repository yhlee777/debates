'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ProfileDropdown.module.css';
import { PhilosopherType } from '@/types';

export default function ProfileDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [philosopher, setPhilosopher] = useState<PhilosopherType | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 사용자 정보 가져오기
    const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
    const philosopherType = JSON.parse(localStorage.getItem('philosopher_type') || '{}');
    
    setUserEmail(currentUser.email || '');
    setPhilosopher(philosopherType);

    // 클릭 외부 감지
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      // 쿠키 삭제
      document.cookie = 'is_logged_in=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
      document.cookie = 'user_email=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
      
      // localStorage 삭제
      localStorage.removeItem('is_logged_in');
      localStorage.removeItem('current_user');
      localStorage.removeItem('philosophy_test_completed');
      localStorage.removeItem('philosopher_type');
      
      window.location.href = '/auth';
    }
  };

  const handleRetest = () => {
    if (confirm('철학 테스트를 다시 하시겠습니까?')) {
      localStorage.removeItem('philosophy_test_completed');
      localStorage.removeItem('philosopher_type');
      window.location.href = '/';
    }
  };

  const handleMyPosts = () => {
    router.push('/my-posts');
    setIsOpen(false);
  };

  const handlePhilosopherInfo = () => {
    router.push('/result');
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.profileButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="프로필 메뉴"
      >
        <div className={styles.avatar}>
          {userEmail.charAt(0).toUpperCase()}
        </div>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronUp : ''}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M3 5L6 8L9 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.userInfo}>
            <div className={styles.email}>{userEmail}</div>
            {philosopher && (
              <div className={styles.philosopherInfo}>
                <span className={styles.philosopherType}>{philosopher.type}</span>
                <span className={styles.philosopherName}>{philosopher.philosopher}</span>
              </div>
            )}
          </div>

          <div className={styles.divider}></div>

          <button className={styles.menuItem} onClick={handlePhilosopherInfo}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className={styles.icon}
            >
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M4 13C4 11 5.79 9.5 8 9.5C10.21 9.5 12 11 12 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            내 철학자 정보
          </button>

          <button className={styles.menuItem} onClick={handleMyPosts}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className={styles.icon}
            >
              <rect x="2" y="3" width="12" height="2" rx="1" fill="currentColor" />
              <rect x="2" y="7" width="12" height="2" rx="1" fill="currentColor" />
              <rect x="2" y="11" width="8" height="2" rx="1" fill="currentColor" />
            </svg>
            내가 쓴 글
          </button>

          <button className={styles.menuItem} onClick={handleRetest}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className={styles.icon}
            >
              <path
                d="M2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C5.5 14 3.5 12.5 2.5 10.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M2 5V8H5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            철학 재테스트
          </button>

          <div className={styles.divider}></div>

          <button className={`${styles.menuItem} ${styles.logout}`} onClick={handleLogout}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className={styles.icon}
            >
              <path
                d="M6 14H3C2.44772 14 2 13.5523 2 13V3C2 2.44772 2.44772 2 3 2H6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M11 11L14 8L11 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 8H6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}