'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Header from '@/components/Header/Header';
import LoginForm from '@/components/LoginForm/LoginForm';
import GridMode from '@/components/GridMode/GridMode';
import SplitMode from '@/components/SplitMode/SplitMode';
import SpotlightMode from '@/components/SpotlightMode/SpotlightMode';
import { getSession, clearSession } from '@/lib/auth';
import { Config, Contestant, DisplayMode, AuthSession } from '@/lib/types';
import styles from './page.module.css';

export default function Home() {
  // Auth State - Load session lazily on client side
  const [session, setSession] = useState<AuthSession | null>(() => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const saved = getSession();
      console.log('🔐 [page.tsx] Initial session load:', saved);
      console.log('🖼️ [page.tsx] Session image:', saved?.image);
      return saved;
    }
    return null;
  });

  // App State
  const [config, setConfig] = useState<Config | null>(null);
  const [onStageContestants, setOnStageContestants] = useState<Contestant[]>([]);
  const [myScores, setMyScores] = useState<{ [sbd: string]: number | null }>({});
  const [displayMode, setDisplayMode] = useState<DisplayMode>('LOCKED');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFloatingLogoutDialog, setShowFloatingLogoutDialog] = useState(false);


  // Determine Display Mode
  const determineDisplayMode = useCallback((
    config: Config,
    onStageCount: number
  ): DisplayMode => {
    // 1. Nếu không có thí sinh trên sân khấu -> LOCKED
    if (onStageCount === 0) {
      return 'LOCKED';
    }
    
    // 2. Có thí sinh trên sân khấu -> luôn hiển thị để BGK chấm điểm
    // (Không tự động khóa khi đang có thí sinh)
    
    // 3. Xác định mode hiển thị theo số thí sinh
    if (onStageCount === 1) return 'SPOTLIGHT';
    if (onStageCount === 2) return 'SPLIT';
    return 'GRID';
  }, []);

  // Load Data
  const loadData = useCallback(async () => {
    if (!session) return;

    console.log('🔄 [loadData] Starting data load...');

    try {
      setError(null);

      // Fetch config from API
      const configResponse = await fetch('/api/config');
      const configData = await configResponse.json();
      
      console.log('📋 [loadData] Config loaded:', configData);
      setConfig(configData);

      // Fetch contestants from API
      const contestantsResponse = await fetch('/api/contestants');
      const allContestants = await contestantsResponse.json();
      
      console.log('👥 [loadData] All contestants:', allContestants.length);
      
      const activeContestants = allContestants.filter((c: Contestant) => c.STATUS === 'ACTIVE');

      const onStageSBDs = configData.ON_STAGE_SBD
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);

      console.log('🎭 [loadData] ON_STAGE_SBD:', onStageSBDs);

      const onStage = activeContestants.filter((c: Contestant) => 
        onStageSBDs.includes(c.SBD)
      );
      
      console.log('🎭 [loadData] onStage contestants:', onStage);
      setOnStageContestants(onStage);

      // Fetch scores from API
      const scoresResponse = await fetch(
        `/api/scores?username=${session.username}&segment=${configData.CURRENT_SEGMENT}&batchId=${configData.CURRENT_BATCH}`
      );
      const scores = await scoresResponse.json();
      
      console.log('📊 [loadData] Scores loaded:', scores);
      setMyScores(scores);

      const mode = determineDisplayMode(configData, onStage.length);
      
      console.log('📺 [loadData] Display mode:', mode);
      console.log('🔢 [loadData] onStage.length:', onStage.length);
      
      setDisplayMode(mode);

      setIsLoading(false);
    } catch (err) {
      console.error('❌ [loadData] Error loading data:', err);
      
      // Kiểm tra nếu là lỗi network vs lỗi auth
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        console.log('🚫 [loadData] Auth error, logging out');
        clearSession();
        setSession(null);
      } else {
        // Chỉ set error, không logout nếu là network issue
        console.log('🌐 [loadData] Network error, retaining session');
        setError('Không thể tải dữ liệu. Vui lòng kiểm tra kết nối.');
      }
      
      setIsLoading(false);
    }
  }, [session, determineDisplayMode]);

  // Load data when authenticated
  useEffect(() => {
    if (session) {
      // Load lần đầu
      const timer = setTimeout(() => loadData(), 0);
      
      // Auto-reload mỗi 30 giây (tăng lên để tránh conflict với VPS)
      const interval = setInterval(() => {
        console.log('⏰ [Auto-reload] Refreshing data...');
        // Chỉ reload nếu không có error
        if (!error) {
          loadData();
        } else {
          console.log('⏸️ [Auto-reload] Skipping due to error state');
        }
      }, 30000); // 30 giây
      
      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [session, loadData, error]);

  // Handle Login Success
  const handleLoginSuccess = (newSession: AuthSession) => {
    setSession(newSession);
  };

  // Handle Logout
  const handleLogout = () => {
    clearSession();
    setSession(null);
    setConfig(null);
    setOnStageContestants([]);
    setMyScores({});
  };

  // Submit Score Handler (WITH TOKEN VERIFICATION)
  const handleSubmitScore = async (sbd: string, score: number) => {
    if (!config || !session) return;

    // Kiểm tra nếu BTC đã khóa hệ thống
    if (config.IS_LOCKED) {
      alert('⚠️ Hệ thống đã bị khóa bởi Ban Tổ Chức. Không thể chấm điểm.');
      return;
    }

    try {
      const response = await fetch('/api/scores/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score: {
            TIMESTAMP: new Date().toISOString(),
            JUDGE_ID: session.username,
            SBD: sbd,
            SEGMENT: config.CURRENT_SEGMENT,
            BATCH_ID: config.CURRENT_BATCH,
            SCORE: score,
          },
          authToken: session.token,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMyScores(prev => ({ ...prev, [sbd]: score }));
      } else {
        alert(result.message || 'Lỗi khi gửi điểm. Vui lòng thử lại.');
        
        // Nếu token không hợp lệ, buộc đăng xuất
        if (result.message?.includes('Token')) {
          clearSession();
          setSession(null);
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Lỗi khi gửi điểm. Vui lòng thử lại.');
    }
  };

  // Not Authenticated - Show Login
  if (!session) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  // Loading State
  if (isLoading || !config) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className={styles.errorScreen}>
        <div className={styles.errorIcon}>⚠️</div>
        <p className={styles.errorText}>{error}</p>
        <button className={styles.retryButton} onClick={loadData}>
          Thử lại
        </button>
      </div>
    );
  }

  // Locked State
  if (displayMode === 'LOCKED') {
    return (
      <div className={styles.container}>
        <Header 
          config={config} 
          judgeId={session.username}
          judgeInfo={{
            fullName: session.fullName,
            image: session.image
          }}
          onLogout={handleLogout}
        />
        <div className={styles.lockedScreen}>
          <div className={styles.lockedIcon}>🔒</div>
          <h1 className={styles.lockedTitle}>Hệ thống đã khóa</h1>
          <p className={styles.lockedMessage}>
            {config.IS_LOCKED 
              ? 'Cảm ơn Quý Giám Khảo đã hoàn thành chấm điểm'
              : 'Chờ thí sinh lên sân khấu...'}
          </p>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Đăng xuất
          </button>
        </div>
      </div>
    );
  }

  // Main App
  return (
    <div className={styles.container}>
      <Header 
        config={config} 
        judgeId={session.username}
        judgeInfo={{
          fullName: session.fullName,
          image: session.image
        }}
        onLogout={handleLogout}
      />

      {/* Warning banner khi BTC khóa hệ thống */}
      {config.IS_LOCKED && (
        <div style={{
          background: '#ff9800',
          color: 'white',
          padding: '12px 20px',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '16px',
          borderBottom: '3px solid #f57c00'
        }}>
          ⚠️ Hệ thống đã bị khóa bởi Ban Tổ Chức - Chỉ xem, không thể chấm điểm
        </div>
      )}

      <main className={styles.main}>
        {displayMode === 'GRID' && (
          <GridMode
            contestants={onStageContestants}
            myScores={myScores}
            onSubmitScore={handleSubmitScore}
          />
        )}

        {displayMode === 'SPLIT' && (
          <SplitMode
            contestants={onStageContestants}
            myScores={myScores}
            onSubmitScore={handleSubmitScore}
          />
        )}

        {displayMode === 'SPOTLIGHT' && onStageContestants[0] && (
          <SpotlightMode
            contestant={onStageContestants[0]}
            myScore={myScores[onStageContestants[0].SBD] ?? null}
            onSubmitScore={handleSubmitScore}
          />
        )}
      </main>

      <div className={styles.floatingLogout} onClick={() => setShowFloatingLogoutDialog(true)}>
        <div className={styles.logoutIconContainer}>
          <span className={styles.logoutMainIcon}>⏻</span>
          <span className={styles.logoutRipple}></span>
        </div>
        <div className={styles.logoutTooltip}>
          <span className={styles.tooltipText}>Đăng xuất hệ thống</span>
          <div className={styles.tooltipArrow}></div>
        </div>
      </div>

      {/* Floating Logout Confirmation Dialog */}
      {showFloatingLogoutDialog && typeof document !== 'undefined' && createPortal(
        <div className={styles.dialogOverlay} onClick={() => setShowFloatingLogoutDialog(false)}>
          <div className={styles.dialogContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.dialogHeader}>
              <div className={styles.dialogIcon}>⚠️</div>
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
                onClick={() => setShowFloatingLogoutDialog(false)}
              >
                <span className={styles.buttonIcon}>✕</span>
                <span>Hủy bỏ</span>
              </button>
              <button 
                className={styles.confirmButton}
                onClick={() => {
                  setShowFloatingLogoutDialog(false);
                  handleLogout();
                }}
              >
                <span className={styles.buttonIcon}>⏻</span>
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
