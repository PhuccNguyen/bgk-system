'use client';

import React, { useState } from 'react';
import styles from './LoginForm.module.css';
import { AuthSession } from '@/lib/types';

interface LoginFormProps {
  onLoginSuccess: (session: AuthSession) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔐 [LoginForm] Calling API with username:', username.trim());
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data = await response.json();
      
      console.log('📡 [LoginForm] API response:', data);

      if (data.success && data.session) {
        // Save session to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('bgk_session', JSON.stringify(data.session));
        }
        onLoginSuccess(data.session);
      } else {
        setError(data.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
      console.error('❌ [LoginForm] Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.crown}>👑</div>
          <h1 className={styles.title}>BGK SYSTEM</h1>
          <p className={styles.subtitle}>Hệ thống chấm điểm Giám Khảo</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Tên đăng nhập</label>
            <input
              type="text"
              className={styles.input}
              placeholder="VD: ngannguyen"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              autoComplete="username"
              autoCapitalize="none"
              spellCheck="false"
            />
            <span className={styles.hint}>
              (Không dấu, viết liền không space)
            </span>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Mật khẩu</label>
            <input
              type="password"
              className={styles.input}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className={styles.error}>
              <span className={styles.errorIcon}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? '⏳ Đang xác thực...' : '🔐 Đăng nhập'}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            ⚠️ Chỉ dành cho Ban Giám Khảo được ủy quyền
          </p>
          <p className={styles.footerHelp}>
            Nếu quên mật khẩu, liên hệ BTC
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
