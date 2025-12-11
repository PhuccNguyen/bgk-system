'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './GridMode.module.css';
import { Contestant } from '@/lib/types';

interface GridModeProps {
  contestants: Contestant[];
  myScores: { [sbd: string]: number | null };
  onSubmitScore: (sbd: string, score: number) => Promise<void>;
}

const SCORE_OPTIONS = [7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0];

const GridMode: React.FC<GridModeProps> = ({
  contestants,
  myScores,
  onSubmitScore,
}) => {
  const [selectedContestant, setSelectedContestant] = useState<Contestant | null>(null);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => {
      clearTimeout(timer);
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (selectedContestant) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedContestant]);


  const handleCardClick = (contestant: Contestant) => {
    const score = myScores[contestant.SBD];
    const hasScored = score !== null && score !== undefined;
    
    if (!hasScored) {
      setSelectedContestant(contestant);
      setSelectedScore(null);
    }
  };

  const handleScoreSelect = (score: number) => {
    setSelectedScore(score);
  };

  const handleSubmit = async () => {
    if (!selectedContestant || selectedScore === null) return;

    setIsSubmitting(true);
    await onSubmitScore(selectedContestant.SBD, selectedScore);
    setIsSubmitting(false);

    // Auto-advance to next contestant
    const currentIndex = contestants.findIndex(c => c.SBD === selectedContestant.SBD);
    if (currentIndex < contestants.length - 1) {
      const nextContestant = contestants[currentIndex + 1];
      const nextScore = myScores[nextContestant.SBD];
      const nextHasScored = nextScore !== null && nextScore !== undefined;
      
      if (!nextHasScored) {
        setSelectedContestant(nextContestant);
        setSelectedScore(null);
      } else {
        setSelectedContestant(null);
        setSelectedScore(null);
      }
    } else {
      setSelectedContestant(null);
      setSelectedScore(null);
    }
  };

  const handleModalClose = () => {
    setSelectedContestant(null);
    setSelectedScore(null);
  };

  return (
    <>
      {/* Grid Layout */}
      <div className={styles.gridContainer}>
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
                {/* Image */}
                <div className={styles.imageContainer}>
                  <img
                    src={contestant.IMAGE_URL}
                    alt={contestant.HO_TEN}
                    className={styles.image}
                    loading="lazy"
                  />
                  
                  {/* Score Badge */}
                  {hasScored && (
                    <div className={styles.scoreBadge}>
                      <span className={styles.scoreIcon}>✓</span>
                      <span className={styles.scoreText}>{score}</span>
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className={styles.info}>
                  <div className={styles.sbd}>{contestant.SBD}</div>
                  <div className={styles.name}>{contestant.HO_TEN}</div>
                </div>

                {/* Status Indicator */}
                <div className={`${styles.status} ${hasScored ? styles.statusScored : styles.statusPending}`}>
                  {hasScored ? '✓ Đã chấm' : '⏳ Chờ chấm'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedContestant && mounted && createPortal(
        <div 
          className={styles.modalBackdrop}
          onClick={handleModalClose}
          data-portal="modal"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2147483647,
            background: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--spacing-lg)',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div 
            className={styles.modal} 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              position: 'relative',
              zIndex: 2147483647
            }}
          >
            {/* Close Button */}
            <button className={styles.closeBtn} onClick={handleModalClose}>
              <span>✕</span>
            </button>

            <div className={styles.modalContent}>
              {/* Left Side - Image */}
              <div className={styles.modalImage}>
                <img
                  src={selectedContestant.IMAGE_URL}
                  alt={selectedContestant.HO_TEN}
                />
                <div className={styles.modalSbd}>{selectedContestant.SBD}</div>
              </div>

              {/* Right Side - Scoring */}
              <div className={styles.modalScoring}>
                <div className={styles.modalHeader}>
                  <h2 className={styles.modalName}>{selectedContestant.HO_TEN}</h2>
                  <p className={styles.modalSubtitle}>Chọn điểm chấm</p>
                </div>

                <div className={styles.scoreGrid}>
                  {SCORE_OPTIONS.map((score) => (
                    <button
                      key={score}
                      className={`${styles.scoreBtn} ${selectedScore === score ? styles.scoreBtnSelected : ''}`}
                      onClick={() => handleScoreSelect(score)}
                      disabled={isSubmitting}
                    >
                      <span className={styles.scoreBtnValue}>{score.toFixed(1)}</span>
                    </button>
                  ))}
                </div>

                <button
                  className={styles.submitBtn}
                  onClick={handleSubmit}
                  disabled={selectedScore === null || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className={styles.spinner}></span>
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <span className={styles.submitIcon}>✓</span>
                      <span>Xác nhận điểm</span>
                    </>
                  )}
                </button>

                {/* Progress Info */}
                <div className={styles.progressInfo}>
                  <span>
                    Đã chấm: {Object.values(myScores).filter(s => s !== null && s !== undefined).length}/{contestants.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default GridMode;
