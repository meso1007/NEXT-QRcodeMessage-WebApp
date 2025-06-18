"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import CountUp from 'react-countup';


// Register the plugin
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

type StarProps = {
    filled: boolean;
};
type ChevronDownProps = {
    className?: string;
};

// Icon components
const ChevronDown = React.forwardRef<SVGSVGElement, ChevronDownProps>(
    ({ className }, ref) => (
        <svg
            ref={ref}
            className={className}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
    )
);

ChevronDown.displayName = 'ChevronDown';

interface IconProps {
    className?: string;
}

const Search = ({ className }: IconProps) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
    </svg>
);

const HelpCircle = ({ className }: IconProps) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <circle cx="12" cy="17" r="1"></circle>
    </svg>
);

const Star = ({ filled }: StarProps) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#fbbf24" : "none"} stroke="#fbbf24" strokeWidth="2">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
    </svg>
);

const FAQData = [
    {
        category: "基本機能",
        questions: [
            {
                question: "このサービスはどのようなものですか？",
                answer: "このサービスは、もしもの時に大切な人へ想いを届けられるように設計された、メッセージ保存プラットフォームです。記念日や日常の感謝など、さまざまな場面でも活用でき、あなたの気持ちを安心してカタチにして残すことができます。"
            },
            {
                question: "無料で利用できますか？",
                answer: "基本機能は無料でご利用いただけます。より多くの保存容量や画像、動画でのメッセージをお求めの場合は、プレミアムプランも検討しています。"
            },
            {
                question: "QRコードに有効期限はありますか?",
                answer: "QRコード自体に有効期限はありません。ユーザーが保管している限り、そしてこのサービスが提供されている限り、いつでもアクセス可能です。ただし、万が一に備えて、メッセージを受け取った方が内容を保存しておくことをおすすめしています。"
            },
            {
                question: "どのようなデバイスで利用できますか？",
                answer: "スマートフォン、タブレット、PCなど、インターネットに接続できるほぼ全てのデバイスでご利用いただけます。レスポンシブデザインにより、どの画面サイズでも快適にお使いいただけます。"
            },
        ]
    },
    {
        category: "プライバシー・セキュリティ",
        questions: [
            {
                question: "データの安全性は保証されていますか？",
                answer: "はい。お客様のメッセージはその場でQRコードとして発行するのみでこちらではデータの保管は基本的には行わない予定です。そのため、QRコードを無くされてしまいますと再発行ができなくなりますので、自己管理で保管ください。"
            },
            {
                question: "他の人に見られる心配はありませんか？",
                answer: "はい。お客様のメッセージはQRコードとして発行されます。このQRコードを読み取られない限り他の人に見られる心配はありません。"
            },
        ]
    },
    {
        category: "使い方・操作",
        questions: [
            {
                question: "初めて使うのですが、何から始めればいいですか？",
                answer: "本サービスではアカウント登録などは不要です。ホームに戻り、メッセージを入力していただき、QRコードを表示するボタンを押すと、表示されます。"
            },
            {
                question: "QRコード化した内容を後から編集できますか?",
                answer: "一度QRコード化してしまいますと、内容の変更はできませんので誤字脱字など確認してからのQRコード化を推奨しております。QRコード化は何回もやり直せるので気軽にお使いください。"
            },
            {
                question: "使用用途がわかりません。",
                answer: "このサービスは、もしもの時に備えて、あなたの想いを大切な人へ届けるためのツールです。突然の別れが訪れてしまう前に、伝えたい言葉や感謝、思い出を記録し、未来に残すことができます。いま伝えるのは照れくさいけれど、いざという時に『ちゃんと想いが届く』、そんな安心を支えるための場所です。"
            }
        ]
    },
    {
        category: "技術的な問題",
        questions: [
            {
                question: "アプリが正常に動作しない場合はどうすればいいですか？",
                answer: "まず、ブラウザの更新やキャッシュクリアをお試しください。それでも解決しない場合は、サポートチームまでお気軽にお問い合わせください。24時間以内にご返答いたします。"
            },
            {
                question: "メッセージの文字数に制限はありますか？",
                answer: "はい。無料プランでは1000字までになります。今後はユーザーの増加に合わせて、文字数制限の拡大や画像、動画の添付も検討中です。"
            }
        ]
    }
];

type FAQItemProps = {
    question: string;
    answer: string;
    isOpen: boolean;
    onToggle: () => void;
};

const FAQItem = ({ question, answer, isOpen, onToggle }: FAQItemProps) => {
    const itemRef = useRef(null);
    const answerRef = useRef(null);
    const iconRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            gsap.to(answerRef.current, {
                height: "auto",
                opacity: 1,
                duration: 0.5,
                ease: "power2.out",
            });
            gsap.to(iconRef.current, {
                rotation: 180,
                duration: 0.3,
                ease: "power2.out",
            });
        } else {
            gsap.to(answerRef.current, {
                height: 0,
                opacity: 0,
                duration: 0.3,
                ease: "power2.out",
            });
            gsap.to(iconRef.current, {
                rotation: 0,
                duration: 0.3,
                ease: "power2.out",
            });
        }
    }, [isOpen]);

    return (
        <div
            ref={itemRef}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
        >
            <button
                onClick={onToggle}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors duration-200"
            >
                <span className="text-gray-800 font-medium text-lg pr-4">{question}</span>
                <ChevronDown
                    ref={iconRef}
                    className="text-rose-500 flex-shrink-0 transform transition-transform"
                />
            </button>
            <div
                ref={answerRef}
                className="overflow-hidden"
                style={{ height: 0, opacity: 0 }}
            >
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {answer}
                </div>
            </div>
        </div>
    );
};

export default function FAQPage() {
    const containerRef = useRef(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef(null);
    const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial setup
            gsap.set([titleRef.current, searchRef.current], {
                opacity: 0,
                y: 50,
            });

            gsap.set(categoryRefs.current, {
                opacity: 0,
                y: 100,
            });

            // Main entrance animation
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                }
            });

            tl.to(titleRef.current, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
            })
                .to(searchRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                }, "-=0.5")
                .to(categoryRefs.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power2.out",
                }, "-=0.4");

            // Floating animation for the title icon
            if (titleRef.current) {
            gsap.to(titleRef.current.querySelector('svg'), {
                y: -10,
                duration: 2,
                ease: "power1.inOut",
                yoyo: true,
                repeat: -1,
            });
            }

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleToggle = (categoryIndex: number, itemIndex: number) => {
        const key = `${categoryIndex}-${itemIndex}`;
        setOpenItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const filteredData = FAQData.map(category => ({
        ...category,
        questions: category.questions.filter(item =>
            item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

    return (
        <div
            ref={containerRef}
            className="min-h-screen py-20 px-6 mx-3 md:px-10 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 overflow-hidden relative overflow-hidden"
            style={{
                backgroundImage: `
          radial-gradient(circle at 10% 20%, rgba(147, 197, 253, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 90% 80%, rgba(196, 181, 253, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(249, 168, 212, 0.05) 0%, transparent 50%)
        `,
            }}
        >
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div ref={titleRef} className="text-center mb-12">
                    <div className="inline-flex items-center justify-center mb-6">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-4 shadow-lg">
                            <HelpCircle className="text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        よくある質問
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        サービスに関するご質問にお答えします。こちらで解決しない場合は、お気軽にお問い合わせください。
                    </p>
                </div>

                {/* Search */}
                <div ref={searchRef} className="mb-12">
                    <div className="relative max-w-lg mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="質問を検索..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-700"
                        />
                    </div>
                </div>

                {/* FAQ Categories */}
                <div className="space-y-12">
                    {filteredData.map((category, categoryIndex) => (
                        <div
                            key={category.category}
                            ref={(el) => { categoryRefs.current[categoryIndex] = el }}
                            className="space-y-6"
                        >
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} filled={i < 4} />
                                    ))}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {category.category}
                                </h2>
                                <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-purple-200"></div>
                            </div>

                            <div className="space-y-4">
                                {category.questions.map((item, itemIndex) => (
                                    <FAQItem
                                        key={itemIndex}
                                        question={item.question}
                                        answer={item.answer}
                                        isOpen={openItems[`${categoryIndex}-${itemIndex}`]}
                                        onToggle={() => handleToggle(categoryIndex, itemIndex)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Section */}
                <div className="mt-20 text-center hover:scale-102 duration-300">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
                        <h3 className="text-2xl font-bold mb-4">
                            解決しませんでしたか？
                        </h3>
                        <p className="text-blue-100 mb-6">
                            お困りのことがございましたら、お気軽にサポートチームまでお問い合わせください。
                        </p>
                        <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold cursor-pointer hover:bg-blue-100 transition-all duration-500 ease-out shadow-md hover:shadow-lg transform hover:scale-102">
                            <Link href="mailto:otodokelife@gmail.com">
                                お問い合わせ
                            </Link>
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                        <div className="text-3xl font-bold text-blue-600 mb-2">24時間</div>
                        <div className="text-gray-600 text-sm">平均回答時間</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                            <CountUp end={98} duration={2} />%
                        </div>
                        <div className="text-gray-600 text-sm">問題解決率</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                        <div className="text-3xl font-bold text-rose-600 mb-2">
                            <CountUp end={1000} duration={2} separator="," />+
                        </div>
                        <div className="text-gray-600 text-sm">解決済み質問</div>
                    </div>
                </div>
            </div>
        </div>
    );
}