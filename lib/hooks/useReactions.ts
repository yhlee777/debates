// lib/hooks/useReactions.ts - 반응 관련 Hooks

import useSWR from 'swr';
import { useCallback } from 'react';
import { getReactionStats, getUserReaction, addOrUpdateReaction, removeReaction } from '@/lib/api/reactions';
import { useAuth } from './useAuth';

/**
 * 게시글의 반응 통계 Hook
 */
export function useReactionStats(postId: string | null) {
  const { data, error, mutate } = useSWR(
    postId ? ['reaction-stats', postId] : null,
    () => getReactionStats(postId!),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    stats: data,
    loading: !error && !data,
    error,
    mutate,
  };
}

/**
 * 사용자의 게시글 반응 Hook
 */
export function useUserReaction(postId: string | null) {
  const { user } = useAuth();
  
  const { data, error, mutate } = useSWR(
    user && postId ? ['user-reaction', user.id, postId] : null,
    () => getUserReaction(user!.id, postId!),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    reaction: data,
    loading: !error && !data,
    error,
    mutate,
  };
}

/**
 * 반응 토글 Hook
 */
export function useReactionToggle(postId: string, userType: string, userPhilosopher: string) {
  const { user } = useAuth();
  const { reaction, mutate: mutateReaction } = useUserReaction(postId);
  const { mutate: mutateStats } = useReactionStats(postId);

  const toggleReaction = useCallback(
    async (reactionType: 'agree' | 'disagree') => {
      if (!user) {
        throw new Error('로그인이 필요합니다.');
      }

      try {
        // 같은 반응 클릭 시 취소
        if (reaction?.reaction_type === reactionType) {
          await removeReaction(user.id, postId);
        } else {
          // 반응 추가/변경
          await addOrUpdateReaction({
            userId: user.id,
            postId,
            reactionType,
            userType,
            userPhilosopher,
          });
        }

        // 로컬 캐시 업데이트
        await mutateReaction();
        await mutateStats();
        
        return true;
      } catch (error) {
        console.error('반응 처리 실패:', error);
        throw error;
      }
    },
    [user, postId, reaction, userType, userPhilosopher, mutateReaction, mutateStats]
  );

  return {
    toggleReaction,
    currentReaction: reaction?.reaction_type,
  };
}
