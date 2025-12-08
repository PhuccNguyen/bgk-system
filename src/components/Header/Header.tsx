'use client';

import React from 'react';
import styles from './Header.module.css';
import { Config } from '@/lib/types';

interface HeaderProps {
  config: Config;
  judgeId: string;
}

const Header: React.FC<HeaderProps> = ({ config, judgeId }) => {
  const getRoundLabel = (round: string) => {
    switch (round) {
      case 'CK1': return 'TOP 36';
      case 'CK2': return 'TOP 20';
      case 'CK3': return 'TOP 6';
      default: return round;
    }
  };

  const getSegmentLabel = (segment: string) => {
    switch (segment) {
      case 'DA_HOI': return 'DẠ HỘI';
      case 'THE_THAO': return 'THỂ THAO';
      case 'AO_DAI': return 'ÁO DÀI';
      case 'UNG_XU': return 'ỨNG XỬ';
      default: return segment;
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.logo}>
            <span className={styles.crown}>👑</span>
            <span className={styles.title}>BGK SYSTEM</span>
          </div>
        </div>

        <div className={styles.center}>
          <div className={styles.roundBadge}>
            {getRoundLabel(config.CURRENT_ROUND)}
          </div>
          <div className={styles.separator}>•</div>
          <div className={styles.segmentBadge}>
            {getSegmentLabel(config.CURRENT_SEGMENT)}
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.judgeInfo}>
            <span className={styles.judgeLabel}>Giám khảo</span>
            <span className={styles.judgeId}>{judgeId}</span>
          </div>
        </div>
      </div>

      {config.IS_LOCKED && (
        <div className={styles.lockedBanner}>
          <span className={styles.lockIcon}>🔒</span>
          <span>Hệ thống đã khóa - Cảm ơn Quý Giám Khảo</span>
        </div>
      )}
    </header>
  );
};

export default Header;
