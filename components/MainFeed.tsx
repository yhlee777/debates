'use client';

import { useState, useEffect } from 'react';
import styles from './MainFeed.module.css';
import PostCard from '@/components/PostCard';
import WriteButton from '@/components/WriteButton';
import FilterTabs from '@/components/FilterTabs';
import ProfileDropdown from '@/components/ProfileDropdown';
import { Post, PhilosopherType } from '@/types';

export default function MainFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<'recent' | 'dialogue' | 'my-type'>('recent');
  const [loading, setLoading] = useState(true);
  const [userPhilosopher, setUserPhilosopher] = useState<PhilosopherType | null>(null);

  useEffect(() => {
    fetchUserPhilosopher();
    fetchPosts();
  }, [filter]);

  const fetchUserPhilosopher = async () => {
    const storedType = localStorage.getItem('philosopher_type');
    if (storedType) {
      setUserPhilosopher(JSON.parse(storedType));
    } else {
      setUserPhilosopher({
        type: '균형의 탐구자',
        philosopher: '한병철',
        match: 87
      });
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    const mockPosts: Post[] = [
      {
        id: '1',
        title: '피로사회의 자발적 착취',
        content: '디지털 시대의 피로사회에서 우리는 자발적으로 스스로를 착취하고 있습니다. 성과주의 사회는 우울증의 사회가 되었고, 무한 긍정의 강요는 오히려 개인을 소진시킵니다. 진정한 자유는 "하지 않을 자유"에서 시작됩니다.',
        authorType: '성찰의 철학자',
        authorPhilosopher: '한병철',
        createdAt: new Date('2025-01-24T10:30:00'),
        agreeCount: 42,
        disagreeCount: 18,
        userReaction: null,
        philosopherDistribution: {
          agree: { '성찰의 철학자': 15, '균형의 탐구자': 12, '자유의 옹호자': 8, '공동체주의자': 7 },
          disagree: { '진보의 선구자': 8, '실용주의자': 6, '자유시장주의자': 4 }
        }
      },
      {
        id: '2',
        title: '주거는 기본권인가',
        content: '주거는 기본권입니다. 부동산 시장의 완전한 자유화는 결국 소수의 부유층만을 위한 도시를 만들 뿐입니다.',
        authorType: '평등의 수호자',
        authorPhilosopher: '롤스',
        createdAt: new Date('2025-01-24T09:15:00'),
        agreeCount: 67,
        disagreeCount: 35,
        userReaction: 'agree',
        philosopherDistribution: {
          agree: { '평등의 수호자': 25, '공동체주의자': 20, '진보의 선구자': 15, '균형의 탐구자': 7 },
          disagree: { '자유시장주의자': 18, '자유의 옹호자': 10, '보수주의자': 7 }
        }
      },
      {
        id: '3',
        title: '시장의 효율성과 정부개입',
        content: '시장 경제의 효율성을 무시하고 정부 개입만을 강조하는 것은 위험합니다.',
        authorType: '자유의 옹호자',
        authorPhilosopher: '하이에크',
        createdAt: new Date('2025-01-24T08:45:00'),
        agreeCount: 38,
        disagreeCount: 44,
        userReaction: 'disagree',
        philosopherDistribution: {
          agree: { '자유시장주의자': 20, '자유의 옹호자': 12, '실용주의자': 6 },
          disagree: { '평등의 수호자': 18, '공동체주의자': 15, '균형의 탐구자': 11 }
        }
      },
      {
        id: '4',
        title: '전통의 가치와 진보의 속도',
        content: '오랜 시간 검증된 지혜를 무시하고 급진적 변화만을 추구하는 것은 사회를 불안정하게 만듭니다.',
        authorType: '보수주의자',
        authorPhilosopher: '버크',
        createdAt: new Date('2025-01-24T07:20:00'),
        agreeCount: 29,
        disagreeCount: 23,
        userReaction: null,
        philosopherDistribution: {
          agree: { '보수주의자': 12, '실용주의자': 8, '균형의 탐구자': 9 },
          disagree: { '진보의 선구자': 12, '자유의 옹호자': 7, '평등의 수호자': 4 }
        }
      },
      {
        id: '5',
        title: 'AI 시대의 일자리 보장',
        content: 'AI가 인간의 일자리를 대체하는 시대, 기본소득은 선택이 아닌 필수입니다.',
        authorType: '진보의 선구자',
        authorPhilosopher: '양',
        createdAt: new Date('2025-01-24T06:50:00'),
        agreeCount: 55,
        disagreeCount: 41,
        userReaction: null,
        philosopherDistribution: {
          agree: { '진보의 선구자': 20, '평등의 수호자': 18, '균형의 탐구자': 17 },
          disagree: { '보수주의자': 20, '자유시장주의자': 15, '실용주의자': 6 }
        }
      },
      {
        id: '6',
        title: '세대 간 부의 이전',
        content: '상속세는 기회의 평등을 위해 필수적인 제도입니다.',
        authorType: '평등의 수호자',
        authorPhilosopher: '피케티',
        createdAt: new Date('2025-01-24T06:30:00'),
        agreeCount: 48,
        disagreeCount: 52,
        userReaction: null,
        philosopherDistribution: {
          agree: { '평등의 수호자': 22, '진보의 선구자': 16, '공동체주의자': 10 },
          disagree: { '자유시장주의자': 25, '보수주의자': 18, '자유의 옹호자': 9 }
        }
      },
      {
        id: '7',
        title: '교육의 평준화 vs 수월성',
        content: '재능있는 학생들을 위한 엘리트 교육이 전체 사회 발전을 이끕니다.',
        authorType: '실용주의자',
        authorPhilosopher: '밀',
        createdAt: new Date('2025-01-24T06:00:00'),
        agreeCount: 33,
        disagreeCount: 45,
        userReaction: null,
        philosopherDistribution: {
          agree: { '실용주의자': 15, '자유시장주의자': 10, '보수주의자': 8 },
          disagree: { '평등의 수호자': 20, '공동체주의자': 15, '진보의 선구자': 10 }
        }
      },
      {
        id: '8',
        title: '난민 수용의 도덕적 의무',
        content: '국경은 인위적 구분일 뿐, 모든 인간은 이동의 자유를 가집니다.',
        authorType: '세계시민주의자',
        authorPhilosopher: '싱어',
        createdAt: new Date('2025-01-24T05:30:00'),
        agreeCount: 41,
        disagreeCount: 59,
        userReaction: null,
        philosopherDistribution: {
          agree: { '세계시민주의자': 18, '진보의 선구자': 13, '평등의 수호자': 10 },
          disagree: { '보수주의자': 28, '공동체주의자': 20, '실용주의자': 11 }
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
          
          {userPhilosopher && (
            <div className={styles.userInfo}>
              <span className={styles.userType}>{userPhilosopher.type}</span>
              <span className={styles.userPhilosopher}>
                영혼의 철학자: {userPhilosopher.philosopher}
              </span>
            </div>
          )}
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
          ) : posts.length === 0 ? (
            <div className={styles.emptyState}>
              <p>아직 작성된 글이 없습니다.</p>
              <p>첫 번째 철학자가 되어보세요.</p>
            </div>
          ) : (
            <div className={styles.postList}>
              {posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onReaction={handleReaction}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <WriteButton />
    </div>
  );
}