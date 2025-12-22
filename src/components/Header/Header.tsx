'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Header.module.css';
import { Config } from '@/lib/types';
import Image from 'next/image';

interface HeaderProps {
  config: Config;
  judgeId: string;
  judgeInfo?: { fullName: string; image?: string };
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ config, judgeId, judgeInfo, onLogout }) => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  // Debug info
  console.log('🔍 [Header] judgeInfo:', judgeInfo);
  console.log('🖼️ [Header] image URL:', judgeInfo?.image);
  console.log('📊 [Header] Has image?:', !!judgeInfo?.image);
  console.log('📊 [Header] Image length:', judgeInfo?.image?.length);
  
  // Test specific users
  if (judgeId === 'ngannguyen' || judgeId === 'thanhthanh') {
    console.log(`🧪 [Header] Testing user ${judgeId}:`, {
      fullName: judgeInfo?.fullName,
      imageExists: !!judgeInfo?.image,
      imageUrl: judgeInfo?.image
    });
  }
  
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
              {judgeInfo?.image && judgeInfo.image.trim() !== '' ? (
                <div className={styles.imageContainer}>
                  <Image
                    src={judgeInfo.image}
                    alt={judgeInfo.fullName || judgeId}
                    width={48}
                    height={48}
                    className={styles.avatarImage}
                    loading="lazy"
                    onError={(e) => {
                      console.error('❌ [Header] Judge image load error:', judgeInfo.image);
                      e.currentTarget.style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log('✅ [Header] Judge image loaded:', judgeInfo.image);
                    }}
                  />
                </div>
              ) : (
                <span className={styles.avatarIcon}>👤</span>
              )}
            </div>
            <div className={styles.judgeContent}>
              <div className={styles.judgeInfo}>
                <span className={styles.judgeLabel}>Giám khảo</span>
                <span className={styles.judgeName}>{judgeInfo?.fullName || judgeId}</span>
              </div>
              
              {onLogout && (
                <button 
                  className={styles.logoutButton} 
                  onClick={() => setShowLogoutDialog(true)}
                  title="Đăng xuất khỏi hệ thống"
                >
                  <span className={styles.logoutIcon}>⏻</span>
                  <span className={styles.logoutText}>Đăng xuất</span>
                </button>
              )}
            </div>
          </div>
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
      
      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && typeof document !== 'undefined' && createPortal(
        <div className={styles.dialogOverlay} onClick={() => setShowLogoutDialog(false)}>
          <div className={styles.dialogContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.dialogHeader}>
              <div className={styles.dialogIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <h3 className={styles.dialogTitle}>Xác nhận đăng xuất</h3>
            </div>
            <div className={styles.dialogBody}>
              <p className={styles.dialogMessage}>
                Bạn có chắc chắn muốn đăng xuất khỏi hệ thống chấm điểm?
              </p>
              <p className={styles.dialogSubmessage}>
                Mọi thay đổi chưa lưu sẽ bị mất.
              </p>
            </div>
            <div className={styles.dialogActions}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowLogoutDialog(false)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <span>Hủy bỏ</span>
              </button>
              <button 
                className={styles.confirmButton}
                onClick={() => {
                  setShowLogoutDialog(false);
                  onLogout?.();
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};

export default Header;
