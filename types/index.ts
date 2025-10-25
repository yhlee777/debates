/* /types/index.ts - TypeScript 타입 정의 */

export interface PhilosopherType {
  type: string;
  philosopher: string;
  match: number;
}

export interface Post {
  id: string;
  title: string;  // 제목 추가
  content: string;
  authorType: string;
  authorPhilosopher: string;
  createdAt: Date;
  agreeCount: number;
  disagreeCount: number;
  userReaction: 'agree' | 'disagree' | null;
  philosopherDistribution: {
    agree: Record<string, number>;
    disagree: Record<string, number>;
  };
}

export interface User {
  id: string;
  email: string;
  philosopherType: PhilosopherType;
  createdAt: Date;
}

export interface PhilosophicalDimension {
  moralReasoning: number; // -100 (의무론) to +100 (결과론)
  distributiveJustice: number; // -100 (평등) to +100 (자유)
  changeOrientation: number; // -100 (보수) to +100 (진보)
}

export interface TestAnswer {
  questionId: number;
  value: number; // 0-100
}

export interface PhilosopherMatch {
  name: string;
  koreanName: string;
  period: string;
  mainIdeas: string[];
  similarity: number;
}