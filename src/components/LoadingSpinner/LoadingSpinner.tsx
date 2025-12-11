'use client';

import React from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'accent';
  overlay?: boolean;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary', 
  overlay = false, 
  message 
}) => {
  const spinnerElement = (
    <div className={`${styles.container} ${overlay ? styles.overlay : ''}`}>
      <div className={`${styles.spinner} ${styles[size]} ${styles[color]}`}>
        <div className={styles.ring}></div>
        <div className={styles.ring}></div>
        <div className={styles.ring}></div>
        <div className={styles.dot}></div>
      </div>
      {message && (
        <div className={styles.message}>
          {message}
        </div>
      )}
    </div>
  );

  return spinnerElement;
};

export default LoadingSpinner;