"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Heart, QrCode, Shield, Download, Copy, Check, Sparkles, Lock, Clock, Users } from 'lucide-react';
import LZString from 'lz-string';
import CountUp from 'react-countup';
import Image from 'next/image';
import Modal, { ConfirmModal, ModalButton } from '@/components/Modal';
import ReviewModal from '@/components/ReviewModal';

export default function HomePage() {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [writerName, setWriterName] = useState('');
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
  const [showReviewModal, setShowReviewModal] = useState(false);


  // Modal states
  const [showMessageRequiredModal, setShowMessageRequiredModal] = useState(false);
  const [showMessageTooLongModal, setShowMessageTooLongModal] = useState(false);
  const [showQRFailureModal, setShowQRFailureModal] = useState(false);
  const [showURLCopyModal, setShowURLCopyModal] = useState(false);
  const [showURLCopyConfirmModal, setShowURLCopyConfirmModal] = useState(false);
  const [showURLCopyPromptModal, setShowURLCopyPromptModal] = useState(false);
  const [directUrl, setDirectUrl] = useState('');

  type VisibleSections = {
    hero: boolean;
    about?: boolean;
    contact?: boolean;
    stats?: boolean;
    features?: boolean
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

  // 2. lz-string を使用したデータ圧縮
  const compressData = (data: { [key: string]: string | number }) => {
    const jsonString = JSON.stringify(data);
    // compressToEncodedURIComponent は、圧縮後の文字列をURLで安全に使用できるようにエンコードします。
    return LZString.compressToEncodedURIComponent(jsonString);
  };

  // 4. 最適化されたQRコード生成関数（POSTリクエスト対応）
  const generateOptimizedQRCode = async () => {
    if (!message.trim()) {
      setShowMessageRequiredModal(true);
      return;
    }

    const maxLength = 5000;
    if (message.length > maxLength) {
      setShowMessageTooLongModal(true);
      return;
    }

    const compactData = {
      m: message.trim(),
      n: name.trim() || '',
      w: writerName.trim() || '',
      t: Date.now()
    };

    const encodedData = compressData(compactData);
    const letterUrl = `${window.location.origin}/letter#${encodedData}`;

    console.log('Original message length:', message.length);
    console.log('Encoded data length:', encodedData.length);
    console.log('Final URL length:', letterUrl.length);

    const qrConfig = {
      size: '400x400',
      ecc: 'L',
      format: 'png',
      margin: '0',
      qzone: '0'
    };

    // POSTリクエストでQRコードを生成（長文対応）
    try {
      const formData = new FormData();
      formData.append('data', letterUrl);
      formData.append('size', qrConfig.size);
      formData.append('ecc', qrConfig.ecc);
      formData.append('margin', qrConfig.margin);
      formData.append('qzone', qrConfig.qzone);
      formData.append('format', qrConfig.format);

      const response = await fetch('https://api.qrserver.com/v1/create-qr-code/', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      setQrCodeUrl(objectUrl);
      setShowQR(true);
      console.log('QR code generated successfully via POST');

    } catch (error) {
      console.error('Primary POST generation failed:', error);

      // フォールバック: QRicKit (GETリクエスト)
      try {
        // QRicKitは比較的長いURLに対応
        const fallbackUrl = `https://qrickit.com/api/qr?d=${encodeURIComponent(letterUrl)}&s=20&border=1&download=0`;

        const testImg = new window.Image();
        await new Promise((resolve, reject) => {
          testImg.onload = resolve;
          testImg.onerror = reject;
          testImg.src = fallbackUrl;
        });

        setQrCodeUrl(fallbackUrl);
        setShowQR(true);
        console.log('Fallback successful with QRicKit');
      } catch (fallbackError) {
        console.error('Fallback failed:', fallbackError);
        handleQRGenerationFailure();
      }
    }
  };

  // 5. QRコード生成失敗時の処理
  const handleQRGenerationFailure = () => {
    setShowQRFailureModal(true);

    // URLを直接コピーできるオプションを提供
    const messageData = {
      m: message.trim(),
      n: name.trim() || '',
      w: writerName.trim() || '',
      t: Date.now()
    };

    const encodedData = compressData(messageData);
    const directUrlValue = `${window.location.origin}/letter#${encodedData}`;
    setDirectUrl(directUrlValue);
  };

  const handleURLCopyConfirm = () => {
    navigator.clipboard.writeText(directUrl).then(() => {
      setShowURLCopyModal(true);
    }).catch(() => {
      setShowURLCopyPromptModal(true);
    });
  };

  // QRコード生成＋レビュー用モーダル表示
  const handleGenerateAndShowModal = async () => {
    await generateOptimizedQRCode();
    setShowReviewModal(true);
  };

  // 6. 文字数リアルタイム表示の改善
  const getCharacterInfo = (text: string) => {
    const maxLength = 5000; // UI上の現実的な上限を設定
    const length = text.length;
    let status = '';
    let color = '';

    if (length <= 1000) {
      status = '短文 - QRコード生成確実';
      color = 'text-green-500';
    } else if (length <= 2500) {
      status = '中文 - QRコード生成可能';
      color = 'text-blue-500';
    } else if (length <= 4000) {
      status = '長文 - QRコード生成に成功する可能性が高いです';
      color = 'text-yellow-500';
    } else if (length <= maxLength) {
      status = '超長文 - 内容によりQR生成が失敗する可能性があります';
      color = 'text-orange-500';
    } else {
      status = '文字数制限超過';
      color = 'text-red-500';
    }

    return { length, status, color, maxLength };
  };

  const charInfo = getCharacterInfo(message);

  const copyToClipboard = async () => {
    const messageData = {
      m: message.trim(),
      n: name.trim() || '',
      w: writerName.trim() || '',
      t: Date.now()
    };

    const encodedData = compressData(messageData);
    const letterUrl = `${window.location.origin}/letter#${encodedData}`;

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

  // 5分後にReviewModalを自動表示
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowReviewModal(true);
    }, 5 * 60 * 1000); // 5分 = 300,000ms
    return () => clearTimeout(timer);
  }, []);

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
                  相手のお名前（任意）
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例: お母さん"
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all duration-300 text-gray-700 bg-white/70 hover:bg-white/90"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  あなたのお名前（任意）
                </label>
                <input
                  type="text"
                  value={writerName}
                  onChange={(e) => setWriterName(e.target.value)}
                  placeholder="例: 花子"
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
                  placeholder={`例:\n\n「お母さんへ。いつも見守ってくれてありがとう。」\n「◯◯へ。出会ってくれて本当に感謝しています。」\n\nむずかしく考えずに、浮かんだ言葉から書き始めてみてください。`}
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all duration-300 resize-none text-gray-700 bg-white/70 hover:bg-white/90"
                  rows={8}
                  maxLength={charInfo.maxLength}
                />

                {/* 改善されたカウンター表示 */}
                <div className="flex justify-between items-center mt-2">
                  <div className={`text-sm font-medium ${charInfo.color}`}>
                    {charInfo.status}
                  </div>
                  <div className="text-sm text-gray-400">
                    <span className={charInfo.length > charInfo.maxLength ? 'text-red-500 font-bold' : ''}>
                      {charInfo.length}
                    </span>
                    /{charInfo.maxLength}文字
                  </div>
                </div>

                {/* プログレスバー */}
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div
                    className={`h-1 rounded-full transition-all duration-300 ${charInfo.length <= 200 ? 'bg-green-400' :
                      charInfo.length <= 2500 ? 'bg-blue-400' :
                        charInfo.length <= 4000 ? 'bg-yellow-400' :
                          charInfo.length <= charInfo.maxLength ? 'bg-orange-400' : 'bg-red-400'
                      }`}
                    style={{ width: `${Math.min((charInfo.length / charInfo.maxLength) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>


            <button
              onClick={handleGenerateAndShowModal}
              disabled={!message.trim() || message.length > charInfo.maxLength}
              className={`w-full font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 relative overflow-hidden ${!message.trim() || message.length > charInfo.maxLength
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 hover:from-rose-500 hover:via-pink-500 hover:to-purple-500 text-white cursor-pointer'
                }`}
            >
              <span className="relative z-10">
                {message.length > charInfo.maxLength ? '文字数制限を超えています' : 'QRコードを生成する'}
              </span>
              {message.trim() && message.length <= charInfo.maxLength && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
              )}
            </button>
          </div>

          <ReviewModal open={showReviewModal} onClose={() => setShowReviewModal(false)} />

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
                  unoptimized // Blob URLを使用するため最適化をスキップ
                />
              </div>

              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-2">
                  メッセージ長: {message.length}文字
                </div>
                <div className="text-sm text-gray-400">
                  このQRコードは高密度データに対応しています
                </div>
              </div>

              {/* 使用方法の説明を追加 */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-blue-800 mb-2">📱 QRコードの読み取り方法</h4>
                <p className="text-sm text-blue-600">
                  スマートフォンのカメラアプリでQRコードを読み取るか、<br />
                  QRコードリーダーアプリをご利用ください。
                </p>
              </div>

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
                <CountUp end={150} duration={6} separator="," suffix="+" />
              </div>
              <div className="text-gray-500">作成されたメッセージ</div>
            </div>
            <div className="text-center bg-white/40 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/60 transition-all duration-300 transform hover:scale-105">
              <Heart className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-700 mb-2">
                <CountUp end={100} duration={6} />%
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
              <h3 className="text-xl font-semibold text-gray-700 mb-4">印刷・設置・保管</h3>
              <p className="text-gray-500">QRコードを印刷して、墓石や思い出の品に貼り付けるなど保管してください</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Components */}
      {/* メッセージ必須モーダル */}
      <Modal
        isOpen={showMessageRequiredModal}
        onClose={() => setShowMessageRequiredModal(false)}
        title="メッセージが必要です"
        type="warning"
      >
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            メッセージを入力してください。
          </p>
          <ModalButton
            onClick={() => setShowMessageRequiredModal(false)}
            variant="primary"
          >
            了解しました
          </ModalButton>
        </div>
      </Modal>

      {/* メッセージ長すぎモーダル */}
      <Modal
        isOpen={showMessageTooLongModal}
        onClose={() => setShowMessageTooLongModal(false)}
        title="メッセージが長すぎます"
        type="warning"
      >
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            メッセージが長すぎます。{charInfo.maxLength}文字以内にしてください。
          </p>
          <ModalButton
            onClick={() => setShowMessageTooLongModal(false)}
            variant="primary"
          >
            了解しました
          </ModalButton>
        </div>
      </Modal>

      {/* QRコード生成失敗モーダル */}
      <Modal
        isOpen={showQRFailureModal}
        onClose={() => setShowQRFailureModal(false)}
        title="QRコード生成に失敗しました"
        type="error"
      >
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            以下の方法をお試しください：
          </p>
          <ul className="text-left text-gray-600 mb-6 space-y-2">
            <li>• メッセージを短くする（現在: {message.length}文字）</li>
            <li>• 不要な改行や空白を削除する</li>
            <li>• しばらく時間をおいて再試行する</li>
          </ul>
          <div className="flex gap-3 justify-center">
            <ModalButton
              onClick={() => setShowQRFailureModal(false)}
              variant="secondary"
            >
              閉じる
            </ModalButton>
            <ModalButton
              onClick={() => {
                setShowQRFailureModal(false);
                setShowURLCopyConfirmModal(true);
              }}
              variant="primary"
            >
              URLをコピー
            </ModalButton>
          </div>
        </div>
      </Modal>

      {/* URLコピー確認モーダル */}
      <ConfirmModal
        isOpen={showURLCopyConfirmModal}
        onClose={() => setShowURLCopyConfirmModal(false)}
        onConfirm={handleURLCopyConfirm}
        title="URLコピーの確認"
        message="QRコードの代わりに、直接URLをコピーしますか？"
        confirmText="コピーする"
        cancelText="キャンセル"
        type="info"
      />

      {/* URLコピー成功モーダル */}
      <Modal
        isOpen={showURLCopyModal}
        onClose={() => setShowURLCopyModal(false)}
        title="URLをコピーしました"
        type="success"
      >
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            URLをコピーしました。このURLを直接シェアできます。
          </p>
          <ModalButton
            onClick={() => setShowURLCopyModal(false)}
            variant="primary"
          >
            了解しました
          </ModalButton>
        </div>
      </Modal>

      {/* URLコピー手動モーダル */}
      <Modal
        isOpen={showURLCopyPromptModal}
        onClose={() => setShowURLCopyPromptModal(false)}
        title="URLを手動でコピー"
        type="info"
      >
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            以下のURLをコピーしてください：
          </p>
          <div className="bg-gray-100 p-3 rounded-lg mb-6">
            <code className="text-sm break-all text-gray-800">
              {directUrl}
            </code>
          </div>
          <ModalButton
            onClick={() => setShowURLCopyPromptModal(false)}
            variant="primary"
          >
            了解しました
          </ModalButton>
        </div>
      </Modal>

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