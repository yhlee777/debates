// lib/api/auth.ts - 인증 관련 API

import { supabase } from '@/lib/supabase';

export interface SignUpData {
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

/**
 * 회원가입
 */
export async function signUp({ email, password }: SignUpData) {
  // 1. Supabase Auth로 사용자 생성
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('회원가입에 실패했습니다.');

  // 2. Users 테이블에 사용자 정보 저장
  const { error: dbError } = await supabase
    .from('users')
    .insert({
      id: authData.user.id,
      email: authData.user.email!,
    });

  if (dbError) throw dbError;

  return authData;
}

/**
 * 로그인
 */
export async function signIn({ email, password }: SignInData) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * 로그아웃
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * 현재 세션 가져오기
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

/**
 * 현재 사용자 정보 가져오기
 */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * 비밀번호 재설정 이메일 전송
 */
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) throw error;
}

/**
 * 비밀번호 업데이트
 */
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
}
