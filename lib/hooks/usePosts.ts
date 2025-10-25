// lib/hooks/usePosts.ts - 게시글 관련 Hooks

import useSWR from 'swr';
import { getPosts, getPost, getDialoguePosts, getSameTypePosts, PostFilters } from '@/lib/api/posts';

/**
 * 게시글 목록 Hook
 */
export function usePosts(filters?: PostFilters) {
  const { data, error, mutate } = useSWR(
    ['posts', filters],
    () => getPosts(filters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    posts: data,
    loading: !error && !data,
    error,
    mutate,
  };
}

/**
 * 게시글 상세 Hook
 */
export function usePost(postId: string | null) {
  const { data, error, mutate } = useSWR(
    postId ? ['post', postId] : null,
    () => getPost(postId!),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    post: data,
    loading: !error && !data,
    error,
    mutate,
  };
}

/**
 * 대화가 활발한 글 Hook
 */
export function useDialoguePosts(limit?: number) {
  const { data, error, mutate } = useSWR(
    ['dialogue-posts', limit],
    () => getDialoguePosts(limit),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    posts: data,
    loading: !error && !data,
    error,
    mutate,
  };
}

/**
 * 같은 철학 유형의 글 Hook
 */
export function useSameTypePosts(philosopherType: string | null, limit?: number) {
  const { data, error, mutate } = useSWR(
    philosopherType ? ['same-type-posts', philosopherType, limit] : null,
    () => getSameTypePosts(philosopherType!, limit),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    posts: data,
    loading: !error && !data,
    error,
    mutate,
  };
}
