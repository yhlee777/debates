'use client';

import { useState } from 'react';
import styles from './PhilosophyTest.module.css';

interface PhilosophyTestProps {
  onComplete: () => void;
}

interface Question {
  id: number;
  title: string;
  description: string;
  leftLabel: string;
  rightLabel: string;
  leftDescription?: string;
  rightDescription?: string;
}

const questions: Question[] = [
  {
    id: 1,
    title: "무해한 금기",
    description: "남매가 서로 합의하에 단 한 번, 완벽한 피임을 하고 관계를 가졌습니다. 아무도 모르고, 누구도 피해받지 않았습니다.",
    leftLabel: "도덕적으로 잘못됨",
    rightLabel: "문제없음",
    leftDescription: "피해가 없어도 본질적으로 잘못된 행위",
    rightDescription: "실제 피해가 없다면 도덕적 문제도 없음"
  },
  {
    id: 2,
    title: "희생 딜레마",
    description: "폭주하는 기차가 5명을 향해 달려갑니다. 레버를 당기면 다른 선로의 1명이 죽지만 5명은 살 수 있습니다.",
    leftLabel: "레버를 당기지 않음",
    rightLabel: "레버를 당김",
    leftDescription: "의도적 살인은 정당화될 수 없음",
    rightDescription: "더 많은 생명을 구하는 것이 옳음"
  },
  {
    id: 3,
    title: "병역 형평성",
    description: "국방의 의무를 어떤 방식으로 수행하는 것이 공정하다고 생각하시나요?",
    leftLabel: "의무 복무 유지",
    rightLabel: "모병제 전환",
    leftDescription: "모든 시민이 평등하게 부담",
    rightDescription: "개인의 선택권과 전문성 중시"
  },
  {
    id: 4,
    title: "부동산 정책",
    description: "주거 안정을 위한 정부의 역할은 어느 정도가 적절할까요?",
    leftLabel: "강력한 규제",
    rightLabel: "시장 자율",
    leftDescription: "주거권 보장을 위한 적극적 개입",
    rightDescription: "시장 원리에 따른 자율 조절"
  },
  {
    id: 5,
    title: "대학 입시",
    description: "대학 입학에서 가장 중요하게 고려해야 할 가치는 무엇일까요?",
    leftLabel: "기회 균등",
    rightLabel: "능력 중심",
    leftDescription: "환경적 불평등을 보정하는 입시",
    rightDescription: "순수한 실력으로 평가하는 입시"
  }
];

export default function PhilosophyTest({ onComplete }: PhilosophyTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([50, 50, 50, 50, 50]);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSliderChange = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeTest();
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const completeTest = () => {
    const philosopherType = calculatePhilosopherType(answers);
    
    // 답변과 결과 저장
    localStorage.setItem('philosophy_test_completed', 'true');
    localStorage.setItem('philosopher_type', JSON.stringify(philosopherType));
    localStorage.setItem('test_answers', JSON.stringify(answers));
    
    setIsCompleted(true);
    
    // 결과 페이지로 이동
    setTimeout(() => {
      window.location.href = '/result';
    }, 1500);
  };

  const calculatePhilosopherType = (answers: number[]) => {
    // 각 차원별 점수 계산
    const moralScore = (answers[0] + answers[1]) / 2; // 도덕적 추론
    const justiceScore = (answers[3] + answers[4]) / 2; // 분배 정의
    const changeScore = (answers[2] + ((answers[3] + answers[4]) / 2)) / 2; // 변화 성향
    
    // 평균 점수로 유형 결정
    const avgScore = answers.reduce((a, b) => a + b, 0) / answers.length;
    
    // 더 세분화된 매칭
    if (moralScore < 30 && changeScore < 30) {
      return {
        type: '전통의 수호자',
        philosopher: '버크',
        match: Math.floor(85 + Math.random() * 10)
      };
    } else if (justiceScore > 70 && changeScore > 70) {
      return {
        type: '평등의 수호자',
        philosopher: '롤스',
        match: Math.floor(82 + Math.random() * 10)
      };
    } else if (justiceScore > 70 && moralScore > 70) {
      return {
        type: '자유의 옹호자',
        philosopher: '하이에크',
        match: Math.floor(79 + Math.random() * 10)
      };
    } else if (moralScore > 60 && changeScore > 60) {
      return {
        type: '진보의 선구자',
        philosopher: '싱어',
        match: Math.floor(81 + Math.random() * 10)
      };
    } else if (avgScore > 40 && avgScore < 60) {
      return {
        type: '균형의 탐구자',
        philosopher: '한병철',
        match: Math.floor(87 + Math.random() * 10)
      };
    } else {
      return {
        type: '실용주의자',
        philosopher: '밀',
        match: Math.floor(83 + Math.random() * 10)
      };
    }
  };

  if (isCompleted) {
    return (
      <div className={styles.container}>
        <div className={styles.completedMessage}>
          <h2>테스트 완료!</h2>
          <p>당신의 철학적 성향을 분석했습니다.</p>
          <p>곧 피드로 이동합니다...</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.progressBar}>
        <div className={styles.progress} style={{ width: `${progress}%` }} />
      </div>
      
      <div className={styles.questionContainer}>
        <div className={styles.questionHeader}>
          <span className={styles.questionNumber}>
            질문 {currentQuestion + 1} / {questions.length}
          </span>
          <h2 className={styles.questionTitle}>{question.title}</h2>
        </div>
        
        <p className={styles.questionDescription}>{question.description}</p>
        
        <div className={styles.sliderContainer}>
          <div className={styles.labelContainer}>
            <div className={styles.leftLabel}>
              <strong>{question.leftLabel}</strong>
              {question.leftDescription && (
                <small>{question.leftDescription}</small>
              )}
            </div>
            <div className={styles.rightLabel}>
              <strong>{question.rightLabel}</strong>
              {question.rightDescription && (
                <small>{question.rightDescription}</small>
              )}
            </div>
          </div>
          
          <input
            type="range"
            min="0"
            max="100"
            value={answers[currentQuestion]}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className={styles.slider}
          />
          
          <div className={styles.sliderValue}>{answers[currentQuestion]}</div>
        </div>
        
        <div className={styles.buttonContainer}>
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className={styles.prevButton}
          >
            이전
          </button>
          <button
            onClick={handleNext}
            className={styles.nextButton}
          >
            {currentQuestion === questions.length - 1 ? '완료' : '다음'}
          </button>
        </div>
      </div>
    </div>
  );
}