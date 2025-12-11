'use client';

import React, { useState, useEffect } from 'react';
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
  const [activeContestant, setActiveContestant] = useState<string | null>(() => {
    const firstUnscored = contestants.find(c => {
      const score = myScores[c.SBD];
      return score === null || score === undefined;
    });
    return firstUnscored ? firstUnscored.SBD : null;
  });

  const handleScoreSelect = (sbd: string, score: number) => {
    setSelectedScores(prev => ({ ...prev, [sbd]: score }));
    setActiveContestant(sbd);
  };

  const handleSubmit = async (sbd: string) => {
    const score = selectedScores[sbd];
    if (score === undefined) return;

    setSubmittingFor(sbd);
    await onSubmitScore(sbd, score);
    setSubmittingFor(null);
    
    // Clear selected score after submit
    setSelectedScores(prev => {
      const updated = { ...prev };
      delete updated[sbd];
      return updated;
    });

    // Move focus to next unscored contestant
    const currentIndex = contestants.findIndex(c => c.SBD === sbd);
    const nextContestants = contestants.slice(currentIndex + 1);
    const nextUnscored = nextContestants.find(c => {
      const score = myScores[c.SBD];
      return score === null || score === undefined;
    });
    
    if (nextUnscored) {
      setActiveContestant(nextUnscored.SBD);
    }
  };

  const handleQuickSubmitBoth = async () => {
    const unscored = contestants.filter(c => {
      const score = myScores[c.SBD];
      return score === null || score === undefined;
    });

    for (const contestant of unscored) {
      const score = selectedScores[contestant.SBD];
      if (score !== undefined) {
        await handleSubmit(contestant.SBD);
      }
    }
  };

  const allSelected = contestants.every(c => {
    const submitted = myScores[c.SBD];
    const selected = selectedScores[c.SBD];
    return (submitted !== null && submitted !== undefined) || selected !== undefined;
  });

  const bothScored = contestants.every(c => {
    const score = myScores[c.SBD];
    return score !== null && score !== undefined;
  });

  return (
    <div className={styles.splitContainer}>
      {/* Contestants Grid */}
      <div className={styles.contestantsGrid}>
        {contestants.map((contestant, index) => {
          const submittedScore = myScores[contestant.SBD];
          const hasScored = submittedScore !== null && submittedScore !== undefined;
          const selectedScore = selectedScores[contestant.SBD];
          const isSubmitting = submittingFor === contestant.SBD;
          const isActive = activeContestant === contestant.SBD;

          return (
            <div 
              key={contestant.SBD} 
              className={`${styles.contestantCard} ${hasScored ? styles.cardScored : ''} ${isActive ? styles.cardActive : ''}`}
            >
              {/* Position Label */}
              <div className={styles.positionLabel}>
                {index === 0 ? 'Trái' : 'Phải'}
              </div>

              {/* Image Container */}
              <div className={styles.imageContainer}>
                <div className={styles.imageWrapper}>
                  <img
                    src={contestant.IMAGE_URL}
                    alt={contestant.HO_TEN}
                    className={styles.image}
                    loading="eager"
                  />
                  
                  {/* Scored Overlay */}
                  {hasScored && (
                    <div className={styles.scoredOverlay}>
                      <div className={styles.scoredCheck}>✓</div>
                      <div className={styles.scoredValue}>{submittedScore}</div>
                      <div className={styles.scoredLabel}>Đã chấm</div>
                    </div>
                  )}

                  {/* Loading Overlay */}
                  {isSubmitting && (
                    <div className={styles.loadingOverlay}>
                      <div className={styles.loadingSpinner}></div>
                      <div className={styles.loadingText}>Đang gửi...</div>
                    </div>
                  )}
                </div>

                {/* SBD Badge */}
                <div className={`${styles.sbdBadge} ${hasScored ? styles.sbdScored : ''}`}>
                  {contestant.SBD}
                </div>
              </div>

              {/* Info Section */}
              <div className={styles.infoSection}>
                <div className={styles.contestantName}>{contestant.HO_TEN}</div>
                
                {!hasScored && (
                  <div className={styles.statusBadge}>
                    {selectedScore !== undefined ? (
                      <span className={styles.statusReady}>✓ Đã chọn: {selectedScore}</span>
                    ) : (
                      <span className={styles.statusWaiting}>⏳ Chờ chấm điểm</span>
                    )}
                  </div>
                )}

                {hasScored && (
                  <div className={styles.completedBadge}>
                    ✓ Hoàn thành
                  </div>
                )}
              </div>

              {/* Score Panel */}
              {!hasScored && (
                <div className={styles.scorePanel}>
                  <div className={styles.scorePanelLabel}>Chọn điểm</div>
                  
                  <div className={styles.scoreGrid}>
                    {SCORE_OPTIONS.map((score) => (
                      <button
                        key={score}
                        className={`${styles.scoreBtn} ${selectedScore === score ? styles.scoreBtnSelected : ''}`}
                        onClick={() => handleScoreSelect(contestant.SBD, score)}
                        disabled={isSubmitting}
                      >
                        {score.toFixed(1)}
                      </button>
                    ))}
                  </div>

                  <button
                    className={styles.submitBtn}
                    onClick={() => handleSubmit(contestant.SBD)}
                    disabled={selectedScore === undefined || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className={styles.btnSpinner}></span>
                        <span>Đang gửi...</span>
                      </>
                    ) : (
                      <>
                        <span className={styles.btnIcon}>✓</span>
                        <span>Xác nhận</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Submit All Button */}
      {!bothScored && allSelected && (
        <div className={styles.quickSubmitContainer}>
          <button
            className={styles.quickSubmitBtn}
            onClick={handleQuickSubmitBoth}
            disabled={submittingFor !== null}
          >
            <span>Gửi tất cả điểm</span>
          </button>
        </div>
      )}

      {/* Progress Indicator */}
      <div className={styles.progressBar}>
        <div className={styles.progressLabel}>
          Tiến độ: {contestants.filter(c => myScores[c.SBD] !== null && myScores[c.SBD] !== undefined).length}/{contestants.length}
        </div>
        <div className={styles.progressTrack}>
          <div 
            className={styles.progressFill}
            style={{ 
              width: `${(contestants.filter(c => myScores[c.SBD] !== null && myScores[c.SBD] !== undefined).length / contestants.length) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SplitMode;
