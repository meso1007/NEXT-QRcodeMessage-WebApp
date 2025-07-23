"use client"
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Heart, Users, Target, Bird, Shield, Gift, CreditCard, Building, FolderDot, CheckCircle, Star, Globe, DollarSign, Router, JapaneseYen } from 'lucide-react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Modal, { ModalButton } from '@/components/Modal';

// Register the plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface StatCardProps {
    icon: React.ReactNode;
    value: string;
    label: string;
}

interface Testimonial {
    avatar: string;
    name: string;
    role: string;
    comment: string;
}

interface TestimonialCardProps {
    testimonial: Testimonial;
    index: number;
}

interface PaymentMethod {
    id: string;
    icon: React.ReactNode;
    name: string;
    description: string;
    fee: string;
    processing: string;
}

interface PaymentMethodCardProps {
    method: PaymentMethod;
    isSelected: boolean;
    onClick: (id: string) => void;
}

const donationAmounts = [
  { amount: 1000, label: '1,000円', description: '' },
  { amount: 3000, label: '3,000円', description: '' },
  { amount: 5000, label: '5,000円', description: '' },
  { amount: 10000, label: '10,000円', description: '' },
  { amount: 30000, label: '30,000円', description: '' },
  { amount: 0, label: 'その他の金額', description: '' }
];

const donationMethods = [
  {
    id: 'credit',
    name: 'クレジットカード',
    icon: <CreditCard className="w-6 h-6" />,
    description: 'Visa, Mastercard, JCB, American Express',
    fee: '無料',
    processing: '即座に処理'
  },
  {
    id: 'bank',
    name: '銀行振込',
    icon: <Building className="w-6 h-6" />,
    description: '日本国内の銀行から振込',
    fee: '振込手数料お客様負担',
    processing: '1-3営業日'
  },
  {
    id: 'convenience',
    name: 'コンビニ決済',
    icon: <Gift className="w-6 h-6" />,
    description: 'セブン-イレブン、ローソン、ファミリーマート',
    fee: '無料',
    processing: '即座に処理'
  }
];

const impactStats = [
  {
    number: 'ドメイン代・運営費',
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

const testimonials = [
  {
    name: 'Mさん',
    role: '個人寄付者',
    comment: 'このサービスのおかげで大切な思い出を安心して残せています。心から感謝しています。',
    avatar: ''
  },
  {
    name: 'Kさん',
    role: '初回寄付者',
    comment: '非営利で個人運営されていることに共感し、少額ですが応援させていただきました。',
    avatar: ''
  },
  {
    name: 'Yさん',
    role: '利用者',
    comment: '思い出のメッセージをQRコードにできて、家族で何度も見返せるのが嬉しいです。',
    avatar: ''
  }
];

type DonationCardContents = {
  amount: number,
  label: ReactNode,
  description: string,
  isSelected: boolean,
  onClick: (amount: number) => void,
  isCustom: boolean
}

const DonationCard = ({ amount, label, description, isSelected, onClick, isCustom = false }: DonationCardContents) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: Math.random() * 0.3 }
      );
    }
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={() => onClick(amount)}
      className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${isSelected
        ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
        : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
        }`}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
          <CheckCircle className="w-4 h-4" />
        </div>
      )}

      <div className="text-center">
        <div className="text-2xl font-bold text-gray-800 mb-2">
          {isCustom ? <JapaneseYen className="w-8 h-8 mx-auto text-blue-500" /> : label}
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

const PaymentMethodCard = ({ method, isSelected, onClick }: PaymentMethodCardProps) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, delay: Math.random() * 0.2 }
      );
    }
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={() => onClick(method.id)}
      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${isSelected
        ? 'border-green-500 bg-green-50 shadow-lg'
        : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
        }`}
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-full ${isSelected ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
          }`}>
          {method.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-1">{method.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{method.description}</p>
          <div className="flex justify-between text-xs text-gray-500">
            <span>手数料: {method.fee}</span>
            <span>処理: {method.processing}</span>
          </div>
        </div>
        {isSelected && (
          <CheckCircle className="w-5 h-5 text-green-500" />
        )}
      </div>
    </div>
  );
};

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

const TestimonialCard = ({ testimonial, index }: TestimonialCardProps) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: index * 0.2 }
      );
    }
  }, [index]);

  return (
    <div ref={cardRef} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <div className="flex items-center space-x-4 mb-4">
        <div className="text-3xl">{testimonial.avatar}</div>
        <div>
          <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
          <p className="text-sm text-gray-600">{testimonial.role}</p>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed">{testimonial.comment}</p>
      <div className="flex space-x-1 mt-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
        ))}
      </div>
    </div>
  );
};

const DonationPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isMonthly, setIsMonthly] = useState<boolean>(false);

  // Modal states
  const [showSelectionRequiredModal, setShowSelectionRequiredModal] = useState(false);
  const [showDonationConfirmModal, setShowDonationConfirmModal] = useState(false);
  const [donationDetails, setDonationDetails] = useState<{amount: string | number, method: string}>({amount: '', method: ''});

  useEffect(() => {
    // ヘッダーアニメーション
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

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    if (amount !== 0) {
      setCustomAmount('');
    }
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(0);
  };

  const handleDonate = () => {
    const amount = selectedAmount === 0 ? customAmount : selectedAmount;
    if (!amount || !selectedMethod) {
      setShowSelectionRequiredModal(true);
      return;
    }

    setDonationDetails({ amount, method: selectedMethod });
    setShowDonationConfirmModal(true);
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

        {/* Impact Stats */}
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

        {/* Donation Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl mb-16">
          <div className="flex items-center space-x-3 mb-8">
            <Gift className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">寄付をする</h2>
          </div>

          {/* Monthly/One-time Toggle */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gray-100 rounded-full p-1 flex">
              <button
                onClick={() => setIsMonthly(false)}
                className={`px-6 py-2 rounded-full transition-all ${!isMonthly ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600'
                  }`}
              >
                単発寄付
              </button>
              <button
                onClick={() => setIsMonthly(true)}
                className={`px-6 py-2 rounded-full transition-all ${isMonthly ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600'
                  }`}
              >
                継続寄付
              </button>
            </div>
          </div>

          {/* Amount Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              寄付金額を選択してください
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {donationAmounts.map((donation, index) => (
                <DonationCard
                  key={index}
                  amount={donation.amount}
                  label={donation.label}
                  description={donation.description}
                  isSelected={selectedAmount === donation.amount}
                  onClick={handleAmountSelect}
                  isCustom={donation.amount === 0}
                />
              ))}
            </div>

            {selectedAmount === 0 && (
              <div className="mt-4 text-gray-600">
                <input
                  type="number"
                  placeholder="金額を入力してください"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="100"
                />
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              支払い方法を選択してください
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {donationMethods.map((method) => (
                <PaymentMethodCard
                  key={method.id}
                  method={method}
                  isSelected={selectedMethod === method.id}
                  onClick={setSelectedMethod}
                />
              ))}
            </div>
          </div>

          {/* Donation Button */}
          <div className="text-center">
            <button
              onClick={handleDonate}
              disabled={!selectedAmount && !customAmount || !selectedMethod}
              className="bg-gradient-to-r from-blue-600 to-purple-700 text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disable  hover:cursor-disable"
            >
              {isMonthly ? '継続寄付を開始する' : '寄付する'}
            </button>
            <p className="text-sm text-gray-600 mt-4">
              SSL暗号化により安全に処理されます
            </p>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            支援者の声
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>

        {/* Trust & Transparency */}
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

        {/* Contact Information */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            寄付に関するお問い合わせ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">電話でのお問い合わせ</h4>
              <Link href="tel:0120123456" className="text-gray-600 mb-1 hover:text-blue-400 duration-300">0120-123-456</Link>
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

      {/* Modal Components */}
      <Modal
        isOpen={showSelectionRequiredModal}
        onClose={() => setShowSelectionRequiredModal(false)}
        title="選択が必要です"
        type="warning"
      >
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            寄付金額と支払い方法を選択してください。
          </p>
          <ModalButton
            onClick={() => setShowSelectionRequiredModal(false)}
            variant="primary"
          >
            了解しました
          </ModalButton>
        </div>
      </Modal>

      <Modal
        isOpen={showDonationConfirmModal}
        onClose={() => setShowDonationConfirmModal(false)}
        title="寄付の確認"
        type="info"
      >
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {donationDetails.amount}円の{isMonthly ? '毎月' : ''}寄付手続きを開始します。
          </p>
          <p className="text-gray-600 mb-6">
            支払い方法: {donationMethods.find(m => m.id === donationDetails.method)?.name}
          </p>
          <div className="flex gap-3 justify-center">
            <ModalButton
              onClick={() => setShowDonationConfirmModal(false)}
              variant="secondary"
            >
              キャンセル
            </ModalButton>
            <ModalButton
              onClick={() => {
                setShowDonationConfirmModal(false);
                // ここで実際の寄付処理を行う
                console.log('寄付処理を開始:', donationDetails);
              }}
              variant="primary"
            >
              寄付を確定
            </ModalButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DonationPage;