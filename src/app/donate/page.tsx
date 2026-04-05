"use client"
import React, { useEffect, useRef } from 'react';
import { Heart, Users, Target, Bird, Shield, FolderDot, Globe, DollarSign, Router, TrafficCone } from 'lucide-react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const impactStats = [
  {
    number: '運営費',
    label: 'サービスを安全に、ずっと続けるため',
    icon: <DollarSign className="text-white w-8 h-8" />
  },
  {
    number: 'プライバシー重視',
    label: 'データはサーバに保存せず安心・安全に',
    icon: <Target className="text-white w-8 h-8" />
  },
  {
    number: '新機能開発',
    label: '画像・動画添付や文字数制限の緩和など',
    icon: <Globe className="text-white w-8 h-8" />
  },
  {
    number: '非営利・個人運営',
    label: '寄付は全てサービス維持・改善に使われます',
    icon: <Users className="text-white w-8 h-8" />
  },
];

const StatCard = ({ icon, value, label }: StatCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, delay: 0.1 }
      );
    }
  }, []);
  return (
    <div ref={cardRef} className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-full p-4 inline-flex mb-4">
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-800 mb-2">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
};

const DonationPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      const iconEl = headerRef.current.querySelector('.header-icon');
      const titleEl = headerRef.current.querySelector('h1');
      const descEl = headerRef.current.querySelector('p');

      if (iconEl) {
        gsap.fromTo(iconEl as HTMLElement,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, delay: 0.2 }
        );
      }

      if (titleEl) {
        gsap.fromTo(titleEl as HTMLElement,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, delay: 0.4 }
        );
      }

      if (descEl) {
        gsap.fromTo(descEl as HTMLElement,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, delay: 0.6 }
        );
      }
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen py-20 px-6 md:px-10 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)
        `,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div ref={headerRef} className="text-center mb-16">
          <div className="header-icon inline-flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-full p-4 shadow-xl">
              <Heart className="text-white w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            共に未来を築く
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-8">
            多くの方に安心してご利用いただけるよう、できる限り完全無料でサービスを提供していくことを目指しています。<br />
            この想いが一人でも多くの方の心に届き、救いとなることを願っています。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {impactStats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              value={stat.number}
              label={stat.label}
            />
          ))}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl mb-16">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-100 to-orange-200 shadow-lg mb-4">
              <TrafficCone className="w-12 h-12 text-orange-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center">
              この機能は現在開発中です。
            </h2>
            <p className="text-gray-500 text-center max-w-md">
              ご不便をおかけして申し訳ありません。<br />
              公開まで今しばらくお待ちください。
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white shadow-2xl mb-16">
          <div className="text-center mb-8">
            <Shield className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">寄付金の使用先</h2>
            <p className="text-blue-100 max-w-3xl mx-auto">
              すべての寄付金の使途を明確に報告し、支援者の皆様に信頼していただける
              活動を心がけています。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Router className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">
                ドメイン代・運営費
              </h3>
              <p className="text-sm text-blue-100">
                毎月かかるドメイン費、サーバー代にします。
              </p>
            </div>
            <div className="text-center">
              <FolderDot className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">今後の機能追加</h3>
              <p className="text-sm text-blue-100">
                独立した監査法人による定期的な監査を実施
              </p>
            </div>
            <div className="text-center">
              <Bird className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">寄付金</h3>
              <p className="text-sm text-blue-100">
                遺族支援、東日本大震災などの支援金として使用します。
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            寄付に関するお問い合わせ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">電話でのお問い合わせ</h4>
              <Link href="tel:0120123456" className="text-gray-600 mb-1 hover:text-blue-400 duration-300">070-8458-6447</Link>
              <p className="text-sm text-gray-500">原則緊急時以外はメールでのお問い合わせをお願いしております</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">メールでのお問い合わせ</h4>
              <Link href="mailto:otodokelife@gmail.com" className="text-gray-600 mb-1 hover:text-blue-400 duration-300">otodokelife@gmail.com</Link>
              <p className="text-sm text-gray-500">24時間受付(48時間以内に返信)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;
