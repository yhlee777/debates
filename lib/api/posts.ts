// lib/api/posts.ts - 게시글 관련 API

import { supabase } from '@/lib/supabase';

export interface CreatePostData {
  userId: string;
  title: string;
  content: string;
  authorType: string;
  authorPhilosopher: string;
}

export interface UpdatePostData {
  postId: string;
  title?: string;
  content?: string;
}

export interface PostFilters {
  authorType?: string;
  searchQuery?: string;
  limit?: number;
  offset?: number;
}

/**
 * 게시글 생성
 */
export async function createPost(data: CreatePostData) {
  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      user_id: data.userId,
      title: data.title,
      content: data.content,
      author_type: data.authorType,
      author_philosopher: data.authorPhilosopher,
    })
    .select()
    .single();

  if (error) throw error;
  return post;
}

/**
 * 게시글 목록 조회 (최신순)
 */
export async function getPosts(filters: PostFilters = {}) {
  let query = supabase
    .from('posts')
    .select(`
      *,
      users!posts_user_id_fkey(email)
    `)
    .order('created_at', { ascending: false });

  // 필터 적용
  if (filters.authorType) {
    query = query.eq('author_type', filters.authorType);
  }

  if (filters.searchQuery) {
    // pg_trgm을 사용한 유사도 검색 (한국어 지원)
    const { data: searchData, error: searchError } = await supabase
      .rpc('search_posts', { search_query: filters.searchQuery });
    
    if (searchError) throw searchError;
    return searchData;
  }

  // 페이지네이션
  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

/**
 * 게시글 상세 조회
 */
export async function getPost(postId: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      users!posts_user_id_fkey(email)
    `)
    .eq('id', postId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * 게시글 수정
 */
export async function updatePost(data: UpdatePostData) {
  const updateData: any = {};
  if (data.title) updateData.title = data.title;
  if (data.content) updateData.content = data.content;

  const { data: post, error } = await supabase
    .from('posts')
    .update(updateData)
    .eq('id', data.postId)
    .select()
    .single();

  if (error) throw error;
  return post;
}

/**
 * 게시글 삭제
 */
export async function deletePost(postId: string) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) throw error;
}

/**
 * 내가 작성한 게시글 목록
 */
export async function getMyPosts(userId: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * 대화가 활발한 글 (동의/다른의견이 비슷한 글)
 */
export async function getDialoguePosts(limit: number = 20) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .gt('agree_count', 5) // 최소 반응 수
    .gt('disagree_count', 5)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  // 동의/반대 비율이 비슷한 순으로 정렬
  return data.sort((a, b) => {
    const ratioA = Math.min(a.agree_count, a.disagree_count) / Math.max(a.agree_count, a.disagree_count);
    const ratioB = Math.min(b.agree_count, b.disagree_count) / Math.max(b.agree_count, b.disagree_count);
    return ratioB - ratioA;
  });
}

/**
 * 같은 철학 유형의 글
 */
export async function getSameTypePosts(philosopherType: string, limit: number = 20) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('author_type', philosopherType)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}