"use client"

import React, { useState, useEffect } from 'react';
import { Heart, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

// Header コンポーネント
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const navItems = [
    { name: 'ホーム', href: '/' },
    { name: 'このサイトについて', href: '/about' },
    { name: 'よくある質問', href: '/faq' },
    { name: '利用規約', href: '/terms' },
    { name: 'プライバシーポリシー', href: '/privacy' },
    { name: '寄付について', href: '/donate' },
  ];

  return (
    <header className="bg-white/70 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50 px-3">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* ロゴ部分 */}
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-rose-400" />
            <div>
              <h1 className="text-2xl font-bold text-gray-700">OTODOKE LIFE</h1>
              <p className="text-sm text-gray-500 hidden sm:block">大切な人への想いを、永遠に残す</p>
            </div>
          </div>

          {/* デスクトップナビゲーション */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 ${mounted ? "py-3" : "py-2"} rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                      ? "bg-gradient-to-r from-rose-100 to-pink-100 text-rose-600 shadow-sm"
                      : "text-gray-600 hover:text-rose-500 hover:bg-pink-50"
                    }`}
                >
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* モバイルメニューボタン */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-rose-500 hover:bg-pink-50 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* モバイルナビゲーション */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-pink-100 mt-4">
            <nav className="flex flex-col space-y-2 pt-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 ${mounted ? "py-3" : "py-2"} rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                        ? "bg-gradient-to-r from-rose-100 to-pink-100 text-rose-600 shadow-sm"
                        : "text-gray-600 hover:text-rose-500 hover:bg-pink-50"
                      }`}
                  >
                    {item.name}
                  </a>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}