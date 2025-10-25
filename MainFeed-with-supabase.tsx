// components/MainFeed.tsx - Supabase 연결 버전
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './MainFeed.module.css';
import PostCard from '@/components/PostCard';
import WriteButton from '@/components/WriteButton';
import FilterTabs from '@/components/FilterTabs';
import ProfileDropdown from '@/components/ProfileDropdown';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePosts, useDialoguePosts, useSameTypePosts } from '@/lib/hooks/usePosts';
import { getTestResult } from '@/lib/api/philosophy';
import { Database } from '@/types/database';

type Post = Database['public']['Tables']['posts']['Row'];
type PhilosophyTestResult = Database['public']['Tables']['philosophy_test_results']['Row'];

export default function MainFeed() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [filter, setFilter] = useState<'recent' | 'dialogue' | 'my-type'>('recent');
  const [philosophyResult, setPhilosophyResult] = useState<PhilosophyTestResult | null>(null);

  // 사용자의 철학 테스트 결과 가져오기
  useEffect(() => {
    if (user) {
      getTestResult(user.id).then(setPhilosophyResult);
    }
  }, [user]);

  // 필터에 따른 게시글 조회
  const { posts: recentPosts, loading: recentLoading } = usePosts();
  const { posts: dialoguePosts, loading: dialogueLoading } = useDialoguePosts();
  const { posts: myTypePosts, loading: myTypeLoading } = useSameTypePosts(
    philosophyResult?.philosopher_type || null
  );

  // 현재 필터에 맞는 게시글과 로딩 상태
  const posts = filter === 'recent' ? recentPosts 
    : filter === 'dialogue' ? dialoguePosts 
    : myTypePosts;
  
  const loading = filter === 'recent' ? recentLoading 
    : filter === 'dialogue' ? dialogueLoading 
    : myTypeLoading;

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  // 철학 테스트를 완료하지 않은 경우 테스트 페이지로 리다이렉트
  useEffect(() => {
    if (user && !philosophyResult && !authLoading) {
      router.push('/');
    }
  }, [user, philosophyResult, authLoading, router]);

  if (authLoading || !user || !philosophyResult) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerTop}>
            <div className={styles.headerLeft}>
              <h1 className={styles.title}>일상속의 철학자들</h1>
              <p className={styles.subtitle}>온라인에서도 대화는 가능하다</p>
            </div>
            <div className={styles.headerRight}>
              <ProfileDropdown />
            </div>
          </div>
          
          <div className={styles.userInfo}>
            <span className={styles.userType}>{philosophyResult.philosopher_type}</span>
            <span className={styles.userPhilosopher}>
              영혼의 철학자: {philosophyResult.matched_philosopher}
            </span>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <FilterTabs 
          currentFilter={filter} 
          onFilterChange={setFilter}
        />

        <div className={styles.feedContainer}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>철학자들의 생각을 불러오는 중...</p>
            </div>
          ) : posts && posts.length === 0 ? (
            <div className={styles.emptyState}>
              <p>아직 작성된 글이 없습니다.</p>
              <p>첫 번째 철학자가 되어보세요.</p>
            </div>
          ) : (
            <div className={styles.postList}>
              {posts?.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post}
                  userPhilosopher={philosophyResult}
                />
              ))}
            </div>
          )}
        </div>

        <WriteButton />
      </main>
    </div>
  );
}
