'use client';

import React from 'react';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  message,
  onConfirm,
  onCancel,
  isSubmitting,
}) => {
  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.icon}>⚠️</div>
        
        <div className={styles.message}>{message}</div>

        <div className={styles.note}>
          ⚡ Lưu ý: Điểm này sẽ được ghi nhận và không thể chỉnh sửa
        </div>

        <div className={styles.buttons}>
          <button
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={isSubmitting}
          >
            ← Quay lại
          </button>
          <button
            className={styles.confirmButton}
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? '⏳ Đang xử lý...' : '✓ Xác nhận gửi'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
