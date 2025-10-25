'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './PostCard.module.css';
import { Post } from '@/types';
import { formatDistanceToNow } from '@/utils/dateUtils';

interface PostCardProps {
  post: Post;
  onReaction: (postId: string, reaction: 'agree' | 'disagree') => void;
}

export default function PostCard({ post, onReaction }: PostCardProps) {
  const router = useRouter();

  const handleAgree = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReaction(post.id, 'agree');
  };

  const handleDisagree = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReaction(post.id, 'disagree');
  };

  const handleClick = () => {
    router.push(`/post/${post.id}`);
  };

  return (
    <article className={styles.card} onClick={handleClick}>
      <div className={styles.mainRow}>
        <div className={styles.leftSection}>
          <h3 className={styles.title}>{post.title}</h3>
          <div className={styles.meta}>
            <span className={styles.authorType}>{post.authorType}</span>
            <span className={styles.dot}>·</span>
            <time className={styles.time}>{formatDistanceToNow(post.createdAt)}</time>
          </div>
        </div>
        
        <div className={styles.rightSection}>
          <button
            className={`${styles.reactionBtn} ${styles.agreeBtn} ${
              post.userReaction === 'agree' ? styles.active : ''
            }`}
            onClick={handleAgree}
            aria-label="동의"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"
                fill={post.userReaction === 'agree' ? 'currentColor' : 'none'}/>
            </svg>
            <span>{post.agreeCount}</span>
          </button>

          <button
            className={`${styles.reactionBtn} ${styles.disagreeBtn} ${
              post.userReaction === 'disagree' ? styles.active : ''
            }`}
            onClick={handleDisagree}
            aria-label="다른의견"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"
                fill={post.userReaction === 'disagree' ? 'currentColor' : 'none'}/>
            </svg>
            <span>{post.disagreeCount}</span>
          </button>
        </div>
      </div>
    </article>
  );
}