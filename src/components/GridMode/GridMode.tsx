'use client';

import React, { useState } from 'react';
import styles from './GridMode.module.css';
import { Contestant } from '@/lib/types';
import ScoreModal from '../ScoreModal/ScoreModal';

interface GridModeProps {
  contestants: Contestant[];
  myScores: { [sbd: string]: number | null };
  onSubmitScore: (sbd: string, score: number) => Promise<void>;
}

const GridMode: React.FC<GridModeProps> = ({
  contestants,
  myScores,
  onSubmitScore,
}) => {
  const [selectedContestant, setSelectedContestant] = useState<Contestant | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCardClick = (contestant: Contestant) => {
    setSelectedContestant(contestant);
  };

  const handleScoreSubmit = async (score: number) => {
    if (!selectedContestant) return;

    setIsSubmitting(true);
    await onSubmitScore(selectedContestant.SBD, score);
    setIsSubmitting(false);

    // Auto-advance to next contestant
    const currentIndex = contestants.findIndex(c => c.SBD === selectedContestant.SBD);
    if (currentIndex < contestants.length - 1) {
      setSelectedContestant(contestants[currentIndex + 1]);
    } else {
      setSelectedContestant(null);
    }
  };

  const handleModalClose = () => {
    setSelectedContestant(null);
  };

  return (
    <>
      <div className={styles.grid}>
        {contestants.map((contestant) => {
          const score = myScores[contestant.SBD];
          const hasScored = score !== null && score !== undefined;

          return (
            <div
              key={contestant.SBD}
              className={`${styles.card} ${hasScored ? styles.scored : ''}`}
              onClick={() => handleCardClick(contestant)}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={contestant.IMAGE_URL}
                  alt={contestant.HO_TEN}
                  className={styles.image}
                />
                {hasScored && (
                  <div className={styles.scoreOverlay}>
                    <span className={styles.scoreValue}>{score}</span>
                  </div>
                )}
              </div>

              <div
                className={`${styles.sbdBadge} ${hasScored ? styles.sbdScored : ''}`}
              >
                {contestant.SBD}
              </div>

              <div className={styles.nameBar}>
                <span className={styles.name}>{contestant.HO_TEN}</span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedContestant && (
        <ScoreModal
          contestant={selectedContestant}
          currentScore={myScores[selectedContestant.SBD]}
          onSubmit={handleScoreSubmit}
          onClose={handleModalClose}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
};

export default GridMode;
