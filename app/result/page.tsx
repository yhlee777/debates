'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './result.module.css';
import { PhilosopherType } from '@/types';

// 철학자 정보 데이터
const philosopherData: Record<string, any> = {
  '한병철': {
    period: '1959-현재',
    nationality: '독일/한국',
    mainIdeas: ['피로사회', '투명사회', '디지털 문명 비판'],
    description: '현대 디지털 사회의 자발적 착취와 성과주의를 비판하며, 사색과 무위의 가치를 강조합니다.',
    quote: '"우리는 스스로를 착취하는 성과주체가 되었다"'
  },
  '롤스': {
    period: '1921-2002',
    nationality: '미국',
    mainIdeas: ['정의론', '무지의 베일', '차등의 원칙'],
    description: '공정한 사회를 위한 정의의 원칙을 탐구하며, 가장 불리한 처지의 사람들을 우선 고려해야 한다고 주장합니다.',
    quote: '"정의는 사회 제도의 첫 번째 덕목이다"'
  },
  '하이에크': {
    period: '1899-1992',
    nationality: '오스트리아/영국',
    mainIdeas: ['자생적 질서', '지식의 문제', '자유주의'],
    description: '시장의 자율적 조정 능력을 신뢰하며, 정부 개입의 한계와 개인 자유의 중요성을 역설합니다.',
    quote: '"자유를 포기하는 것은 인간임을 포기하는 것이다"'
  },
  '버크': {
    period: '1729-1797',
    nationality: '아일랜드/영국',
    mainIdeas: ['보수주의', '전통의 지혜', '점진적 개혁'],
    description: '급진적 변화보다 점진적 개선을 추구하며, 오랜 시간 검증된 전통과 관습의 가치를 옹호합니다.',
    quote: '"과거를 돌아보지 않는 자는 미래를 내다볼 수 없다"'
  },
  '싱어': {
    period: '1946-현재',
    nationality: '호주',
    mainIdeas: ['동물 해방', '효과적 이타주의', '공리주의'],
    description: '모든 존재의 고통을 평등하게 고려해야 하며, 부유한 이들은 빈곤한 이들을 도울 도덕적 의무가 있다고 주장합니다.',
    quote: '"우리의 사치는 다른 이의 생명보다 중요하지 않다"'
  },
  '밀': {
    period: '1806-1873',
    nationality: '영국',
    mainIdeas: ['자유론', '공리주의', '개인의 자유'],
    description: '타인에게 해를 끼치지 않는 한 개인의 자유는 최대한 보장되어야 하며, 질적으로 우월한 쾌락이 존재한다고 봅니다.',
    quote: '"자기 자신에 대해서는 각 개인이 주권자다"'
  }
};

export default function ResultPage() {
  const router = useRouter();
  const [philosopher, setPhilosopher] = useState<PhilosopherType | null>(null);
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState({
    moralReasoning: 0,
    distributiveJustice: 0,
    changeOrientation: 0
  });

  useEffect(() => {
    const storedType = localStorage.getItem('philosopher_type');
    const storedAnswers = localStorage.getItem('test_answers');
    
    if (!storedType) {
      router.push('/');
      return;
    }
    
    const philosopherType = JSON.parse(storedType);
    setPhilosopher(philosopherType);
    
    if (storedAnswers) {
      const answers = JSON.parse(storedAnswers);
      calculateDimensions(answers);
    }
    
    setLoading(false);
  }, [router]);

  const calculateDimensions = (answers: number[]) => {
    // 각 차원별 점수 계산
    const moral = (answers[0] + answers[1]) / 2;
    const justice = (answers[3] + answers[4]) / 2;
    const change = (answers[2] + ((answers[3] + answers[4]) / 2)) / 2;
    
    setDimensions({
      moralReasoning: moral - 50,
      distributiveJustice: justice - 50,
      changeOrientation: change - 50
    });
  };

  const handleRetakeTest = () => {
    localStorage.clear();
    router.push('/');
  };

  const handleGoToFeed = () => {
    router.push('/feed');
  };

  if (loading || !philosopher) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
        </div>
      </div>
    );
  }

  const philosopherInfo = philosopherData[philosopher.philosopher] || {};

  return (
    <div className={styles.container}>
      <div className={styles.resultCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>당신의 철학적 초상</h1>
          <p className={styles.subtitle}>5개의 질문으로 분석한 당신의 정치철학</p>
        </div>

        <div className={styles.mainResult}>
          <div className={styles.typeSection}>
            <span className={styles.typeLabel}>당신의 유형</span>
            <h2 className={styles.typeName}>{philosopher.type}</h2>
          </div>
          
          <div className={styles.matchSection}>
            <div className={styles.matchScore}>
              <span className={styles.percentage}>{philosopher.match}%</span>
              <span className={styles.matchLabel}>일치도</span>
            </div>
            <div className={styles.philosopherInfo}>
              <h3 className={styles.philosopherName}>{philosopher.philosopher}</h3>
              <p className={styles.period}>{philosopherInfo.period}</p>
              <p className={styles.nationality}>{philosopherInfo.nationality}</p>
            </div>
          </div>
        </div>

        <div className={styles.quote}>
          {philosopherInfo.quote}
        </div>

        <div className={styles.description}>
          {philosopherInfo.description}
        </div>

        <div className={styles.dimensions}>
          <h3 className={styles.dimensionTitle}>당신의 철학적 좌표</h3>
          
          <div className={styles.dimension}>
            <div className={styles.dimHeader}>
              <span className={styles.dimName}>도덕적 추론</span>
              <span className={styles.dimLabels}>
                <span>의무론</span>
                <span>결과론</span>
              </span>
            </div>
            <div className={styles.dimBar}>
              <div 
                className={styles.dimIndicator} 
                style={{ left: `${50 + dimensions.moralReasoning}%` }}
              />
            </div>
          </div>

          <div className={styles.dimension}>
            <div className={styles.dimHeader}>
              <span className={styles.dimName}>분배 정의</span>
              <span className={styles.dimLabels}>
                <span>평등</span>
                <span>자유</span>
              </span>
            </div>
            <div className={styles.dimBar}>
              <div 
                className={styles.dimIndicator} 
                style={{ left: `${50 + dimensions.distributiveJustice}%` }}
              />
            </div>
          </div>

          <div className={styles.dimension}>
            <div className={styles.dimHeader}>
              <span className={styles.dimName}>변화 성향</span>
              <span className={styles.dimLabels}>
                <span>보수</span>
                <span>진보</span>
              </span>
            </div>
            <div className={styles.dimBar}>
              <div 
                className={styles.dimIndicator} 
                style={{ left: `${50 + dimensions.changeOrientation}%` }}
              />
            </div>
          </div>
        </div>

        <div className={styles.mainIdeas}>
          <h3>주요 사상</h3>
          <div className={styles.ideaTags}>
            {philosopherInfo.mainIdeas?.map((idea: string, index: number) => (
              <span key={index} className={styles.ideaTag}>{idea}</span>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={handleGoToFeed} className={styles.primaryButton}>
            피드 둘러보기
          </button>
          <button onClick={handleRetakeTest} className={styles.secondaryButton}>
            다시 테스트하기
          </button>
        </div>
      </div>
    </div>
  );
}