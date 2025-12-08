'use client';

import React, { useState } from 'react';
import styles from './SplitMode.module.css';
import { Contestant } from '@/lib/types';

interface SplitModeProps {
  contestants: Contestant[];
  myScores: { [sbd: string]: number | null };
  onSubmitScore: (sbd: string, score: number) => Promise<void>;
}

const SCORE_OPTIONS = [7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0];

const SplitMode: React.FC<SplitModeProps> = ({
  contestants,
  myScores,
  onSubmitScore,
}) => {
  const [selectedScores, setSelectedScores] = useState<{ [sbd: string]: number }>({});
  const [submittingFor, setSubmittingFor] = useState<string | null>(null);

  const handleScoreSelect = (sbd: string, score: number) => {
    setSelectedScores(prev => ({ ...prev, [sbd]: score }));
  };

  const handleSubmit = async (sbd: string) => {
    const score = selectedScores[sbd];
    if (score === undefined) return;

    setSubmittingFor(sbd);
    await onSubmitScore(sbd, score);
    setSubmittingFor(null);
    setSelectedScores(prev => {
      const updated = { ...prev };
      delete updated[sbd];
      return updated;
    });
  };

  return (
    <div className={styles.splitContainer}>
      {contestants.map((contestant) => {
        const submittedScore = myScores[contestant.SBD];
        const hasScored = submittedScore !== null && submittedScore !== undefined;
        const selectedScore = selectedScores[contestant.SBD];
        const isSubmitting = submittingFor === contestant.SBD;

        return (
          <div key={contestant.SBD} className={styles.column}>
            <div className={styles.imageWrapper}>
              <img
                src={contestant.IMAGE_URL}
                alt={contestant.HO_TEN}
                className={styles.image}
              />

              {hasScored && (
                <div className={styles.scoredOverlay}>
                  <span className={styles.scoredValue}>{submittedScore}</span>
                </div>
              )}
            </div>

            <div className={styles.sbdBadge}>{contestant.SBD}</div>

            <div className={styles.infoBar}>
              <span className={styles.name}>{contestant.HO_TEN}</span>
            </div>

            {!hasScored && (
              <div className={styles.scorePanel}>
                <div className={styles.scoreButtons}>
                  {SCORE_OPTIONS.map((score) => (
                    <button
                      key={score}
                      className={`${styles.scoreButton} ${
                        selectedScore === score ? styles.selected : ''
                      }`}
                      onClick={() => handleScoreSelect(contestant.SBD, score)}
                      disabled={isSubmitting}
                    >
                      {score.toFixed(1)}
                    </button>
                  ))}
                </div>

                <button
                  className={styles.submitButton}
                  onClick={() => handleSubmit(contestant.SBD)}
                  disabled={selectedScore === undefined || isSubmitting}
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi điểm'}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SplitMode;
