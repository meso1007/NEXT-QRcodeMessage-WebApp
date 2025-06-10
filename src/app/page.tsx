"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Heart, QrCode, Shield, Download, Copy, Check, Sparkles, Lock, Clock, Users } from 'lucide-react';
import CountUp from 'react-countup';
import Image from 'next/image';

export default function HomePage() {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState<VisibleSections>({
    hero: false,
    about: false,
    contact: false,
    stats: false,
    features: false,
  });
  type VisibleSections = {
    hero: boolean;
    about?: boolean;
    contact?: boolean;
    stats?: boolean;
    features?:boolean
    // 他にあれば追加
  };
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);

  // アニメーション用のIntersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = [heroRef.current, featuresRef.current, statsRef.current];
    elements.forEach(el => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // タイピングアニメーション
  const [typedText, setTypedText] = useState('');
  const fullText = '大切な人への想いを、永遠に残しませんか';

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

  const generateQRCode = () => {
    if (!message.trim()) {
      alert('メッセージを入力してください');
      return;
    }

    const messageData = {
      message: message.trim(),
      name: name.trim() || '匿名',
      created: new Date().toISOString().split('T')[0]
    };

    const encodedData = btoa(encodeURIComponent(JSON.stringify(messageData)));
    const letterUrl = `${window.location.origin}/letter#data=${encodedData}`;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(letterUrl)}`;

    setQrCodeUrl(qrUrl);
    setShowQR(true);
  };

  const copyToClipboard = async () => {
    const messageData = {
      message: message.trim(),
      name: name.trim() || '匿名',
      created: new Date().toISOString().split('T')[0]
    };

    const encodedData = btoa(encodeURIComponent(JSON.stringify(messageData)));
    const letterUrl = `${window.location.origin}/letter#data=${encodedData}`;

    try {
      await navigator.clipboard.writeText(letterUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('コピーに失敗しました:', err);
    }
  };

  const downloadQR = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `memorial-qr-${name.trim() || 'message'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* ヒーローセクション - メッセージ作成 */}
      <section
        ref={heroRef}
        id="hero"
        className={`relative pt-32 pb-16 px-4 transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-700 mb-6">
              <span className="bg-gradient-to-r from-rose-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                OTODOKE LIFE              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 h-16 flex items-center justify-center">
              {typedText}
              <span className="animate-pulse ml-1">|</span>
            </p>
          </div>

          {/* メッセージ作成フォーム */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-2xl border border-pink-100 p-8 mb-8 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-rose-400 animate-spin" />
              <h2 className="text-2xl font-bold text-gray-700">今すぐメッセージを作成</h2>
              <Sparkles className="w-6 h-6 text-purple-400 animate-spin" />
            </div>

            <div className="grid md:grid-cols-1 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  お名前（任意）
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例: 太郎"
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all duration-300 text-gray-700 bg-white/70 hover:bg-white/90"
                  maxLength={50}
                />
              </div>

              <div className="md:row-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  メッセージ <span className="text-rose-400">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="大切な方への想いやメッセージをお書きください..."
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all duration-300 resize-none text-gray-700 bg-white/70 hover:bg-white/90"
                  rows={6}
                  maxLength={2000}
                />
                <p className="text-sm text-gray-400 mt-2">
                  {message.length}/2000文字
                </p>
              </div>
            </div>

            <button
              onClick={generateQRCode}
              className="w-full bg-gradient-to-r from-rose-400 via-pink-400 cursor-pointer to-purple-400 hover:from-rose-500 hover:via-pink-500 hover:to-purple-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 relative overflow-hidden"
            >
              <span className="relative z-10">QRコードを生成する</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
            </button>
          </div>

          {/* QRコード表示 */}
          {showQR && (
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-2xl border border-pink-100 p-8 text-center animate-fade-in">
              <h3 className="text-2xl font-bold text-gray-700 mb-6">✨ QRコードが生成されました ✨</h3>

              <div className="inline-block bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-2xl mb-6 border border-pink-100 shadow-inner">
                <Image
                  width={500}
                  height={500}
                  src={qrCodeUrl}
                  alt="Generated QR Code"
                  className="mx-auto animate-scale-in"
                  style={{ width: '300px', height: '300px' }}
                />
              </div>

              <p className="text-gray-500 mb-8 max-w-2xl mx-auto text-lg">
                このQRコードをスマートフォンで読み取ると、あなたのメッセージが表示されます。
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={downloadQR}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-3 px-6 cursor-pointer rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Download className="w-5 h-5" />
                  QRコードをダウンロード
                </button>

                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3 px-6 cursor-pointer rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied ? 'コピーしました！' : 'URLをコピー'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 統計セクション */}
      <section
        ref={statsRef}
        id="stats"
        className={`py-16 px-4 transition-all duration-1000 delay-300 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center bg-white/40 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/60 transition-all duration-300 transform hover:scale-105">
              <Users className="w-12 h-12 text-rose-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-700 mb-2">
                <CountUp end={1000} duration={2} separator="," />+
              </div>
              <div className="text-gray-500">作成されたメッセージ</div>
            </div>
            <div className="text-center bg-white/40 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/60 transition-all duration-300 transform hover:scale-105">
              <Heart className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-700 mb-2">
                <CountUp end={100} duration={2} />%
              </div>
              <div className="text-gray-500">プライバシー保護</div>
            </div>
            <div className="text-center bg-white/40 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/60 transition-all duration-300 transform hover:scale-105">
              <Clock className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-700 mb-2">24/7</div>
              <div className="text-gray-500">いつでもアクセス可能</div>
            </div>
            <div className="text-center bg-white/40 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/60 transition-all duration-300 transform hover:scale-105">
              <Lock className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-700 mb-2">0円</div>
              <div className="text-gray-500">完全無料サービス</div>
            </div>
          </div>
        </div>
      </section>

      {/* 機能セクション */}
      <section
        ref={featuresRef}
        id="features"
        className={`py-16 px-4 transition-all duration-1000 delay-500 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-700 mb-6">
              なぜ<span className="text-rose-400">OTODOKE LIFE</span>なのか
            </h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
              最新の技術と温かい心遣いで、大切な想いを永遠に残します
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-pink-100">
              <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-16 h-16 text-purple-400 mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center">完全プライベート</h3>
              <p className="text-gray-500 text-center leading-relaxed">
                メッセージはサーバーに保存されず、URLに埋め込まれるため、完全にプライベートです。第三者がアクセスすることはありません。
              </p>
              <div className="mt-6 text-center">
                <span className="inline-block bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                  サーバーレス設計
                </span>
              </div>
            </div>

            <div className="group bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-pink-100">
              <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <QrCode className="w-16 h-16 text-indigo-400 mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center">簡単QR生成</h3>
              <p className="text-gray-500 text-center leading-relaxed">
                メッセージを入力するだけで、瞬時にQRコードが生成されます。印刷して墓石や思い出の品に貼り付けられます。
              </p>
              <div className="mt-6 text-center">
                <span className="inline-block bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
                  ワンクリック生成
                </span>
              </div>
            </div>

            <div className="group bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-pink-100">
              <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-16 h-16 text-rose-400 mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center">永続的な想い</h3>
              <p className="text-gray-500 text-center leading-relaxed">
                一度作成されたQRコードは永続的に機能し、インターネットがある限りいつでもメッセージを読み返すことができます。
              </p>
              <div className="mt-6 text-center">
                <span className="inline-block bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-sm font-medium">
                  永続保存
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 使い方セクション */}
      <section className="py-16 px-4 bg-gradient-to-r from-white/30 to-white/10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-700 mb-6">使い方はとても簡単</h2>
            <p className="text-xl text-gray-500">3つのステップで、想いを永遠に残せます</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">メッセージ入力</h3>
              <p className="text-gray-500">大切な方への想いやメッセージを心を込めて入力してください</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">QRコード生成</h3>
              <p className="text-gray-500">ボタンを押すだけで、あなたのメッセージがQRコードになります</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">印刷・設置</h3>
              <p className="text-gray-500">QRコードを印刷して、墓石や思い出の品に貼り付けてください</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}