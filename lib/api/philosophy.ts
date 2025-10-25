// lib/api/philosophy.ts - 철학 테스트 관련 API

import { supabase } from '@/lib/supabase';
import { TestAnswer, PhilosophicalDimension } from '@/types';
import { calculatePhilosophicalDimensions, matchPhilosopher } from '@/lib/philosophy-algorithm';

export interface SaveTestResultData {
  userId: string;
  answers: TestAnswer[];
  dimensions: PhilosophicalDimension;
  philosopherType: string;
  matchedPhilosopher: string;
  matchPercentage: number;
  rivalPhilosopher?: string;
  rivalPercentage?: number;
}

/**
 * 철학 테스트 결과 저장
 */
export async function saveTestResult(data: SaveTestResultData) {
  const { error } = await supabase
    .from('philosophy_test_results')
    .upsert({
      user_id: data.userId,
      answers: data.answers,
      moral_reasoning: data.dimensions.moralReasoning,
      distributive_justice: data.dimensions.distributiveJustice,
      change_orientation: data.dimensions.changeOrientation,
      philosopher_type: data.philosopherType,
      matched_philosopher: data.matchedPhilosopher,
      match_percentage: data.matchPercentage,
      rival_philosopher: data.rivalPhilosopher,
      rival_percentage: data.rivalPercentage,
    }, {
      onConflict: 'user_id', // 기존 결과가 있으면 덮어쓰기
    });

  if (error) throw error;
}

/**
 * 사용자의 철학 테스트 결과 조회
 */
export async function getTestResult(userId: string) {
  const { data, error } = await supabase
    .from('philosophy_test_results')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // 결과가 없는 경우
      return null;
    }
    throw error;
  }

  return data;
}

/**
 * 철학 테스트 완료 여부 확인
 */
export async function hasCompletedTest(userId: string): Promise<boolean> {
  const result = await getTestResult(userId);
  return result !== null;
}

/**
 * 철학 테스트 재설정 (재테스트)
 */
export async function resetTestResult(userId: string) {
  const { error } = await supabase
    .from('philosophy_test_results')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
}

/**
 * 철학자 유형별 통계
 */
export async function getPhilosopherTypeStats() {
  const { data, error } = await supabase
    .from('philosophy_test_results')
    .select('philosopher_type');

  if (error) throw error;

  // 유형별 카운트
  const stats: Record<string, number> = {};
  data.forEach((result) => {
    const type = result.philosopher_type;
    stats[type] = (stats[type] || 0) + 1;
  });

  return stats;
}
