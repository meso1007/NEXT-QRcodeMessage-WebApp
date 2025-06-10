"use client"

import React, { FC, ReactElement, useEffect, useRef, useState } from 'react';
import { Shield, Calendar, CheckCircle, Eye, Lock, Database, FileText, Globe, Mail, Phone, MapPin, Clock } from 'lucide-react';

// GSAPライブラリの代替実装
type GSAPOptions = {
  duration?: number;
  delay?: number;
  y?: number;
  x?: number;
  opacity?: number | string;
  scale?: number;
};

type Subsection = {
  title: string;
  content: string;
};

type Section = {
  id: string;
  title: string;
  content?: string;
  icon: ReactElement<any>;
  subsections?: Subsection[];
};

type PrivacySectionProps = {
  section: Section;
  index: number;
};

const gsap = {
  timeline: () => ({
    from: (selector: string | Element, options: GSAPOptions) => {
      const elements = typeof selector === 'string'
        ? document.querySelectorAll(selector)
        : (selector ? [selector] : []);

      Array.from(elements).forEach(el => {
        if (el && el instanceof HTMLElement) {
          el.style.transition = `all ${options.duration || 1}s ease-out`;
          requestAnimationFrame(() => {
            Object.keys(options).forEach(key => {
              if (key !== 'duration' && key !== 'delay') {
                if (key === 'y') {
                  el.style.transform = `translateY(0px)`;
                  el.style.opacity = '1';
                } else if (key === 'opacity') {
                  el.style.opacity = '1';
                } else if (key === 'scale') {
                  el.style.transform = `scale(1)`;
                }
              }
            });
          });
        }
      });
      return this;
    },
    stagger: () => this,
    delay: () => this
  }),
  fromTo: (element: HTMLElement, from: GSAPOptions, to: GSAPOptions) => {
    if (!element || !element.style) return;

    Object.keys(from).forEach(key => {
      if (key === 'y') {
        element.style.transform = `translateY(${from[key]}px)`;
      } else if (key === 'opacity') {
        element.style.opacity = String(from[key]);
      } else if (key === 'scale') {
        element.style.transform = `scale(${from[key]})`;
      } else if (key === 'x') {
        element.style.transform = `translateX(${from[key]}px)`;
      }
    });

    element.style.transition = `all ${to.duration || 1}s ease-out`;

    setTimeout(() => {
      Object.keys(to).forEach(key => {
        if (key !== 'duration' && key !== 'delay' && key !== 'stagger') {
          if (key === 'y') {
            element.style.transform = `translateY(${to[key]}px)`;
          } else if (key === 'opacity') {
            element.style.opacity = String(to[key]);
          } else if (key === 'scale') {
            element.style.transform = `scale(${to[key]})`;
          } else if (key === 'x') {
            element.style.transform = `translateX(${to[key]}px)`;
          }
        }
      });
    }, (to.delay || 0) * 1000);
  }
};


const privacyData = [
  {
    id: 'overview',
    title: '概要',
    icon: <Shield className="w-5 h-5" />,
    content: `
      当社は、お客様のプライバシーを尊重し、個人情報の保護に関する法律および関連する法令を遵守して、
      お客様の個人情報を適切に取り扱います。本プライバシーポリシーは、当社がどのような個人情報を
      収集し、どのように利用・保護するかについて説明します。
    `
  },
  {
    id: 'collection',
    title: '収集する情報',
    icon: <Database className="w-5 h-5" />,
    subsections: [
      {
        title: '個人識別情報',
        content: '氏名、メールアドレス、電話番号、住所などの直接的に個人を特定できる情報'
      },
      {
        title: '利用情報',
        content: 'IPアドレス、ブラウザ情報、アクセス履歴、クッキー情報などの技術的情報'
      },
      {
        title: 'コンテンツ情報',
        content: 'お客様が作成、投稿、共有されるコンテンツやメッセージ'
      }
    ]
  },
  {
    id: 'purpose',
    title: '利用目的',
    icon: <Eye className="w-5 h-5" />,
    subsections: [
      {
        title: 'サービス提供',
        content: 'お客様にサービスを提供し、アカウント管理を行うため'
      },
      {
        title: 'サポート対応',
        content: 'お客様からのお問い合わせやサポート要請に対応するため'
      },
      {
        title: 'サービス改善',
        content: 'サービスの品質向上や新機能開発のための分析'
      },
      {
        title: 'マーケティング',
        content: 'お客様の同意に基づく商品・サービスの案内（オプトアウト可能）'
      }
    ]
  },
  {
    id: 'sharing',
    title: '第三者との共有',
    icon: <Globe className="w-5 h-5" />,
    content: `
      当社は、以下の場合を除き、お客様の個人情報を第三者に提供いたしません：
      法令に基づく場合、お客様の同意がある場合、業務委託先への必要最小限の提供、
      事業譲渡の際の承継、生命・身体の安全確保のための緊急時。
    `
  },
  {
    id: 'security',
    title: 'セキュリティ',
    icon: <Lock className="w-5 h-5" />,
    subsections: [
      {
        title: '技術的対策',
        content: 'SSL暗号化、ファイアウォール、侵入検知システムによる保護'
      },
      {
        title: '組織的対策',
        content: 'アクセス権限の管理、従業員への教育、定期的なセキュリティ監査'
      },
      {
        title: 'データ保管',
        content: '安全なデータセンターでの保管と定期的なバックアップ'
      }
    ]
  },
  {
    id: 'rights',
    title: 'お客様の権利',
    icon: <CheckCircle className="w-5 h-5" />,
    subsections: [
      {
        title: 'アクセス権',
        content: 'ご自身の個人情報の開示を求める権利'
      },
      {
        title: '訂正・削除権',
        content: '個人情報の訂正、削除を求める権利'
      },
      {
        title: '利用停止権',
        content: '個人情報の利用停止、消去を求める権利'
      },
      {
        title: 'データポータビリティ',
        content: '個人情報を構造化された形式で受け取る権利'
      }
    ]
  },
  {
    id: 'cookies',
    title: 'Cookieとトラッキング',
    icon: <Globe className="w-5 h-5" />,
    content: `
      当社では、サービスの改善とユーザー体験の向上のため、Cookieや類似の技術を使用しています。
      これらの技術により、お客様の設定を記憶し、パーソナライズされたコンテンツを提供します。
      ブラウザの設定でCookieを無効にすることができますが、一部機能が制限される場合があります。
    `
  },
  {
    id: 'updates',
    title: 'ポリシーの更新',
    icon: <FileText className="w-5 h-5" />,
    content: `
      本プライバシーポリシーは、法令の変更やサービスの改善に伴い更新される場合があります。
      重要な変更がある場合は、サービス内での通知やメールでお知らせいたします。
      定期的に本ページをご確認いただくことをお勧めします。
    `
  }
];

type TableOfContentsProps = {
  sections: Section[];
  activeSection: string;
  onSectionClick: (id: string) => void;
};

const TableOfContents: FC<TableOfContentsProps> = ({
  sections,
  activeSection,
  onSectionClick,
}) => {
  const tocRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (tocRef.current) {
      gsap.fromTo(
        tocRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8, delay: 0.3 }
      );
    }
  }, []);

  return (
    <div ref={tocRef} className="sticky top-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <FileText className="w-4 h-4" />
          <span>目次</span>
        </h3>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => onSectionClick(section.id)}
                className={`flex items-center space-x-2 w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${activeSection === section.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {section.icon}
                <span>{section.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const PrivacySection: FC<PrivacySectionProps> = ({ section, index }) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: index * 0.1 }
      );
    }
  }, [index]);

  return (
    <div
      ref={sectionRef}
      id={section.id}
      className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-full p-3 shadow-lg">
          {React.cloneElement(section.icon, {
            className: "text-white w-5 h-5",
          })}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
      </div>

      {section.content && (
        <p className="text-gray-700 leading-relaxed mb-6">
          {section.content.trim()}
        </p>
      )}

      {section.subsections && (
        <div className="space-y-4">
          {section.subsections.map((subsection, subIndex) => (
            <div
              key={subIndex}
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-l-4 border-blue-400"
            >
              <h4 className="font-semibold text-gray-800 mb-2">
                {subsection.title}
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {subsection.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


const PrivacyPolicyPage = () => {
  const containerRef = useRef(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    // ヘッダーアニメーション
    if (headerRef.current) {
      const iconEl = headerRef.current?.querySelector('.header-icon') as HTMLElement | null;
      const titleEl = headerRef.current.querySelector('h1');
      const descEl = headerRef.current.querySelector('p');
      const metaEls = headerRef.current.querySelectorAll('.header-meta > *');

      if (iconEl) {
        gsap.fromTo(iconEl,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, delay: 0.2 }
        );
      }

      if (titleEl) {
        gsap.fromTo(titleEl,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, delay: 0.4 }
        );
      }

      if (descEl) {
        gsap.fromTo(descEl,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, delay: 0.6 }
        );
      }

      metaEls.forEach((el, index) => {
        const htmlEl = el as HTMLElement;
        gsap.fromTo(htmlEl,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, delay: 0.8 + index * 0.1 }
        );
      });

    }

    // スクロール監視
    const handleScroll = () => {
      const sections = privacyData.map(section => section.id);
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };


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
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="header-icon inline-flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-full p-4 shadow-xl">
              <Shield className="text-white w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            プライバシーポリシー
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
            お客様の個人情報の取り扱いについて、透明性を保ち、
            適切な保護措置を講じることをお約束いたします。
          </p>
          <div className="header-meta flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>最終更新: 2025年6月10日</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4" />
              <span>第1版</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <TableOfContents
              sections={privacyData}
              activeSection={activeSection}
              onSectionClick={scrollToSection}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {privacyData.map((section, index) => (
              <PrivacySection
                key={section.id}
                section={section}
                index={index}
              />
            ))}

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-8 text-white shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <Mail className="w-6 h-6" />
                <h3 className="text-2xl font-bold">プライバシーに関するお問い合わせ</h3>
              </div>
              <p className="text-blue-100 mb-6">
                個人情報の取り扱いに関するご質問やご要望がございましたら、
                以下の窓口までお気軽にお問い合わせください。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <div>
                      <p className="font-semibold">メール</p>
                      <p className="text-blue-200">privacy@example.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <div>
                      <p className="font-semibold">電話</p>
                      <p className="text-blue-200">03-1234-5678</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <div>
                      <p className="font-semibold">受付時間</p>
                      <p className="text-blue-200">平日 9:00-18:00 (JST)</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <div>
                      <p className="font-semibold">データ保護責任者</p>
                      <p className="text-blue-200">田中 太郎</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Subject Rights */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Shield className="text-green-600 mt-1 w-5 h-5" />
                <div>
                  <h4 className="text-green-800 font-semibold mb-2">
                    お客様の権利の行使について
                  </h4>
                  <p className="text-green-700 text-sm leading-relaxed mb-3">
                    個人情報の開示、訂正、削除等をご希望の場合は、本人確認の上で対応いたします。
                    お客様の権利行使に関する手続きについては、上記窓口までお問い合わせください。
                  </p>
                  <div className="text-green-600 text-xs">
                    ※原則として1ヶ月以内に回答いたします
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;