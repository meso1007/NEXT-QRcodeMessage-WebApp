"use client"

import React, { useEffect, useState } from 'react';
import { Home, ArrowLeft, Heart, Search, FileText } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function NotFound() {
  const [typedText, setTypedText] = useState('');
  const fullText = 'お探しのページが見つかりませんでした';

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const quickLinks = [
    {
      name: 'ホームページ',
      description: 'メッセージ作成に戻る',
      href: '/',
      icon: <Home className="w-6 h-6" />,
      color: 'from-rose-400 to-pink-400'
    },
    {
      name: 'このサイトについて',
      description: 'サービスの詳細を確認',
      href: '/about',
      icon: <FileText className="w-6 h-6" />,
      color: 'from-purple-400 to-indigo-400'
    },
    {
      name: 'よくある質問',
      description: 'FAQで解決策を探す',
      href: '/faq',
      icon: <Search className="w-6 h-6" />,
      color: 'from-blue-400 to-cyan-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center px-4 pt-10 relative overflow-hidden">
      {/* 背景の装飾要素 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* 404 アイコン */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "backOut" }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-gradient-to-br from-rose-400 via-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-2xl">
              <Heart className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-pink-100">
              <span className="text-2xl font-bold text-gray-700">404</span>
            </div>
          </div>
        </motion.div>

        {/* メインメッセージ */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-4xl font-bold text-gray-700 mb-6">
            <span className="bg-gradient-to-r from-rose-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              {typedText}
            </span>
            <span className="animate-pulse ml-1">|</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
            お探しのページは存在しないか、移動された可能性があります。<br />
            大切な想いを残すために、以下のリンクからお進みください。
          </p>

          <div className="text-sm text-gray-500 bg-white/50 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto">
            <p>URLの入力ミスがないかご確認ください</p>
          </div>
        </motion.div>

        {/* クイックリンク */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            おすすめのページ
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <Link href={link.href}>
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-pink-100 group-hover:border-pink-200">
                    <div className={`w-12 h-12 bg-gradient-to-r ${link.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-md group-hover:shadow-lg transition-shadow`}>
                      {link.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2 group-hover:text-rose-600 transition-colors">
                      {link.name}
                    </h3>
                    <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                      {link.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* アクションボタン */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/">
            <button className="flex items-center gap-2 bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 hover:from-rose-500 hover:via-pink-500 cursor-pointer hover:to-purple-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105">
              <Home className="w-5 h-5" />
              ホームに戻る
            </button>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-white/60 backdrop-blur-sm hover:bg-white/80 text-gray-700 font-semibold py-4 px-8 rounded-xl transition-all cursor-pointer duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-pink-200"
          >
            <ArrowLeft className="w-5 h-5" />
            前のページに戻る
          </button>
        </motion.div>

        {/* 追加情報 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 max-w-2xl mx-auto border border-blue-100">
            <div className="flex items-center justify-center mb-4">
              <Image src="/logo/app-logo.png" alt="OTODOKE LIFE" width={70} height={70} priority/>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
               OTODOKE LIFEについて
            </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              大切な人への想いやメッセージを、安全で意味のある形で残すためのプラットフォームです。<br />
              QRコードを通じて、あなたの想いを未来へ届けます。
            </p>
          </div>
        </motion.div>
      </div>

      {/* 装飾的な要素 */}
      <div className="absolute bottom-8 left-8 text-gray-300 text-sm">
        <p>404 - Page Not Found</p>
      </div>
      
      <div className="absolute top-8 right-8 text-gray-300 text-sm">
        <p>OTODOKE LIFE</p>
      </div>
    </div>
  );
} 