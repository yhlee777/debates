// components/PostCard.tsx - Supabase 연결 버전
'use client';

import { useRouter } from 'next/navigation';
import styles from './PostCard.module.css';
import { useReactionToggle, useReactionStats } from '@/lib/hooks/useReactions';
import { Database } from '@/types/database';
import { formatDistanceToNow } from '@/lib/utils';

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

  const handleReaction = async (reactionType: 'agree' | 'disagree') => {
    try {
      await toggleReaction(reactionType);
    } catch (error) {
      console.error('반응 처리 실패:', error);
      alert('반응을 처리하는 중 오류가 발생했습니다.');
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // 버튼 클릭 시에는 상세 페이지로 이동하지 않음
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    router.push(`/post/${post.id}`);
  };

  const getTopPhilosophers = (distribution: Record<string, number>, limit = 3) => {
    return Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit);
  };

  return (
    <article className={styles.card} onClick={handleCardClick}>
      <div className={styles.header}>
        <div className={styles.author}>
          <span className={styles.authorType}>{post.author_type}</span>
          <span className={styles.authorPhilosopher}>
            {post.author_philosopher}의 영향을 받은
          </span>
        </div>
        <time className={styles.time}>
          {formatDistanceToNow(new Date(post.created_at))}
        </time>
      </div>

      <h3 className={styles.title}>{post.title}</h3>
      
      <p className={styles.content}>
        {post.content.length > 150 
          ? `${post.content.substring(0, 150)}...` 
          : post.content}
      </p>

      <div className={styles.footer}>
        <div className={styles.reactions}>
          <button
            className={`${styles.reactionButton} ${styles.agreeButton} ${
              currentReaction === 'agree' ? styles.active : ''
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleReaction('agree');
            }}
          >
            <svg className={styles.icon} viewBox="0 0 20 20" fill="none">
              <path
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                fill="currentColor"
              />
            </svg>
            <span>동의</span>
            <span className={styles.count}>{post.agree_count}</span>
          </button>

          <button
            className={`${styles.reactionButton} ${styles.disagreeButton} ${
              currentReaction === 'disagree' ? styles.active : ''
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleReaction('disagree');
            }}
          >
            <svg className={styles.icon} viewBox="0 0 20 20" fill="none">
              <path
                d="M8.707 10l-4.147 4.146a1 1 0 01-1.414-1.414L7.293 8.586 3.146 4.44a1 1 0 111.414-1.414L8.707 7.172l4.147-4.146a1 1 0 111.414 1.414L10.121 8.586l4.147 4.146a1 1 0 01-1.414 1.414L8.707 10z"
                fill="currentColor"
              />
            </svg>
            <span>다른의견</span>
            <span className={styles.count}>{post.disagree_count}</span>
          </button>
        </div>

        {stats && (post.agree_count > 0 || post.disagree_count > 0) && (
          <div className={styles.distribution}>
            {post.agree_count > 0 && (
              <div className={styles.distributionGroup}>
                <span className={styles.distributionLabel}>동의:</span>
                {getTopPhilosophers(stats.agree).map(([type, count]) => (
                  <span key={type} className={styles.distributionItem}>
                    {type} {count}
                  </span>
                ))}
              </div>
            )}
            {post.disagree_count > 0 && (
              <div className={styles.distributionGroup}>
                <span className={styles.distributionLabel}>다른의견:</span>
                {getTopPhilosophers(stats.disagree).map(([type, count]) => (
                  <span key={type} className={styles.distributionItem}>
                    {type} {count}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
