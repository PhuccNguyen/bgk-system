'use client';

import React from 'react';
import styles from './Header.module.css';
import { Config } from '@/lib/types';
import Image from 'next/image';

interface HeaderProps {
  config: Config;
  judgeId: string;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ config, judgeId, onLogout }) => {
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

  const getSegmentIcon = (segment: string) => {
    switch (segment) {
      case 'DA_HOI': return '◈';
      case 'THE_THAO': return '◉';
      case 'AO_DAI': return '◆';
      case 'UNG_XU': return '◎';
      default: return '▣';
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.gradientBar}></div>
      
      <div className={styles.container}>
        {/* Left Section - Logo */}
        <div className={styles.left}>
          <div className={styles.logoGroup}>
            <Image
              src="/PreviewSeo/tingnecticon.png"
              alt="TINGNECT"
              width={50}
              height={50}
              className={styles.logo}
            />
            <div className={styles.logoText}>
              <span className={styles.logoTitle}>BGK SYSTEM</span>
              <span className={styles.logoSubtitle}>TINGNECT BY TRUSTLABS</span>
            </div>
          </div>
        </div>

        {/* Center Section - Round & Segment */}
        <div className={styles.center}>
          <div className={styles.statusBar}>
            <div className={styles.roundBadge}>
              <span className={styles.badgeIcon}>◆</span>
              <span className={styles.badgeText}>{getRoundLabel(config.CURRENT_ROUND)}</span>
            </div>
            
            <div className={styles.separator}>
              <span className={styles.separatorDot}></span>
            </div>
            
            <div className={styles.segmentBadge}>
              <span className={styles.badgeIcon}>{getSegmentIcon(config.CURRENT_SEGMENT)}</span>
              <span className={styles.badgeText}>{getSegmentLabel(config.CURRENT_SEGMENT)}</span>
            </div>
          </div>
          
          <div className={styles.batchInfo}>
            <span className={styles.batchLabel}>Batch:</span>
            <span className={styles.batchValue}>{config.CURRENT_BATCH}</span>
          </div>
        </div>

        {/* Right Section - Judge Info */}
        <div className={styles.right}>
          <div className={styles.judgeCard}>
            <div className={styles.judgeAvatar}>
              <span className={styles.avatarIcon}>◉</span>
            </div>
            <div className={styles.judgeInfo}>
              <span className={styles.judgeLabel}>Giám khảo</span>
              <span className={styles.judgeName}>{judgeId}</span>
            </div>
          </div>
          
          {onLogout && (
            <button 
              className={styles.logoutButton} 
              onClick={() => {
                if (window.confirm('Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?')) {
                  onLogout();
                }
              }}
              title="Đăng xuất khỏi hệ thống"
            >
              <span className={styles.logoutIcon}>⏻</span>
              <span className={styles.logoutText}>Thoát</span>
            </button>
          )}
        </div>
      </div>

      {/* Locked Banner */}
      {config.IS_LOCKED && (
        <div className={styles.lockedBanner}>
          <div className={styles.lockedContent}>
            <span className={styles.lockIcon}>◈</span>
            <div className={styles.lockedTextGroup}>
              <span className={styles.lockedText}>Hệ thống đã khóa hoàn tất</span>
              <span className={styles.lockedSubtext}>Cảm ơn Quý Giám Khảo đã hoàn thành chấm điểm - TingNect Ecosystem</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
