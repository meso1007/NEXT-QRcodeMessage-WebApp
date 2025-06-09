"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Heart, Users, Target, TrendingUp, Shield, Gift, CreditCard, Building, Calendar, CheckCircle, Star, Award, Globe, Zap, DollarSign } from 'lucide-react';

// GSAPライブラリの代替実装
const gsap = {
  fromTo: (element, from, to) => {
    if (!element || !element.style) return;
    
    // 初期状態を設定
    Object.keys(from).forEach(key => {
      if (key === 'y') {
        element.style.transform = `translateY(${from[key]}px)`;
      } else if (key === 'opacity') {
        element.style.opacity = from[key];
      } else if (key === 'scale') {
        element.style.transform = `scale(${from[key]})`;
      } else if (key === 'x') {
        element.style.transform = `translateX(${from[key]}px)`;
      }
    });
    
    element.style.transition = `all ${to.duration || 1}s ease-out`;
    
    setTimeout(() => {
      Object.keys(to).forEach(key => {
        if (key !== 'duration' && key !== 'delay') {
          if (key === 'y') {
            element.style.transform = `translateY(${to[key]}px)`;
          } else if (key === 'opacity') {
            element.style.opacity = to[key];
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

const donationAmounts = [
  { amount: 1000, label: '1,000円', description: '1人の子どもの1日分の食事' },
  { amount: 3000, label: '3,000円', description: '教育用品の購入費用' },
  { amount: 5000, label: '5,000円', description: '1週間の医療支援' },
  { amount: 10000, label: '10,000円', description: '1ヶ月の学習支援' },
  { amount: 30000, label: '30,000円', description: '3ヶ月の生活支援' },
  { amount: 0, label: 'その他の金額', description: 'ご希望の金額を入力' }
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
  { number: '12,450', label: '支援した子どもの数', icon: <Users className="w-8 h-8" /> },
  { number: '¥85,000,000', label: '累計寄付金額', icon: <DollarSign className="w-8 h-8" /> },
  { number: '156', label: '支援地域数', icon: <Globe className="w-8 h-8" /> },
  { number: '98%', label: '直接支援への活用率', icon: <Target className="w-8 h-8" /> }
];

const testimonials = [
  {
    name: '田中 美咲さん',
    role: '継続寄付者（2年）',
    comment: '毎月の小額寄付でも、確実に子どもたちの役に立っていることを実感できます。活動報告書を見るのが楽しみです。',
    avatar: '👩‍💼'
  },
  {
    name: '佐藤 健太郎さん',
    role: '企業寄付担当者',
    comment: '透明性の高い活動報告と、効率的な資金活用に感銘を受けました。社員一同で継続支援しています。',
    avatar: '👨‍💼'
  },
  {
    name: '山田 花子さん',
    role: '個人寄付者',
    comment: '自分の寄付がどのように使われているかが明確で、安心して支援を続けられます。',
    avatar: '👩‍🦳'
  }
];

const DonationCard = ({ amount, label, description, isSelected, onClick, isCustom = false }) => {
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
      className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
        isSelected
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
          {isCustom ? <DollarSign className="w-8 h-8 mx-auto text-blue-500" /> : label}
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

const PaymentMethodCard = ({ method, isSelected, onClick }) => {
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
      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'border-green-500 bg-green-50 shadow-lg'
          : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-full ${
          isSelected ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
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

const StatCard = ({ stat, index }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, delay: index * 0.1 }
      );
    }
  }, [index]);

  return (
    <div ref={cardRef} className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-full p-4 inline-flex mb-4">
        {React.cloneElement(stat.icon, { className: "text-white w-8 h-8" })}
      </div>
      <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
      <div className="text-gray-600">{stat.label}</div>
    </div>
  );
};

const TestimonialCard = ({ testimonial, index }) => {
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
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isMonthly, setIsMonthly] = useState(false);

  useEffect(() => {
    // ヘッダーアニメーション
    if (headerRef.current) {
      const iconEl = headerRef.current.querySelector('.header-icon');
      const titleEl = headerRef.current.querySelector('h1');
      const descEl = headerRef.current.querySelector('p');
      
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
    }
  }, []);

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    if (amount !== 0) {
      setCustomAmount('');
    }
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(0);
  };

  const handleDonate = () => {
    const amount = selectedAmount === 0 ? customAmount : selectedAmount;
    if (!amount || !selectedMethod) {
      alert('寄付金額と支払い方法を選択してください。');
      return;
    }
    
    alert(`${amount}円の${isMonthly ? '毎月' : ''}寄付手続きを開始します。\n支払い方法: ${donationMethods.find(m => m.id === selectedMethod)?.name}`);
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
            あなたの温かい気持ちが、世界中の子どもたちに希望の光を届けます。
            透明性のある活動で、確実に支援を届けることをお約束いたします。
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {impactStats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
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
                className={`px-6 py-2 rounded-full transition-all ${
                  !isMonthly ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600'
                }`}
              >
                単発寄付
              </button>
              <button
                onClick={() => setIsMonthly(true)}
                className={`px-6 py-2 rounded-full transition-all ${
                  isMonthly ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600'
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
              <div className="mt-4">
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
              className="bg-gradient-to-r from-blue-600 to-purple-700 text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
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
            <h2 className="text-3xl font-bold mb-4">透明性への取り組み</h2>
            <p className="text-blue-100 max-w-3xl mx-auto">
              すべての寄付金の使途を明確に報告し、支援者の皆様に信頼していただける
              活動を心がけています。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">詳細な活動報告</h3>
              <p className="text-sm text-blue-100">
                四半期ごとに詳細な活動報告書を公開
              </p>
            </div>
            <div className="text-center">
              <Award className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">第三者監査</h3>
              <p className="text-sm text-blue-100">
                独立した監査法人による定期的な監査を実施
              </p>
            </div>
            <div className="text-center">
              <Zap className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">リアルタイム報告</h3>
              <p className="text-sm text-blue-100">
                支援の様子をリアルタイムで写真・動画で共有
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
              <p className="text-gray-600 mb-1">0120-123-456</p>
              <p className="text-sm text-gray-500">平日 9:00-18:00（土日祝除く）</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">メールでのお問い合わせ</h4>
              <p className="text-gray-600 mb-1">donate@example.org</p>
              <p className="text-sm text-gray-500">24時間受付（48時間以内に返信）</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;