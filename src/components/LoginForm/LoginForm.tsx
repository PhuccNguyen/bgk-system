'use client';

import React, { useState } from 'react';
import styles from './LoginForm.module.css';
import { AuthSession } from '@/lib/types';
import Image from 'next/image';

interface LoginFormProps {
  onLoginSuccess: (session: AuthSession) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success && data.session) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('bgk_session', JSON.stringify(data.session));
        }
        onLoginSuccess(data.session);
      } else {
        setError(data.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Animated Background */}
      <div className={styles.backgroundAnimation}>
        <div className={styles.sphere}></div>
        <div className={styles.sphere}></div>
        <div className={styles.sphere}></div>
        <div className={styles.gridOverlay}></div>
      </div>

      {/* Login Card */}
      <div className={styles.loginWrapper}>
        <div className={styles.card}>
          {/* Header Section */}
          <div className={styles.header}>
            {/* <div className={styles.logoContainer}>
              <Image
                src="/logo/logo_hhsvhbvns.png"
                alt="HHSVHBVN Logo"
                width={120}
                height={120}
                className={styles.mainLogo}
              />
            </div> */}
            
            <h1 className={styles.title}>
              <span className={styles.titleGradient}>HỆ THỐNG GIÁM KHẢO</span>
            </h1>
            <p className={styles.subtitle}>Chấm Điểm Điện Tử Hệ Sinh Thái Của TINGNECT Phát Triển Bởi TRUSTLABS</p>
            
            <div className={styles.divider}></div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>👤</span>
                Tên đăng nhập
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Nhập tên đăng nhập"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck="false"
                />
                <div className={styles.inputBorder}></div>
              </div>
              <span className={styles.hint}>Viết liền không dấu (VD: ngannguyen)</span>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>🔒</span>
                Mật khẩu
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={styles.input}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
                <div className={styles.inputBorder}></div>
              </div>
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
              {isLoading ? (
                <>
                  <span className={styles.spinner}></span>
                  <span>Đang xác thực...</span>
                </>
              ) : (
                <>
                  <span className={styles.buttonIcon}></span>
                  <span>Đăng nhập hệ thống</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Section */}
          <div className={styles.footer}>
            <div className={styles.poweredBy}>
              <span className={styles.poweredText}>Powered by</span>
              <div className={styles.partnerLogos}>
                <Image
                  src="/logo/tingnect-logo.png"
                  alt="TingNect"
                  width={80}
                  height={24}
                  className={styles.partnerLogo}
                />
                <span className={styles.logoSeparator}>×</span>
                <Image
                  src="/logo/trustlabs-logos.png"
                  alt="TrustLabs"
                  width={80}
                  height={24}
                  className={styles.partnerLogo}
                />
              </div>
            </div>
            
            <p className={styles.warning}>
              <span className={styles.warningIcon}>🔒</span>
              Chỉ dành cho Ban Giám Khảo được ủy quyền
            </p>
          </div>
        </div>

        {/* Side Info Panel */}
        <div className={styles.infoPanel}>
          <div className={styles.infoContent}>
            <h2 className={styles.infoTitle}>Chào mừng</h2>
            <p className={styles.infoDescription}>
              Hệ thống chấm điểm điện tử chuyên nghiệp cho cuộc thi 
              Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025
            </p>
            
            <div className={styles.features}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>◉</span>
                <span>Real-time Scoring</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>◈</span>
                <span>Bảo mật tuyệt đối</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>▣</span>
                <span>Thống kê chi tiết</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
