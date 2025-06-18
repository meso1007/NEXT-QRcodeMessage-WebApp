"use client"

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  type = 'default',
  showCloseButton = true,
  closeOnBackdrop = true,
  className = ''
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // スクロールを無効化
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // バックドロップクリックでモーダルを閉じる
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      onClose();
    }
  };

  // サイズクラスの設定
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  // タイプに応じたアイコンと色の設定
  const typeConfig = {
    default: {
      icon: null,
      color: 'from-rose-400 to-purple-400',
      bgColor: 'bg-gradient-to-r from-rose-50 to-purple-50',
      borderColor: 'border-rose-200'
    },
    success: {
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      color: 'from-green-400 to-emerald-400',
      bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50',
      borderColor: 'border-green-200'
    },
    error: {
      icon: <AlertCircle className="w-6 h-6 text-red-600" />,
      color: 'from-red-400 to-pink-400',
      bgColor: 'bg-gradient-to-r from-red-50 to-pink-50',
      borderColor: 'border-red-200'
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
      color: 'from-yellow-400 to-orange-400',
      bgColor: 'bg-gradient-to-r from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-200'
    },
    info: {
      icon: <Info className="w-6 h-6 text-blue-600" />,
      color: 'from-blue-400 to-cyan-400',
      bgColor: 'bg-gradient-to-r from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200'
    }
  };

  const config = typeConfig[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          {/* バックドロップ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* モーダル */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ 
              duration: 0.15, 
              ease: "easeOut",
              type: "spring",
              stiffness: 400,
              damping: 25
            }}
            className={`relative w-full ${sizeClasses[size]} ${className}`}
          >
            <div className={`bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border ${config.borderColor} overflow-hidden`}>
              {/* ヘッダー */}
              {(title || showCloseButton) && (
                <div className={`${config.bgColor} px-6 py-4 border-b ${config.borderColor}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {config.icon && (
                        <div className="flex-shrink-0">
                          {config.icon}
                        </div>
                      )}
                      {title && (
                        <h2 className="text-lg font-semibold text-gray-800">
                          {title}
                        </h2>
                      )}
                    </div>
                    {showCloseButton && (
                      <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-100"
                        aria-label="モーダルを閉じる"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* コンテンツ */}
              <div className="p-6">
                {children}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// 便利なコンポーネント
interface ModalButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ModalButton: React.FC<ModalButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-rose-400 to-purple-400 hover:from-rose-500 hover:to-purple-500 text-white',
    secondary: 'bg-white/60 backdrop-blur-sm hover:bg-white/80 text-gray-700 border border-pink-200',
    danger: 'bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      onClick={onClick}
      className={`font-semibold rounded-xl transition-all duration-150 shadow-lg hover:shadow-xl transform hover:scale-105 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};

// 確認モーダル用のコンポーネント
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '確認',
  cancelText = 'キャンセル',
  type = 'default'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type={type}
      size="md"
    >
      <div className="text-center">
        <p className="text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>
        <div className="flex gap-3 justify-center">
          <ModalButton
            onClick={onClose}
            variant="secondary"
            size="md"
          >
            {cancelText}
          </ModalButton>
          <ModalButton
            onClick={handleConfirm}
            variant={type === 'error' ? 'danger' : 'primary'}
            size="md"
          >
            {confirmText}
          </ModalButton>
        </div>
      </div>
    </Modal>
  );
};

export default Modal; 