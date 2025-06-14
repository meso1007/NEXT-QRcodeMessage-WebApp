// Google Analytics 4の設定
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// ページビューのトラッキング
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID as string, {
      page_path: url,
    });
  }
};

// QRコードスキャンのトラッキング
export const trackQRCodeScan = (qrCodeId: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'qr_code_scan', {
      'qr_code_id': qrCodeId,
      'timestamp': new Date().toISOString(),
      'event_category': 'QR Code',
      'event_label': 'Scan'
    });
  }
};

// カスタムイベントのトラッキング
export const trackEvent = (action: string, category: string, label: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
}; 