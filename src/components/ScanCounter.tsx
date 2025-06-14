'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ScanCounter() {
  const [totalScans, setTotalScans] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const response = await fetch('/api/analytics');
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        setTotalScans(data.totalScans);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchScans();
    // 5分ごとに更新
    const interval = setInterval(fetchScans, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="text-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center p-4"
    >
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        これまでに届けられた想い
      </h3>
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        className="text-3xl font-bold text-blue-600"
      >
        {totalScans.toLocaleString()} 回
      </motion.div>
      <p className="text-sm text-gray-500 mt-2">
        30日間の合計
      </p>
    </motion.div>
  );
} 