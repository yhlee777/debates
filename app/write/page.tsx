'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './write.module.css';
import ProfileDropdown from '@/components/ProfileDropdown';
import { PhilosopherType } from '@/types';

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showType, setShowType] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userPhilosopher, setUserPhilosopher] = useState<PhilosopherType | null>(null);
  const [charCount, setCharCount] = useState(0);

  const MAX_TITLE_LENGTH = 100;
  const MAX_CONTENT_LENGTH = 3000;

  useEffect(() => {
    // 로그인 체크
    const isLoggedIn = localStorage.getItem('is_logged_in');
    if (!isLoggedIn) {
      router.push('/auth');
      return;
    }

    // 철학자 정보 가져오기
    const storedType = localStorage.getItem('philosopher_type');
    if (storedType) {
      setUserPhilosopher(JSON.parse(storedType));
    } else {
      // 철학 테스트를 하지 않았다면 테스트 페이지로
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 유효성 검사
    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }

    if (title.length > MAX_TITLE_LENGTH) {
      setError(`제목은 ${MAX_TITLE_LENGTH}자 이내로 작성해주세요.`);
      return;
    }

    if (!content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }

    if (content.length < 50) {
      setError('최소 50자 이상 작성해주세요.');
      return;
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      setError(`내용은 ${MAX_CONTENT_LENGTH}자 이내로 작성해주세요.`);
      return;
    }

    setLoading(true);

    try {
      // 실제로는 서버에 저장
      const newPost = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        authorType: isAnonymous ? '익명의 철학자' : (showType ? userPhilosopher?.type : '철학자'),
        authorPhilosopher: isAnonymous ? '?' : (showType ? userPhilosopher?.philosopher : '?'),
        createdAt: new Date(),
        userId: JSON.parse(localStorage.getItem('current_user') || '{}').id,
        showType,
        isAnonymous
      };

      // 임시: localStorage에 저장
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      posts.unshift(newPost);
      localStorage.setItem('posts', JSON.stringify(posts));

      // 성공 시 상세 페이지로 이동
      router.push(`/post/${newPost.id}`);
    } catch (err) {
      setError('글 작성 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (title || content) {
      if (confirm('작성 중인 내용이 사라집니다. 취소하시겠습니까?')) {
        router.push('/feed');
      }
    } else {
      router.push('/feed');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>생각 나누기</h1>
            <p className={styles.pageSubtitle}>당신의 철학적 견해를 공유해주세요</p>
          </div>
          <ProfileDropdown />
        </div>
      </header>

      <main className={styles.main}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.authorSection}>
            <div className={styles.authorInfo}>
              {userPhilosopher && (
                <>
                  <span className={styles.authorLabel}>작성자</span>
                  <div className={styles.authorDisplay}>
                    {isAnonymous ? (
                      <span className={styles.anonymous}>익명의 철학자</span>
                    ) : showType ? (
                      <>
                        <span className={styles.authorType}>{userPhilosopher.type}</span>
                        <span className={styles.authorPhilosopher}>
                          ({userPhilosopher.philosopher}의 영향을 받은)
                        </span>
                      </>
                    ) : (
                      <span className={styles.hiddenType}>철학자 유형 비공개</span>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className={styles.privacyOptions}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={showType}
                  onChange={(e) => {
                    setShowType(e.target.checked);
                    if (!e.target.checked) {
                      setIsAnonymous(false);
                    }
                  }}
                  disabled={isAnonymous}
                />
                <span>내 철학자 유형 공개</span>
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => {
                    setIsAnonymous(e.target.checked);
                    if (e.target.checked) {
                      setShowType(false);
                    }
                  }}
                />
                <span>완전 익명으로 작성</span>
              </label>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="title" className={styles.label}>
              제목
              <span className={styles.charCount}>
                {title.length} / {MAX_TITLE_LENGTH}
              </span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="어떤 주제에 대해 이야기하고 싶으신가요?"
              className={styles.titleInput}
              maxLength={MAX_TITLE_LENGTH}
              disabled={loading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="content" className={styles.label}>
              내용
              <span className={styles.charCount}>
                {content.length} / {MAX_CONTENT_LENGTH}
              </span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setCharCount(e.target.value.length);
              }}
              placeholder={`당신의 철학적 견해를 자유롭게 표현해주세요.

좋은 글의 예시:
- 구체적인 사례나 경험을 포함
- 논리적 근거 제시
- 다양한 관점 고려
- 건설적인 문제 제기

최소 50자 이상 작성해주세요.`}
              className={styles.contentInput}
              maxLength={MAX_CONTENT_LENGTH}
              disabled={loading}
            />
            {content.length > 0 && content.length < 50 && (
              <p className={styles.minLengthWarning}>
                최소 50자 이상 작성해주세요. (현재: {content.length}자)
              </p>
            )}
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div className={styles.guidelines}>
            <h3 className={styles.guidelinesTitle}>작성 가이드라인</h3>
            <ul className={styles.guidelinesList}>
              <li>상대방을 존중하는 언어를 사용해주세요</li>
              <li>개인적 공격이나 비방은 삼가해주세요</li>
              <li>근거 있는 주장을 펼쳐주세요</li>
              <li>다양한 관점을 인정하는 열린 자세를 가져주세요</li>
            </ul>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || !title.trim() || !content.trim() || content.length < 50}
            >
              {loading ? '작성 중...' : '작성 완료'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}