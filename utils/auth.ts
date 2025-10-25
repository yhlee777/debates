/* /utils/auth.ts - 인증 관련 유틸리티 */

// 쿠키 설정 (30일 유지)
export const setCookie = (name: string, value: string, days: number = 30) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

// 쿠키 가져오기
export const getCookie = (name: string): string | null => {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// 쿠키 삭제
export const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
};

// 로그인 상태 확인
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const isLoggedIn = localStorage.getItem('is_logged_in');
  const cookieLoggedIn = getCookie('is_logged_in');
  
  return isLoggedIn === 'true' || cookieLoggedIn === 'true';
};

// 로그인 처리
export const login = (email: string, userId: string) => {
  localStorage.setItem('is_logged_in', 'true');
  localStorage.setItem('current_user', JSON.stringify({ email, id: userId }));
  setCookie('is_logged_in', 'true', 30); // 30일 유지
  setCookie('user_email', email, 30);
};

// 로그아웃 처리
export const logout = () => {
  localStorage.removeItem('is_logged_in');
  localStorage.removeItem('current_user');
  localStorage.removeItem('philosophy_test_completed');
  localStorage.removeItem('philosopher_type');
  deleteCookie('is_logged_in');
  deleteCookie('user_email');
};

// 현재 사용자 가져오기
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('current_user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};