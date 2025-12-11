'use client';

import React, { useState } from 'react';
import styles from './SpotlightMode.module.css';
import { Contestant } from '@/lib/types';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';

interface SpotlightModeProps {
  contestant: Contestant;
  myScore: number | null;
  onSubmitScore: (sbd: string, score: number) => Promise<void>;
}

const SCORE_OPTIONS = [7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0];

const SpotlightMode: React.FC<SpotlightModeProps> = ({
  contestant,
  myScore,
  onSubmitScore,
}) => {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasScored = myScore !== null && myScore !== undefined;

  const handleScoreSelect = (score: number) => {
    if (hasScored) return;
    setSelectedScore(score);
  };

  const handleSubmitClick = () => {
    if (selectedScore === null) return;
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (selectedScore === null) return;

    setIsSubmitting(true);
    await onSubmitScore(contestant.SBD, selectedScore);
    setIsSubmitting(false);
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.spotlight}>
        <div className={styles.imageSection}>
          <div className={styles.imageWrapper}>
            <img
              src={contestant.IMAGE_URL}
              alt={contestant.HO_TEN}
              className={styles.image}
            />
            {hasScored && (
              <div className={styles.scoredBadge}>
                <span className={styles.scoredIcon}>◉</span>
                <span className={styles.scoredText}>Đã chấm</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.contestantInfo}>
            <div className={styles.sbd}>{contestant.SBD}</div>
            <div className={styles.name}>{contestant.HO_TEN}</div>
            <div className={styles.subtitle}>VÒNG ỨNG XỬ - CHUNG KẾT</div>
          </div>

          {!hasScored ? (
            <div className={styles.scorePanel}>
              <div className={styles.scoreLabel}>Chọn điểm của bạn</div>

              <div className={styles.scoreGrid}>
                {SCORE_OPTIONS.map((score) => (
                  <button
                    key={score}
                    className={`${styles.scoreButton} ${
                      selectedScore === score ? styles.selected : ''
                    }`}
                    onClick={() => handleScoreSelect(score)}
                    disabled={isSubmitting}
                  >
                    {score.toFixed(1)}
                  </button>
                ))}
              </div>

              <button
                className={styles.submitButton}
                onClick={handleSubmitClick}
                disabled={selectedScore === null || isSubmitting}
              >
                {isSubmitting ? '○ Đang gửi...' : '▶ Xác nhận điểm'}
              </button>
            </div>
          ) : (
            <div className={styles.completedPanel}>
              <div className={styles.completedIcon}>◉</div>
              <div className={styles.completedScore}>{myScore}</div>
              <div className={styles.completedText}>Điểm đã được ghi nhận</div>
            </div>
          )}
        </div>
      </div>

      {showConfirm && selectedScore !== null && (
        <ConfirmDialog
          message={`Xác nhận chấm ${selectedScore.toFixed(1)} điểm cho thí sinh ${contestant.SBD} - ${contestant.HO_TEN}?`}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default SpotlightMode;
