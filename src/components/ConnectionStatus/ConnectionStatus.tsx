'use client';

import React, { useState, useEffect } from 'react';
import styles from './ConnectionStatus.module.css';

interface ConnectionStatusProps {
  apiEndpoint?: string;
  checkInterval?: number;
  onStatusChange?: (status: 'online' | 'offline' | 'slow') => void;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  apiEndpoint = '/api/config',
  checkInterval = 30000, // 30 seconds
  onStatusChange
}) => {
  const [status, setStatus] = useState<'online' | 'offline' | 'slow'>('online');
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  const [responseTime, setResponseTime] = useState<number>(0);

  useEffect(() => {
    const checkConnection = async () => {
      const startTime = Date.now();
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
        
        const response = await fetch(apiEndpoint, {
          method: 'HEAD',
          signal: controller.signal,
          cache: 'no-cache'
        });
        
        clearTimeout(timeoutId);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        setResponseTime(responseTime);
        setLastCheck(new Date());
        
        if (response.ok) {
          const newStatus = responseTime > 3000 ? 'slow' : 'online';
          setStatus(newStatus);
          onStatusChange?.(newStatus);
        } else {
          setStatus('offline');
          onStatusChange?.('offline');
        }
      } catch (error) {
        console.warn('🌐 Connection check failed:', error);
        setStatus('offline');
        setResponseTime(0);
        setLastCheck(new Date());
        onStatusChange?.('offline');
      }
    };

    // Initial check
    checkConnection();
    
    // Set up interval
    const interval = setInterval(checkConnection, checkInterval);
    
    // Also check on visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkConnection();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [apiEndpoint, checkInterval, onStatusChange]);

  const getStatusInfo = () => {
    switch (status) {
      case 'online':
        return {
          icon: '🟢',
          text: 'Kết nối ổn định',
          color: '#22c55e'
        };
      case 'slow':
        return {
          icon: '🟡', 
          text: 'Kết nối chậm',
          color: '#f59e0b'
        };
      case 'offline':
        return {
          icon: '🔴',
          text: 'Mất kết nối',
          color: '#ef4444'
        };
    }
  };

  const statusInfo = getStatusInfo();
  
  return (
    <div className={`${styles.container} ${styles[status]}`}>
      <div className={styles.indicator}>
        <span className={styles.icon}>{statusInfo.icon}</span>
        <span className={styles.text}>{statusInfo.text}</span>
      </div>
      
      {status === 'online' && (
        <div className={styles.details}>
          <span className={styles.responseTime}>{responseTime}ms</span>
        </div>
      )}
      
      <div className={styles.lastCheck}>
        Cập nhật: {lastCheck.toLocaleTimeString('vi-VN')}
      </div>
    </div>
  );
};

export default ConnectionStatus;