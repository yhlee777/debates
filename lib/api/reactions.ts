// lib/api/reactions.ts - 반응 관련 API

import { supabase } from '@/lib/supabase';

export interface AddReactionData {
  userId: string;
  postId: string;
  reactionType: 'agree' | 'disagree';
  userType: string;
  userPhilosopher: string;
}

/**
 * 반응 추가/변경
 */
export async function addOrUpdateReaction(data: AddReactionData) {
  const { data: reaction, error } = await supabase
    .from('reactions')
    .upsert({
      user_id: data.userId,
      post_id: data.postId,
      reaction_type: data.reactionType,
      user_type: data.userType,
      user_philosopher: data.userPhilosopher,
    }, {
      onConflict: 'user_id,post_id', // 기존 반응이 있으면 업데이트
    })
    .select()
    .single();

  if (error) throw error;
  return reaction;
}

/**
 * 반응 삭제 (동의/다른의견 취소)
 */
export async function removeReaction(userId: string, postId: string) {
  const { error } = await supabase
    .from('reactions')
    .delete()
    .eq('user_id', userId)
    .eq('post_id', postId);

  if (error) throw error;
}

/**
 * 사용자의 특정 글에 대한 반응 조회
 */
export async function getUserReaction(userId: string, postId: string) {
  const { data, error } = await supabase
    .from('reactions')
    .select('*')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * 게시글의 반응 통계 조회
 */
export async function getReactionStats(postId: string) {
  const { data, error } = await supabase
    .from('reaction_statistics')
    .select('*')
    .eq('post_id', postId);

  if (error) throw error;

  // 동의/다른의견별로 철학자 유형 분포 구성
  const stats = {
    agree: {} as Record<string, number>,
    disagree: {} as Record<string, number>,
  };

  data.forEach((row) => {
    if (row.reaction_type === 'agree') {
      stats.agree[row.user_type] = row.count;
    } else {
      stats.disagree[row.user_type] = row.count;
    }
  });

  return stats;
}

/**
 * 여러 게시글의 반응 통계 일괄 조회
 */
export async function getBulkReactionStats(postIds: string[]) {
  const { data, error } = await supabase
    .from('reaction_statistics')
    .select('*')
    .in('post_id', postIds);

  if (error) throw error;

  // 게시글별로 그룹화
  const statsByPost: Record<string, {
    agree: Record<string, number>;
    disagree: Record<string, number>;
  }> = {};

  postIds.forEach(postId => {
    statsByPost[postId] = { agree: {}, disagree: {} };
  });

  data.forEach((row) => {
    if (!statsByPost[row.post_id]) {
      statsByPost[row.post_id] = { agree: {}, disagree: {} };
    }

    if (row.reaction_type === 'agree') {
      statsByPost[row.post_id].agree[row.user_type] = row.count;
    } else {
      statsByPost[row.post_id].disagree[row.user_type] = row.count;
    }
  });

  return statsByPost;
}

/**
 * 사용자의 여러 게시글에 대한 반응 일괄 조회
 */
export async function getUserReactions(userId: string, postIds: string[]) {
  const { data, error } = await supabase
    .from('reactions')
    .select('*')
    .eq('user_id', userId)
    .in('post_id', postIds);

  if (error) throw error;

  // post_id를 키로 하는 맵으로 변환
  const reactionsMap: Record<string, typeof data[0]> = {};
  data.forEach((reaction) => {
    reactionsMap[reaction.post_id] = reaction;
  });

  return reactionsMap;
}

/**
 * 내가 반응한 글 목록
 */
export async function getMyReactedPosts(userId: string, reactionType?: 'agree' | 'disagree') {
  let query = supabase
    .from('reactions')
    .select(`
      *,
      posts(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (reactionType) {
    query = query.eq('reaction_type', reactionType);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}
