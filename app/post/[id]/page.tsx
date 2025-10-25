'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './post.module.css';
import ProfileDropdown from '@/components/ProfileDropdown';
import { Post, PhilosopherType } from '@/types';
import { formatDistanceToNow } from '@/utils/dateUtils';

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPhilosopher, setUserPhilosopher] = useState<PhilosopherType | null>(null);

  useEffect(() => {
    // 로그인 체크
    const isLoggedIn = localStorage.getItem('is_logged_in');
    if (!isLoggedIn) {
      router.push('/auth');
      return;
    }

    // 사용자 철학자 정보 가져오기
    const storedType = localStorage.getItem('philosopher_type');
    if (storedType) {
      setUserPhilosopher(JSON.parse(storedType));
    }

    // 게시글 데이터 가져오기
    fetchPost(postId);
  }, [postId, router]);

  const fetchPost = async (id: string) => {
    setLoading(true);
    
    // 실제로는 서버에서 가져옴
    // localStorage에서 임시로 가져오기
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const foundPost = posts.find((p: any) => p.id === id);
    
    let mockPost: Post;
    
    if (foundPost) {
      mockPost = {
        ...foundPost,
        agreeCount: foundPost.agreeCount || 0,
        disagreeCount: foundPost.disagreeCount || 0,
        userReaction: null,
        philosopherDistribution: foundPost.philosopherDistribution || {
          agree: {},
          disagree: {}
        }
      };
    } else {
      // 기본 목업 데이터
      mockPost = {
        id: id,
        title: '피로사회의 자발적 착취',
        content: `디지털 시대의 피로사회에서 우리는 자발적으로 스스로를 착취하고 있습니다. 
      
성과주의 사회는 우울증의 사회가 되었고, 무한 긍정의 강요는 오히려 개인을 소진시킵니다. "할 수 있다"는 긍정성의 과잉은 "해야 한다"는 강박으로 변질되어, 우리는 스스로의 감시자이자 착취자가 됩니다.

한병철은 이를 "피로사회"라고 명명합니다. 외부의 억압이 아닌 자기 자신에 의한 착취가 더욱 효율적이고 완전한 착취라는 것입니다. 우리는 자유롭다고 믿지만, 실제로는 성과의 노예가 되어 있습니다.

진정한 자유는 "하지 않을 자유"에서 시작됩니다. 멈춤과 사색, 무위의 시간이 필요합니다. 끊임없는 활동과 연결에서 벗어나, 침묵과 고독 속에서 자아를 회복해야 합니다.

디지털 기술이 약속한 자유는 어디에 있습니까? 우리는 24시간 연결되어 있지만, 그 어느 때보다 고립되어 있습니다. 소통의 과잉 속에서 진정한 대화는 사라지고 있습니다.`,
        authorType: '성찰의 철학자',
        authorPhilosopher: '한병철',
        createdAt: new Date('2025-01-24T10:30:00'),
        agreeCount: 42,
        disagreeCount: 18,
        userReaction: null,
        philosopherDistribution: {
          agree: {
            '성찰의 철학자': 15,
            '균형의 탐구자': 12,
            '자유의 옹호자': 8,
            '공동체주의자': 7
          },
          disagree: {
            '진보의 선구자': 8,
            '실용주의자': 6,
            '자유시장주의자': 4
          }
        }
      };
    }

    setTimeout(() => {
      setPost(mockPost);
      setLoading(false);
    }, 500);
  };

  const handleReaction = (reaction: 'agree' | 'disagree') => {
    if (!post) return;
    
    const prevReaction = post.userReaction;
    const newReaction = prevReaction === reaction ? null : reaction;
    
    setPost({
      ...post,
      userReaction: newReaction,
      agreeCount: post.agreeCount + 
        (newReaction === 'agree' ? 1 : 0) - 
        (prevReaction === 'agree' ? 1 : 0),
      disagreeCount: post.disagreeCount + 
        (newReaction === 'disagree' ? 1 : 0) - 
        (prevReaction === 'disagree' ? 1 : 0)
    });
  };

  const handleBack = () => {
    router.push('/feed');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p>글을 찾을 수 없습니다.</p>
          <button onClick={handleBack} className={styles.backButton}>
            피드로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const getTopPhilosophers = (distribution: Record<string, number>) => {
    return Object.entries(distribution)
      .sort(([, a], [, b]) => b - a);
  };

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
        <article className={styles.article}>
          <div className={styles.articleHeader}>
            <h1 className={styles.title}>{post.title}</h1>
            <div className={styles.meta}>
              <div className={styles.author}>
                <span className={styles.authorType}>{post.authorType}</span>
                <span className={styles.authorPhilosopher}>
                  {post.authorPhilosopher}의 영향을 받은
                </span>
              </div>
              <time className={styles.time}>
                {formatDistanceToNow(post.createdAt)}
              </time>
            </div>
          </div>

          <div className={styles.content}>
            {post.content.split('\n').map((paragraph, index) => (
              paragraph.trim() && <p key={index}>{paragraph.trim()}</p>
            ))}
          </div>

          <div className={styles.reactions}>
            <div className={styles.reactionButtons}>
              <button
                className={`${styles.reactionButton} ${styles.agreeButton} ${
                  post.userReaction === 'agree' ? styles.active : ''
                }`}
                onClick={() => handleReaction('agree')}
              >
                <div className={styles.buttonContent}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill={post.userReaction === 'agree' ? 'currentColor' : 'none'}
                    />
                    {post.userReaction === 'agree' && (
                      <path
                        d="M8 12L10.5 14.5L16 9"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                  </svg>
                  <div className={styles.buttonText}>
                    <span className={styles.buttonLabel}>동의</span>
                    <span className={styles.buttonDescription}>
                      이 의견에 공감하고 동의합니다
                    </span>
                  </div>
                  <span className={styles.count}>{post.agreeCount}</span>
                </div>
              </button>

              <button
                className={`${styles.reactionButton} ${styles.disagreeButton} ${
                  post.userReaction === 'disagree' ? styles.active : ''
                }`}
                onClick={() => handleReaction('disagree')}
              >
                <div className={styles.buttonContent}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="3"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill={post.userReaction === 'disagree' ? 'currentColor' : 'none'}
                    />
                    {post.userReaction === 'disagree' && (
                      <g>
                        <circle cx="8" cy="12" r="1.5" fill="white" />
                        <circle cx="12" cy="12" r="1.5" fill="white" />
                        <circle cx="16" cy="12" r="1.5" fill="white" />
                      </g>
                    )}
                  </svg>
                  <div className={styles.buttonText}>
                    <span className={styles.buttonLabel}>다른 의견</span>
                    <span className={styles.buttonDescription}>
                      다른 관점이나 의견이 있습니다
                    </span>
                  </div>
                  <span className={styles.count}>{post.disagreeCount}</span>
                </div>
              </button>
            </div>

            <div className={styles.distribution}>
              <h3 className={styles.distributionTitle}>철학자들의 반응 분포</h3>
              
              <div className={styles.distributionGrid}>
                <div className={styles.distributionColumn}>
                  <h4 className={styles.columnTitle}>
                    동의한 철학자들 ({post.agreeCount}명)
                  </h4>
                  <div className={styles.philosopherList}>
                    {getTopPhilosophers(post.philosopherDistribution.agree).map(
                      ([type, count]) => (
                        <div key={type} className={styles.philosopherItem}>
                          <span className={styles.philosopherType}>{type}</span>
                          <div className={styles.barContainer}>
                            <div 
                              className={styles.bar}
                              style={{ 
                                width: `${(count / post.agreeCount) * 100}%`,
                                background: 'var(--color-agree)'
                              }}
                            />
                          </div>
                          <span className={styles.philosopherCount}>{count}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className={styles.distributionColumn}>
                  <h4 className={styles.columnTitle}>
                    다른 의견의 철학자들 ({post.disagreeCount}명)
                  </h4>
                  <div className={styles.philosopherList}>
                    {getTopPhilosophers(post.philosopherDistribution.disagree).map(
                      ([type, count]) => (
                        <div key={type} className={styles.philosopherItem}>
                          <span className={styles.philosopherType}>{type}</span>
                          <div className={styles.barContainer}>
                            <div 
                              className={styles.bar}
                              style={{ 
                                width: `${(count / post.disagreeCount) * 100}%`,
                                background: 'var(--color-disagree)'
                              }}
                            />
                          </div>
                          <span className={styles.philosopherCount}>{count}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {userPhilosopher && (
            <div className={styles.userContext}>
              <p className={styles.userContextText}>
                <strong>{userPhilosopher.type}</strong>인 당신은 
                <strong> {userPhilosopher.philosopher}</strong>의 철학과 
                <strong> {userPhilosopher.match}%</strong> 일치합니다.
                이 글에 대해 어떻게 생각하시나요?
              </p>
            </div>
          )}
        </article>
      </main>
    </div>
  );
}