'use client';

import { useRouter } from 'next/navigation';
import styles from './PostCard.module.css';
import { useReactionToggle, useReactionStats } from '@/lib/hooks/useReactions';
import { Database } from '@/types/database';

type Post = Database['public']['Tables']['posts']['Row'];
type PhilosophyTestResult = Database['public']['Tables']['philosophy_test_results']['Row'];

interface PostCardProps {
  post: Post;
  userPhilosopher: PhilosophyTestResult;
}

export default function PostCard({ post, userPhilosopher }: PostCardProps) {
  const router = useRouter();
  
  // 반응 관련 hooks
  const { toggleReaction, currentReaction } = useReactionToggle(
    post.id,
    userPhilosopher.philosopher_type,
    userPhilosopher.matched_philosopher
  );
  const { stats } = useReactionStats(post.id);

  const handleReaction = async (reactionType: 'agree' | 'disagree', e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleReaction(reactionType);
    } catch (error) {
      console.error('반응 처리 실패:', error);
      alert('반응을 처리하는 중 오류가 발생했습니다.');
    }
  };

  const handleClick = () => {
    router.push(`/post/${post.id}`);
  };

  const formatDistanceToNow = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    if (diffInSeconds < 60) return '방금 전';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}주 전`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths}개월 전`;
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears}년 전`;
  };

  return (
    <article className={styles.card} onClick={handleClick}>
      <div className={styles.mainRow}>
        <div className={styles.leftSection}>
          <h3 className={styles.title}>{post.title}</h3>
          <div className={styles.meta}>
            <span className={styles.authorType}>{post.author_type}</span>
            <span className={styles.dot}>·</span>
            <time className={styles.time}>{formatDistanceToNow(post.created_at)}</time>
          </div>
        </div>
        
        <div className={styles.rightSection}>
          <button
            className={`${styles.reactionBtn} ${styles.agreeBtn} ${
              currentReaction === 'agree' ? styles.active : ''
            }`}
            onClick={(e) => handleReaction('agree', e)}
            aria-label="동의"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"
                fill={currentReaction === 'agree' ? 'currentColor' : 'none'}/>
            </svg>
            <span>{post.agree_count}</span>
          </button>

          <button
            className={`${styles.reactionBtn} ${styles.disagreeBtn} ${
              currentReaction === 'disagree' ? styles.active : ''
            }`}
            onClick={(e) => handleReaction('disagree', e)}
            aria-label="다른의견"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"
                fill={currentReaction === 'disagree' ? 'currentColor' : 'none'}/>
            </svg>
            <span>{post.disagree_count}</span>
          </button>
        </div>
      </div>
    </article>
  );
}