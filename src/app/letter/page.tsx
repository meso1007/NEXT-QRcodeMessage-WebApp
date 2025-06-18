"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Sparkles, Feather, Scroll } from 'lucide-react';

interface MessageData {
    message: string;
    name: string;
    writerName: string;
    created: string;
    id: string;
}

const LetterPage = () => {
    const [messageData, setMessageData] = useState<MessageData | null>(null);
    const [showEnvelope, setShowEnvelope] = useState(true);
    const [showLetter, setShowLetter] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        // 音楽を再生
        if (audioRef.current) {
            audioRef.current.volume = 0.3;
            // 自動再生を試みる
            const playAudio = async () => {
                try {
                    await audioRef.current?.play();
                } catch (e) {
                    console.log('Audio autoplay prevented:', e);
                    // ユーザーインタラクションを待ってから再生
                    document.addEventListener('click', async () => {
                        try {
                            await audioRef.current?.play();
                        } catch (e) {
                            console.log('Audio playback failed:', e);
                        }
                    }, { once: true });
                }
            };
            playAudio();
        }

        // URLフラグメントからデータを取得
        const hash = window.location.hash;
        console.log('Hash:', hash);

        if (hash.startsWith('#data=')) {
            // 旧形式のデータ処理（後方互換性）
            try {
                const encodedData = hash.substring(6);
                const base64Decoded = atob(encodedData);
                const urlDecoded = decodeURIComponent(base64Decoded);
                const jsonData = JSON.parse(urlDecoded);
                setMessageData(jsonData);
                
                setTimeout(() => {
                    setIsLoading(false);
                }, 2000);

            } catch (err) {
                console.error('Decoding error:', err);
                const errorMessage = err instanceof Error ? err.message : '不明なエラーが発生しました';
                setError(`メッセージの読み込みに失敗しました: ${errorMessage}`);
                setIsLoading(false);
            }
        } else if (hash.startsWith('#')) {
            // 新形式の最適化データ処理
            try {
                const encodedData = hash.substring(1);
                
                // 最適化デコード関数
                const optimizedDecode = (encoded: string) => {
                    // パディングを復元
                    let padded = encoded;
                    while (padded.length % 4) {
                        padded += '=';
                    }
                    
                    const decoded = atob(
                        padded
                            .replace(/-/g, '+')
                            .replace(/_/g, '/')
                    );
                    
                    const decodedString = decodeURIComponent(decoded)
                        .replace(/~/g, ':')
                        .replace(/\|/g, ',');
                    
                    // JSON構造を復元
                    // 元の形式: "m:value,n:value,w:value,t:value"
                    // 復元後: {"m":"value","n":"value","w":"value","t":"value"}
                    
                    // まず、キーと値のペアを分割
                    const pairs = decodedString.split(',');
                    const jsonObject: { [key: string]: string } = {};
                    
                    pairs.forEach(pair => {
                        const [key, ...valueParts] = pair.split(':');
                        if (key && valueParts.length > 0) {
                            // 値の部分を結合（コロンが含まれる可能性があるため）
                            const value = valueParts.join(':');
                            jsonObject[key.trim()] = value.trim();
                        }
                    });
                    
                    return jsonObject;
                };

                const jsonData = optimizedDecode(encodedData);
                
                // 新形式のデータを旧形式に変換
                const convertedData: MessageData = {
                    message: jsonData.m || jsonData.message || '',
                    name: jsonData.n || jsonData.name || '匿名',
                    writerName: jsonData.w || jsonData.writerName || '匿名',
                    created: jsonData.t ? new Date(jsonData.t).toLocaleDateString('ja-JP') : 
                             jsonData.c || jsonData.created || new Date().toLocaleDateString('ja-JP'),
                    id: jsonData.id || 'generated-id'
                };
                
                setMessageData(convertedData);
                
                setTimeout(() => {
                    setIsLoading(false);
                }, 2000);

            } catch (err) {
                console.error('Optimized decoding error:', err);
                const errorMessage = err instanceof Error ? err.message : '不明なエラーが発生しました';
                setError(`メッセージの読み込みに失敗しました: ${errorMessage}`);
                setIsLoading(false);
            }
        } else {
            // テスト用データ
            setMessageData({
                message: "愛する人へ\n\nあなたと過ごした時間は、私にとってかけがえのない宝物です。笑顔を見せてくれるたびに、心が温かくなりました。\n\n離れていても、あなたのことを想っています。この手紙が、あなたの心に届きますように。\n\n永遠の愛を込めて",
                name: "あなた",
                writerName: "あなた",
                created: "2025年6月17日",
                id: "test-id"
            });
            setIsLoading(false);
        }
    }, []);

    const handleEnvelopeClick = () => {
        setIsEnvelopeOpened(true);
        setTimeout(() => {
            setShowEnvelope(false);
            setShowLetter(true);
            setTimeout(() => {
                setShowMessage(true);
            }, 1000);
        }, 1500);
    };

    // メッセージを文字ごとに分割（改行を適切に処理）
    const processMessage = (message: string) => {
        const result: Array<{ char: string; isNewline: boolean; index: number }> = [];
        let globalIndex = 0;
        
        for (let i = 0; i < message.length; i++) {
            if (message[i] === '\n') {
                result.push({ char: '\n', isNewline: true, index: globalIndex });
                globalIndex++;
            } else {
                result.push({ char: message[i], isNewline: false, index: globalIndex });
                globalIndex++;
            }
        }
        
        return result;
    };

    const processedWords = messageData?.message ? processMessage(messageData.message) : [];

    useEffect(() => {
        if (showMessage && messageData?.message) {
            const interval = setInterval(() => {
                setCurrentWordIndex((prev) => {
                    if (prev >= messageData.message.length - 1) {
                        clearInterval(interval);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 120);

            return () => clearInterval(interval);
        }
    }, [showMessage, messageData?.message]);

    const envelopeVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 50 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 1,
                ease: "easeOut"
            }
        },
        opened: {
            scale: 1.1,
            y: -20,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const letterVariants = {
        hidden: { opacity: 0, y: 100, scale: 0.8 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 1.2,
                ease: "easeOut"
            }
        }
    };

    const sparkleVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            transition: {
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "easeInOut"
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-pink-50 to-purple-100 flex items-center justify-center">
                <audio
                    ref={audioRef}
                    loop
                    preload="auto"
                >
                    <source src="/music/A_letter.mp3" type="audio/mpeg" />
                </audio>
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-pink-300 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-pink-600 text-lg font-serif"
                    >
                        手紙を準備しています...
                    </motion.p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-pink-50 to-purple-100 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg max-w-md border border-pink-200"
                >
                    <p className="text-red-600 text-lg mb-4 font-serif">{error}</p>
                    <button
                        onClick={() => {
                            setMessageData({
                                message: "愛する人へ\n\nあなたと過ごした時間は、私にとってかけがえのない宝物です。笑顔を見せてくれるたびに、心が温かくなりました。\n\n離れていても、あなたのことを想っています。この手紙が、あなたの心に届きますように。\n\n永遠の愛を込めて",
                                name: "あなた",
                                writerName: "あなた",
                                created: "2025年6月17日",
                                id: "test-id"
                            });
                            setError(null);
                            setIsLoading(false);
                        }}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg transition-colors font-serif shadow-md"
                    >
                        テストで確認
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-pink-50 to-purple-100 relative overflow-hidden">
            {/* 背景音楽 */}
            <audio
                ref={audioRef}
                loop
                preload="auto"
                className="hidden"
            >
                {/* フリーの感動的な音楽を想定 */}
            </audio>

            {/* 背景の羽毛エフェクト */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ 
                            opacity: [0, 0.6, 0],
                            y: [0, 100],
                            x: [0, Math.random() * 50 - 25],
                            rotate: [0, 360]
                        }}
                        transition={{
                            duration: Math.random() * 8 + 5,
                            repeat: Infinity,
                            delay: Math.random() * 10,
                            ease: "easeInOut"
                        }}
                    >
                        <Feather className="w-4 h-4 text-pink-300/60" />
                    </motion.div>
                ))}
            </div>

            {/* 光の粒子 */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-gradient-to-r from-yellow-300 to-pink-300 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        variants={sparkleVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{
                            delay: Math.random() * 5,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                <AnimatePresence mode="wait">
                    {/* 封筒の段階 */}
                    {showEnvelope && messageData && (
                        <motion.div
                            key="envelope"
                            variants={envelopeVariants}
                            initial="hidden"
                            animate={isEnvelopeOpened ? "opened" : "visible"}
                            exit={{ opacity: 0, scale: 0.8, y: -100 }}
                            className="cursor-pointer relative"
                            onClick={handleEnvelopeClick}
                        >
                            <div className="relative">
                                {/* 封筒本体 */}
                                <div className="w-80 h-56 bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-300 relative shadow-xl">
                                    {/* 封筒の装飾 */}
                                    <div className="absolute inset-4 border border-amber-400 border-dashed opacity-50"></div>
                                    
                                    {/* 宛名 */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <p className="text-amber-800 font-serif text-lg mb-2">To:</p>
                                            <p className="text-amber-900 font-serif text-xl font-bold">{messageData.name}様</p>
                                        </div>
                                    </div>

                                    {/* 封筒のフラップ */}
                                    <motion.div
                                        className="absolute -top-8 left-0 w-full h-16 bg-gradient-to-b from-amber-200 to-amber-300 border-2 border-amber-300 origin-bottom"
                                        style={{
                                            clipPath: 'polygon(0 100%, 50% 0, 100% 100%)'
                                        }}
                                        animate={isEnvelopeOpened ? { rotateX: -180 } : { rotateX: 0 }}
                                        transition={{ duration: 1.5, ease: "easeInOut" }}
                                    >
                                        {/* ワックスシール風 */}
                                        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-red-600 rounded-full border-2 border-red-700 flex items-center justify-center">
                                            <Heart className="w-4 h-4 text-red-200" />
                                        </div>
                                    </motion.div>
                                </div>

                                {/* クリック促進テキスト */}
                                <motion.p
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-center mt-6 text-amber-700 font-serif"
                                >
                                    封筒をクリックして開封してください
                                </motion.p>
                            </div>
                        </motion.div>
                    )}

                    {/* 手紙の段階 */}
                    {showLetter && messageData && (
                        <motion.div
                            key="letter"
                            variants={letterVariants}
                            initial="hidden"
                            animate="visible"
                            className="max-w-2xl mx-auto relative"
                        >
                            {/* 手紙用紙 */}
                            <div className="bg-gradient-to-br from-cream-50 to-amber-50 p-8 md:p-12 shadow-2xl relative"
                                 style={{
                                     backgroundImage: `
                                         linear-gradient(90deg, #f59e0b10 1px, transparent 1px),
                                         linear-gradient(#f59e0b10 1px, transparent 1px)
                                     `,
                                     backgroundSize: '20px 25px'
                                 }}>
                                
                                {/* 紙の破れた効果 */}
                                <div className="absolute inset-0 bg-white opacity-90 rounded-sm"
                                     style={{
                                         clipPath: 'polygon(0% 2%, 2% 0%, 98% 1%, 100% 3%, 99% 97%, 97% 100%, 3% 99%, 1% 98%)'
                                     }}></div>

                                <div className="relative z-10">
                                    {/* ヘッダー装飾 */}
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="text-center mb-8"
                                    >
                                        <div className="flex justify-center items-center mb-4">
                                            <motion.div
                                                animate={{ rotate: [0, 5, -5, 0] }}
                                                transition={{ duration: 4, repeat: Infinity }}
                                            >
                                                <Scroll className="w-8 h-8 text-amber-600 mr-3" />
                                            </motion.div>
                                            <h1 className="text-2xl md:text-3xl font-serif text-amber-800 italic">
                                            {messageData.name}へ
                                            </h1>
                                            <motion.div
                                                animate={{ rotate: [0, -5, 5, 0] }}
                                                transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                                            >
                                                <Feather className="w-8 h-8 text-amber-600 ml-3" />
                                            </motion.div>
                                        </div>
                                        <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto"></div>
                                    </motion.div>

                                    {/* メッセージ本文 */}
                                    <div className="min-h-[300px] relative">
                                        {showMessage ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="font-serif text-lg leading-relaxed text-amber-900 whitespace-pre-line"
                                            >
                                                {messageData.message.split('').slice(0, currentWordIndex + 1).map((char, index) => (
                                                    <motion.span
                                                        key={index}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{
                                                            duration: 0.3,
                                                            delay: index * 0.03
                                                        }}
                                                    >
                                                        {char}
                                                    </motion.span>
                                                ))}
                                                
                                                {/* タイピングカーソル */}
                                                {currentWordIndex < messageData.message.length - 1 && (
                                                    <motion.span
                                                        animate={{ opacity: [0, 1, 0] }}
                                                        transition={{ duration: 1, repeat: Infinity }}
                                                        className="inline-block w-0.5 h-6 bg-amber-600 ml-1"
                                                    />
                                                )}
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                animate={{ opacity: [0.3, 0.8, 0.3] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="text-amber-600 font-serif text-lg text-center pt-20"
                                            >
                                                文字が浮かび上がっています...
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* 署名と日付 */}
                                    {showMessage && messageData && currentWordIndex >= (messageData.message.length - 1) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 2 }}
                                            className="mt-12 text-right"
                                        >
                                            <p className="font-serif text-amber-700 mb-2">
                                                {messageData.created}
                                            </p>
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 2.5, type: "spring" }}
                                                className="text-amber-800 font-serif italic"
                                            >
                                                {messageData.writerName} より
                                            </motion.div>
                                        </motion.div>
                                    )}

                                    {/* 装飾的な要素 */}
                                    <motion.div
                                        className="absolute -top-4 -right-4"
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 6, repeat: Infinity }}
                                    >
                                        <Star className="w-6 h-6 text-yellow-400 opacity-70" />
                                    </motion.div>

                                    <motion.div
                                        className="absolute -bottom-4 -left-4"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                                    >
                                        <Heart className="w-6 h-6 text-pink-400 opacity-70" />
                                    </motion.div>
                                </div>
                            </div>

                            {/* 影の効果 */}
                            <div className="absolute inset-0 bg-amber-900/20 blur-sm transform translate-x-2 translate-y-2 -z-10 rounded-sm"></div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 完了後のエフェクト */}
            {showMessage && messageData && currentWordIndex >= (messageData.message.length - 1) && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3 }}
                    className="absolute inset-0 pointer-events-none"
                >
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ 
                                scale: [0, 1, 0],
                                opacity: [0, 1, 0],
                                y: [0, -50]
                            }}
                            transition={{
                                duration: 3,
                                delay: Math.random() * 2,
                                ease: "easeOut"
                            }}
                        >
                            <Sparkles className="w-4 h-4 text-pink-400" />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default LetterPage;