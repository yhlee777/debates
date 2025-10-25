'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import PostCard from '@/components/PostCard';
import ProfileDropdown from '@/components/ProfileDropdown';
import { useAuth } from '@/lib/hooks/useAuth';
import { getMyPosts } from '@/lib/api/posts';
import { getTestResult } from '@/lib/api/philosophy';
import { Database } from '@/types/database';

type Post = Database['public']['Tables']['posts']['Row'];
type PhilosophyTestResult = Database['public']['Tables']['philosophy_test_results']['Row'];

export default function MyPostsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [philosophyResult, setPhilosophyResult] = useState<PhilosophyTestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
      return;
    }

    if (user) {
      Promise.all([
        getTestResult(user.id),
        getMyPosts(user.id)
      ])
        .then(([result, userPosts]) => {
          setPhilosophyResult(result);
          setPosts(userPosts || []);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  const handleBack = () => {
    router.push('/feed');
  };

  if (authLoading || loading || !user || !philosophyResult) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
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
      </header>

      <main className={styles.main}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>내가 쓴 글</h1>
          <p className={styles.subtitle}>
            {philosophyResult.philosopher_type} · {philosophyResult.matched_philosopher}의 영향을 받은
          </p>
        </div>

        {posts.length === 0 ? (
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
                  {posts.reduce((sum, post) => sum + post.agree_count, 0)}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>총 다른의견</span>
                <span className={styles.statValue}>
                  {posts.reduce((sum, post) => sum + post.disagree_count, 0)}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>평균 반응</span>
                <span className={styles.statValue}>
                  {Math.round(
                    posts.reduce((sum, post) => sum + post.agree_count + post.disagree_count, 0) / 
                    posts.length
                  )}
                </span>
              </div>
            </div>

            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                userPhilosopher={philosophyResult}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}