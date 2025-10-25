'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PhilosophyTest from '@/components/PhilosophyTest';
import MainFeed from '@/components/MainFeed';

export default function Home() {
  const [hasCompletedTest, setHasCompletedTest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 로컬 스토리지에서 테스트 완료 여부 확인
    const testCompleted = localStorage.getItem('philosophy_test_completed');
    if (testCompleted) {
      setHasCompletedTest(true);
    }
    setIsLoading(false);
  }, []);

  const handleTestComplete = () => {
    setHasCompletedTest(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p className="mt-4 text-text-muted">불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 테스트를 완료하지 않았으면 테스트 화면 표시
  if (!hasCompletedTest) {
    return <PhilosophyTest onComplete={handleTestComplete} />;
  }

  // 테스트를 완료했으면 메인 피드 표시
  return <MainFeed />;
}