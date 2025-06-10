"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Heart, Star, Sparkles, Drum } from 'lucide-react';

interface MessageData {
    message: string;
    name: string;
    created: string;
}

const LetterPage = () => {
    const [messageData, setMessageData] = useState<MessageData | null>(null);
    const [showMessage, setShowMessage] = useState(false);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // URLフラグメントからデータを取得
        const hash = window.location.hash;
        console.log('Hash:', hash);

        if (hash.startsWith('#data=')) {
            try {
                const encodedData = hash.substring(6); // '#data='を除去
                console.log('Encoded data:', encodedData);

                // 正しいデコード順序: Base64デコード → URLデコード → JSON解析
                const base64Decoded = atob(encodedData);
                console.log('Base64 decoded:', base64Decoded);

                const urlDecoded = decodeURIComponent(base64Decoded);
                console.log('URL decoded:', urlDecoded);

                const jsonData = JSON.parse(urlDecoded);
                console.log('JSON parsed:', jsonData);

                setMessageData(jsonData);

                // ローディング演出
                setTimeout(() => {
                    setIsLoading(false);
                    setTimeout(() => {
                        setShowMessage(true);
                    }, 1000);
                }, 2000);

            } catch (err) {
                console.error('Decoding error:', err);
                const errorMessage = err instanceof Error ? err.message : '不明なエラーが発生しました';
                setError(`メッセージの読み込みに失敗しました: ${errorMessage}`);
                setIsLoading(false);
            }
        } else {
            setError('有効なメッセージが見つかりませんでした。');
            setIsLoading(false);
        }
    }, []);

    // メッセージを単語ごとに分割
    const words = messageData?.message ? messageData.message.split('') : [];

    useEffect(() => {
        if (showMessage && words.length > 0) {
            const interval = setInterval(() => {
                setCurrentWordIndex((prev) => {
                    if (prev >= words.length - 1) {
                        clearInterval(interval);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 80); // 文字ごとに80msで表示

            return () => clearInterval(interval);
        }
    }, [showMessage, words.length]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 1,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const sparkleVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-600 via-purple-700 to-slate-600 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-purple-300 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-purple-200 text-lg"
                    >
                        メッセージを読み込んでいます...
                    </motion.p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-600 via-purple-700 to-slate-600 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-lg max-w-md"
                >
                    <p className="text-red-300 text-lg mb-4">{error}</p>
                    <p className="text-purple-200 mb-4">正しいQRコードをご確認ください。</p>
                    <button
                        onClick={() => {
                            // テスト用ダミーデータで表示を試行
                            setMessageData({
                                message: "テストメッセージです。この画面が表示されれば、アニメーション機能は正常に動作しています。",
                                name: "テストユーザー",
                                created: "2025-06-10"
                            });
                            setError(null);
                            setIsLoading(true);
                            setTimeout(() => {
                                setIsLoading(false);
                                setTimeout(() => {
                                    setShowMessage(true);
                                }, 1000);
                            }, 2000);
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        テストデータで確認
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-400 to-blue-300 relative overflow-hidden">
            {/* 背景の星の演出 */}
            <div className="absolute inset-0">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                        }}
                    >
                        <Star className="w-1 h-1 text-purple-300" />
                    </motion.div>
                ))}
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                <AnimatePresence>
                    {messageData && (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="max-w-4xl mx-auto text-center"
                        >
                            {/* 装飾的なヘッダー */}
                            <motion.div
                                variants={itemVariants}
                                className="mb-8"
                            >
                                <motion.div
                                    variants={sparkleVariants as Variants}
                                    className="flex justify-center mb-4"
                                >
                                    <Heart className="w-8 h-8 text-pink-300 mx-2" />
                                    <Sparkles className="w-8 h-8 text-yellow-300 mx-2" />
                                    <Drum className="w-8 h-8 text-blue-300 mx-2" />
                                </motion.div>
                                <motion.h1
                                    variants={itemVariants}
                                    className="text-3xl md:text-4xl font-light text-white mb-2"
                                >
                                    {messageData.name}さんへ
                                </motion.h1>
                                <motion.div
                                    variants={itemVariants}
                                    className="w-24 h-0.5 bg-gradient-to-r from-transparent via-purple-300 to-transparent mx-auto"
                                />
                            </motion.div>

                            {/* メッセージ表示エリア */}
                            <motion.div
                                variants={itemVariants}
                                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10 shadow-2xl mb-8"
                            >
                                <div className="text-lg md:text-xl leading-relaxed text-white min-h-[200px] flex items-center justify-center">
                                    {showMessage ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                            className="whitespace-pre-wrap break-words"
                                        >
                                            {words.slice(0, currentWordIndex + 1).map((char, index) => (
                                                <motion.span
                                                    key={index}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{
                                                        duration: 0.3,
                                                        delay: index * 0.02
                                                    }}
                                                    className={char === ' ' ? 'inline-block w-2' : ''}
                                                >
                                                    {char}
                                                </motion.span>
                                            ))}
                                            {currentWordIndex >= words.length - 1 && (
                                                <motion.span
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.5 }}
                                                    className="inline-block w-0.5 h-6 bg-purple-300 ml-1 animate-pulse"
                                                />
                                            )}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="text-purple-200"
                                        >
                                            心を込めて...
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>

                            {/* 日付表示 */}
                            {showMessage && currentWordIndex >= words.length - 1 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 }}
                                    className="text-center"
                                >
                                    <p className="text-purple-200 text-sm mb-4">
                                        {messageData.created}
                                    </p>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
                                        className="flex justify-center"
                                    >
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <span className="text-sm italic">いつまでも心の中に</span>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* フローティング要素 */}
                            <motion.div
                                className="absolute top-10 left-10"
                                animate={{
                                    y: [0, -10, 0],
                                    rotate: [0, 5, 0]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <Sparkles className="w-6 h-6 text-yellow-300/50" />
                            </motion.div>

                            <motion.div
                                className="absolute bottom-20 right-10"
                                animate={{
                                    y: [0, -15, 0],
                                    rotate: [0, -5, 0]
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 1
                                }}
                            >
                                <Star className="w-5 h-5 text-purple-300/50" />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default LetterPage;