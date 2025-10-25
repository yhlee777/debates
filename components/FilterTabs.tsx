'use client';

import styles from './FilterTabs.module.css';

interface FilterTabsProps {
  currentFilter: 'recent' | 'dialogue' | 'my-type';
  onFilterChange: (filter: 'recent' | 'dialogue' | 'my-type') => void;
}

export default function FilterTabs({ currentFilter, onFilterChange }: FilterTabsProps) {
  return (
    <div className={styles.container}>
      <button
        className={`${styles.tab} ${currentFilter === 'recent' ? styles.active : ''}`}
        onClick={() => onFilterChange('recent')}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.icon}
        >
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M8 4V8L11 11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        최신 글
      </button>

      <button
        className={`${styles.tab} ${currentFilter === 'dialogue' ? styles.active : ''}`}
        onClick={() => onFilterChange('dialogue')}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.icon}
        >
          <path
            d="M3 5.5C3 4.11929 4.11929 3 5.5 3H10.5C11.8807 3 13 4.11929 13 5.5V8.5C13 9.88071 11.8807 11 10.5 11H8L5 13V11H5.5C4.11929 11 3 9.88071 3 8.5V5.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        활발한 대화
      </button>

      <button
        className={`${styles.tab} ${currentFilter === 'my-type' ? styles.active : ''}`}
        onClick={() => onFilterChange('my-type')}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.icon}
        >
          <circle cx="8" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M3 14C3 11.7909 5.23858 10 8 10C10.7614 10 13 11.7909 13 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        나와 유사한
      </button>
    </div>
  );
}