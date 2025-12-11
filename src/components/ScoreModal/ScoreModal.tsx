'use client';

import React, { useState, useEffect } from 'react';
import styles from './ScoreModal.module.css';
import { Contestant } from '@/lib/types';

interface ScoreModalProps {
  contestant: Contestant;
  currentScore: number | null | undefined;
  onSubmit: (score: number) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

const SCORE_OPTIONS = [7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0];

const ScoreModal: React.FC<ScoreModalProps> = ({
  contestant,
  currentScore,
  onSubmit,
  onClose,
  isSubmitting,
}) => {
  const [selectedScore, setSelectedScore] = useState<number | null>(
    currentScore ?? null
  );

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  const handleSubmit = async () => {
    if (selectedScore === null) return;
    await onSubmit(selectedScore);
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          disabled={isSubmitting}
          title="Đóng cửa sổ chấm điểm"
        >
          ✕
        </button>

        <div className={styles.content}>
          <div className={styles.imageSection}>
            <img
              src={contestant.IMAGE_URL}
              alt={contestant.HO_TEN}
              className={styles.image}
            />
          </div>

          <div className={styles.scoreSection}>
            <div className={styles.contestantInfo}>
              <div className={styles.sbd}>{contestant.SBD}</div>
              <div className={styles.name}>{contestant.HO_TEN}</div>
            </div>

            <div className={styles.scoreLabel}>Chọn điểm</div>

            <div className={styles.scoreGrid}>
              {SCORE_OPTIONS.map((score) => (
                <button
                  key={score}
                  className={`${styles.scoreButton} ${
                    selectedScore === score ? styles.selected : ''
                  }`}
                  onClick={() => setSelectedScore(score)}
                  disabled={isSubmitting}
                >
                  {score.toFixed(1)}
                </button>
              ))}
            </div>

            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={selectedScore === null || isSubmitting}
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi điểm & Tiếp theo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreModal;
