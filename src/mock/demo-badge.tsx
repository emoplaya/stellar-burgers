import React, { FC, useEffect, useState } from 'react';
import { onApiModeChange } from './install';
import styles from './demo-badge.module.css';

// Небольшая плашка, чтобы было понятно, что данные локальные
export const DemoBadge: FC = () => {
  const [isDemo, setIsDemo] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => onApiModeChange((mode) => setIsDemo(mode === 'demo')), []);

  if (!isDemo || hidden) return null;

  return (
    <div className={`${styles.badge} text text_type_main-small`}>
      <span>
        Демо-режим - API бургерной недоступен, заказы и аккаунты хранятся в
        вашем браузере
      </span>
      <button
        type='button'
        className={styles.close}
        aria-label='Скрыть'
        onClick={() => setHidden(true)}
      >
        ×
      </button>
    </div>
  );
};
