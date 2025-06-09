"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the plugin
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// Icon components
const FileText = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14,2 L14,8 L20,8 M14,2 L20,8 L20,20 C20,21.1045695 19.1045695,22 18,22 L6,22 C4.8954305,22 4,21.1045695 4,20 L4,4 C4,2.8954305 4.8954305,2 6,2 L14,2 Z"></path>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10,9 9,9 8,9"></polyline>
    </svg>
);

const Calendar = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

const CheckCircle = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22,4 12,14.01 9,11.01"></polyline>
    </svg>
);

const ArrowRight = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12,5 19,12 12,19"></polyline>
    </svg>
);

const Shield = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
);

const termsData = [
    {
        id: "service-overview",
        title: "サービス概要",
        icon: <FileText />,
        content: [
            "本サービスは、ユーザーの想い出・メッセージを大切に保管し、必要に応じて共有できるプラットフォームです。",
            "ご利用にはアカウント登録が必要です。登録情報は厳重に管理され、許可なく第三者に提供されることはありません。",
            "サービスの内容は、ユーザー体験の向上のため、随時アップデート・改善される可能性があります。"
        ]
    },
    {
        id: "user-obligations",
        title: "ユーザーの責任",
        icon: <CheckCircle />,
        content: [
            "正確な情報でアカウントを作成・管理し、不正利用の防止に努めてください。",
            "他人を傷つける内容、違法・不適切な投稿は禁止されています。",
            "システムへの不正アクセスや、サービス運営を妨げる行為は固く禁じられています。",
            "営利目的での利用や複数アカウントの作成には、事前の許可が必要です。"
        ]
    },
    {
        id: "privacy-data",
        title: "プライバシーとデータの取り扱い",
        icon: <Shield />,
        content: [
            "ユーザー情報は最新のセキュリティ技術を用いて保護されています。",
            "投稿された写真やメッセージの権利はユーザーに帰属しますが、サービス提供の範囲内で利用させていただきます。",
            "データの利用・保存・第三者提供に関しては、プライバシーポリシーで詳しくご案内しています。",
            "ユーザーは、自身のアカウントやデータの削除をいつでも申請できます。"
        ]
    },
    {
        id: "service-availability",
        title: "サービスの提供と変更",
        icon: <Calendar />,
        content: [
            "基本的に24時間利用可能ですが、メンテナンス等により一時停止する場合があります。",
            "機能の追加や調整などの変更が行われることがあります。",
            "重要な変更は、事前にサービス内またはメールにてお知らせします。",
            "自然災害など予期せぬ事態による停止には責任を負いかねます。"
        ]
    },
    {
        id: "limitation-liability",
        title: "免責事項",
        icon: <Shield />,
        content: [
            "本サービスは現状のまま提供され、すべての目的に適合することを保証するものではありません。",
            "当社は、通常の利用において発生した損害について、重大な過失を除き責任を負いません。",
            "賠償が必要な場合、直近12ヶ月間にお支払いいただいた料金を上限とします。",
            "外部サービスとの連携に関するトラブルは、該当する提供元の責任となります。"
        ]
    },
    {
        id: "modifications",
        title: "利用規約の変更",
        icon: <FileText />,
        content: [
            "本利用規約は、法令やサービス内容の変更に応じて改定されることがあります。",
            "大きな変更がある場合は、事前にサービス内やメールで通知いたします。",
            "通知後もサービスを継続してご利用いただいた場合、変更に同意いただいたものとみなします。",
            "変更に同意いただけない場合は、アカウントの削除を含め、サービスの利用停止をお願いします。"
        ]
    }
];


const TableOfContents = ({ sections, activeSection, onSectionClick }) => {
    const tocRef = useRef(null);

    return (
        <div ref={tocRef} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg sticky top-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <FileText />
                <span>目次</span>
            </h3>
            <nav className="space-y-2">
                {sections.map((section, index) => (
                    <button
                        key={section.id}
                        onClick={() => onSectionClick(section.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${activeSection === section.id
                                ? 'bg-blue-100 text-blue-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <span className="text-blue-500">{section.icon}</span>
                        <span className="text-sm">{section.title}</span>
                        {activeSection === section.id && (
                            <ArrowRight className="ml-auto text-blue-500" />
                        )}
                    </button>
                ))}
            </nav>
        </div>
    );
};

const TermsSection = ({ section, index }) => {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const contentRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Set initial states
            gsap.set([titleRef.current, ...contentRef.current], {
                opacity: 0,
                y: 30,
            });

            // Animation on scroll
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top 70%",
                onEnter: () => {
                    const tl = gsap.timeline();

                    tl.to(titleRef.current, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: "power2.out",
                    })
                        .to(contentRef.current, {
                            opacity: 1,
                            y: 0,
                            duration: 0.5,
                            stagger: 0.1,
                            ease: "power2.out",
                        }, "-=0.3");
                }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id={section.id}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
            <div
                ref={titleRef}
                className="flex items-center space-x-3 mb-6"
            >
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-3 text-white shadow-md">
                    {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
            </div>

            <div className="space-y-4">
                {section.content.map((paragraph, pIndex) => (
                    <p
                        key={pIndex}
                        ref={el => contentRef.current[pIndex] = el}
                        className="text-gray-700 leading-relaxed pl-2 border-l-2 border-blue-200"
                    >
                        {paragraph}
                    </p>
                ))}
            </div>
        </section>
    );
};

export default function TermsPage() {
    const containerRef = useRef(null);
    const headerRef = useRef(null);
    const [activeSection, setActiveSection] = useState(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial setup
            gsap.set(headerRef.current, {
                opacity: 0,
                y: -50,
            });

            // Header animation
            gsap.to(headerRef.current, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                delay: 0.2,
            });

            // Floating animation for header icon
            gsap.to(headerRef.current.querySelector('.header-icon'), {
                y: -10,
                duration: 3,
                ease: "power1.inOut",
                yoyo: true,
                repeat: -1,
            });

            // Section observation for active section
            const sections = document.querySelectorAll('section[id]');
            const observerOptions = {
                rootMargin: '-20% 0px -60% 0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            }, observerOptions);

            sections.forEach(section => observer.observe(section));

            return () => observer.disconnect();

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
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
                            <FileText className="text-white w-8 h-8" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        利用規約
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
                        「おくる想い」は、大切な人へメッセージを届けるためのプラットフォームです。<br />
                        ご利用にあたってのルールを明記しておりますので、必ずお読みください。
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                            <Calendar />
                            <span>最終更新: 2024年12月1日</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="flex items-center space-x-1">
                            <CheckCircle />
                            <span>第3版</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Table of Contents */}
                    <div className="lg:col-span-1">
                        <TableOfContents
                            sections={termsData}
                            activeSection={activeSection}
                            onSectionClick={scrollToSection}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-8">
                        {termsData.map((section, index) => (
                            <TermsSection
                                key={section.id}
                                section={section}
                                index={index}
                            />
                        ))}

                        {/* Contact Information */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-8 text-white shadow-2xl">
                            <h3 className="text-2xl font-bold mb-4">お問い合わせ</h3>
                            <p className="text-blue-100 mb-6">
                                サービスの内容やご意見、ご相談などがございましたら、お気軽にご連絡ください。
                                また、メディア掲載やコラボレーションのご相談も歓迎しています。
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-semibold mb-1">メール</p>
                                    <p className="text-blue-200">otodokelife@gmail.com</p>
                                </div>
                                <div>
                                    <p className="font-semibold mb-1">営業時間</p>
                                    <p className="text-blue-200">平日 9:00-18:00 (JST)</p>
                                </div>
                            </div>
                        </div>

                        {/* Agreement Confirmation */}
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                            <div className="flex items-start space-x-3">
                                <CheckCircle className="text-green-600 mt-1" />
                                <div>
                                    <h4 className="text-green-800 font-semibold mb-2">
                                        規約への同意について
                                    </h4>
                                    <p className="text-green-700 text-sm leading-relaxed">
                                        本サービスをご利用いただくことで、これらの利用規約に同意したものとみなされます。
                                        定期的に規約をご確認いただき、変更がある場合は速やかにお読みください。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}