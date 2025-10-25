'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './my-posts.module.css';
import PostCard from '@/components/PostCard';
import ProfileDropdown from '@/components/ProfileDropdown';
import { Post } from '@/types';

export default function MyPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // 로그인 체크
    const isLoggedIn = localStorage.getItem('is_logged_in');
    if (!isLoggedIn) {
      router.push('/auth');
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
    setUserEmail(currentUser.email || '');

    // 내가 쓴 글 불러오기 (실제로는 서버에서)
    fetchMyPosts();
  }, [router]);

  const fetchMyPosts = async () => {
    setLoading(true);
    
    // 임시 데이터
    const mockPosts: Post[] = [
      {
        id: 'my1',
        title: '디지털 시대의 자발적 착취',
        content: '성과주의 사회에서 우리는 스스로를 착취하는 주체가 되었습니다. 외부의 강요가 아닌 내면화된 압박이 더 강력합니다.',
        authorType: '균형의 탐구자',
        authorPhilosopher: '한병철',
        createdAt: new Date('2025-01-24T10:30:00'),
        agreeCount: 23,
        disagreeCount: 5,
        userReaction: null,
        philosopherDistribution: {
          agree: { '균형의 탐구자': 10, '성찰의 철학자': 8, '진보의 선구자': 5 },
          disagree: { '자유시장주의자': 3, '실용주의자': 2 }
        }
      },
      {
        id: 'my2',
        title: '무지의 베일과 공정한 사회',
        content: '우리가 자신의 사회적 위치를 모른다면, 어떤 사회 구조를 선택할까요? 최소 수혜자를 보호하는 체계를 선택할 것입니다.',
        authorType: '균형의 탐구자',
        authorPhilosopher: '한병철',
        createdAt: new Date('2025-01-23T14:20:00'),
        agreeCount: 45,
        disagreeCount: 12,
        userReaction: null,
        philosopherDistribution: {
          agree: { '평등의 수호자': 20, '공동체주의자': 15, '균형의 탐구자': 10 },
          disagree: { '자유의 옹호자': 7, '보수주의자': 5 }
        }
      },
      {
        id: 'my3',
        title: '전통과 혁신의 균형점',
        content: '급진적 변화는 사회를 불안정하게 만들지만, 변화 없는 고착은 쇠퇴를 부릅니다. 지혜로운 사회는 둘 사이의 균형을 찾습니다.',
        authorType: '균형의 탐구자',
        authorPhilosopher: '한병철',
        createdAt: new Date('2025-01-22T09:15:00'),
        agreeCount: 31,
        disagreeCount: 8,
        userReaction: null,
        philosopherDistribution: {
          agree: { '균형의 탐구자': 15, '실용주의자': 10, '보수주의자': 6 },
          disagree: { '진보의 선구자': 5, '자유시장주의자': 3 }
        }
      }
    ];

    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 500);
  };

  const handleReaction = async (postId: string, reaction: 'agree' | 'disagree') => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const prevReaction = post.userReaction;
        const newReaction = prevReaction === reaction ? null : reaction;
        
        return {
          ...post,
          userReaction: newReaction,
          agreeCount: post.agreeCount + 
            (newReaction === 'agree' ? 1 : 0) - 
            (prevReaction === 'agree' ? 1 : 0),
          disagreeCount: post.disagreeCount + 
            (newReaction === 'disagree' ? 1 : 0) - 
            (prevReaction === 'disagree' ? 1 : 0)
        };
      }
      return post;
    }));
  };

  const handleBack = () => {
    router.push('/feed');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerTop}>
            <button onClick={handleBack} className={styles.backButton}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M12 16L6 10L12 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              피드로 돌아가기
            </button>
            <ProfileDropdown />
          </div>
          
          <h1 className={styles.title}>내가 쓴 글</h1>
          <p className={styles.subtitle}>
            총 {posts.length}개의 글을 작성하셨습니다
          </p>
        </div>
      </header>

      <main className={styles.main}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>불러오는 중...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className={styles.emptyState}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="8" y="12" width="32" height="4" rx="2" fill="var(--color-neutral)" />
              <rect x="8" y="22" width="32" height="4" rx="2" fill="var(--color-neutral)" />
              <rect x="8" y="32" width="24" height="4" rx="2" fill="var(--color-neutral)" />
            </svg>
            <p>아직 작성한 글이 없습니다</p>
            <button onClick={() => router.push('/write')} className={styles.writeButton}>
              첫 글 작성하기
            </button>
          </div>
        ) : (
          <div className={styles.postList}>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>총 동의</span>
                <span className={styles.statValue}>
                  {posts.reduce((sum, post) => sum + post.agreeCount, 0)}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>총 다른의견</span>
                <span className={styles.statValue}>
                  {posts.reduce((sum, post) => sum + post.disagreeCount, 0)}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>평균 반응</span>
                <span className={styles.statValue}>
                  {Math.round(
                    posts.reduce((sum, post) => sum + post.agreeCount + post.disagreeCount, 0) / 
                    posts.length
                  )}
                </span>
              </div>
            </div>

            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onReaction={handleReaction}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}