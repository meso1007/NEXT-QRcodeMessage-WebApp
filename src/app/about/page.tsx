"use client";

import React, { useRef, useEffect, forwardRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NextImage from "next/image";
import Link from "next/link";

// Register the plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Imageprops {
  src: string,
  alt: string,
  width: number,
  height: number,
  className: string
}

const CustomImage = forwardRef<HTMLImageElement, Imageprops>(({ src, alt, width, height, className }, ref) => (
  <NextImage
    ref={ref}
    src={src.startsWith('/') ? src : `/${src}`}
    alt={alt}
    width={width}
    height={height}
    className={className}
  />
));

CustomImage.displayName = 'CustomImage';

const FiGithub = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const FiInstagram = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FiLinkedin = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);
const FiGlobe = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 0 20a15.3 15.3 0 0 1 0-20z"></path>
  </svg>
);

const AboutPage = () => {
  const containerRef = useRef(null);
  const serviceCardRef = useRef(null);
  const profileCardRef = useRef<HTMLDivElement>(null);
  const profileImageRef = useRef<HTMLImageElement>(null);
  const socialLinksRef = useRef<HTMLDivElement>(null!);
  const thanksRef = useRef<HTMLDivElement>(null!);
  const titleRef = useRef<HTMLDivElement>(null!);
  const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const profileTextRef = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup - hide elements
      gsap.set([serviceCardRef.current, profileCardRef.current, thanksRef.current], {
        opacity: 0,
        y: 100,
      });

      gsap.set(profileImageRef.current, {
        scale: 0,
        rotation: -180,
      });

      if (socialLinksRef.current) {
        gsap.set(socialLinksRef.current.children, {
          opacity: 0,
          y: 20,
          scale: 0.8,
        });
      }
      // Main entrance animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        }
      });

      // Service card animation
      tl.to(serviceCardRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      })
        .to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        }, "-=0.5")
        .to(paragraphsRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "power2.out",
        }, "-=0.4");

      // Profile card animation
      tl.to(profileCardRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      }, "-=0.6")
        .to(profileImageRef.current, {
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        }, "-=0.4")
        .to(profileTextRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
        }, "-=0.3")
        .to(socialLinksRef.current.children, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.7)",
        }, "-=0.2");

      // Thanks section
      tl.to(thanksRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.3");

      // Hover animations for cards
      [serviceCardRef.current, profileCardRef.current].forEach(card => {
        if (!card) return;
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.03,
            y: -10,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });

      // Social links hover animations
      if (socialLinksRef.current) {
        Array.from(socialLinksRef.current.children).forEach(link => {
          link.addEventListener('mouseenter', () => {
            gsap.to(link, {
              scale: 1.2,
              rotation: 360,
              duration: 0.4,
              ease: "power2.out",
            });
          });

          link.addEventListener('mouseleave', () => {
            gsap.to(link, {
              scale: 1,
              rotation: 0,
              duration: 0.4,
              ease: "power2.out",
            });
          });
        });
      }
      // Profile image continuous floating animation
      gsap.to(profileImageRef.current, {
        y: -10,
        duration: 2,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Parallax effect for background
      gsap.to(containerRef.current, {
        backgroundPosition: "50% 100px",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });

      // Text highlight animation on scroll
      paragraphsRef.current.forEach((paragraph) => {
        ScrollTrigger.create({
          trigger: paragraph,
          start: "top 70%",
          end: "bottom 30%",
          onEnter: () => {
            if (!paragraph) return;
            gsap.to(paragraph.querySelectorAll('strong, span'), {
              color: '#ec4899',
              scale: 1.05,
              duration: 0.3,
              stagger: 0.1,
            });
          },
          onLeave: () => {
            if (!paragraph) return;
            gsap.to(paragraph.querySelectorAll('strong, span'), {
              color: '',
              scale: 1,
              duration: 0.3,
            });
          },
          onEnterBack: () => {
            if (!paragraph) return;
            gsap.to(paragraph.querySelectorAll('strong, span'), {
              color: '#ec4899',
              scale: 1.05,
              duration: 0.3,
              stagger: 0.1,
            });
          },
          onLeaveBack: () => {
            if (!paragraph) return;
            gsap.to(paragraph.querySelectorAll('strong, span'), {
              color: '',
              scale: 1,
              duration: 0.3,
            });
          },
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      id="about"
      className="py-20 px-6 md:px-10 transition-all duration-1000 delay-300 bg-gradient-to-b from-white via-rose-50 to-white relative overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(218, 36, 8, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(196, 181, 253, 0.1) 0%, transparent 50%)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-1 gap-12 items-center">
          <div
            ref={serviceCardRef}
            className="bg-white/60 backdrop-blur-lg rounded-2xl p-10 shadow-xl relative"
          >
            <h2
              ref={titleRef}
              className="text-3xl font-extrabold text-gray-800 mb-6 tracking-tight opacity-0 transform translate-y-4"
            >
              運営方針とサービスについて
            </h2>

            {/* 段落1: 協会のミッションと社会インフラとしての位置付け */}
            <p
              ref={(el) => {
                paragraphsRef.current[0] = el;
              }}
              className="text-gray-700 leading-relaxed mb-5 text-base opacity-0 transform translate-y-4"
            >
              本サービスは<span className="text-indigo-500 font-semibold">未来メッセージ協会</span>が運営しています。
              私たちは、「万が一の時に備え、想いを遺す」ことを新たな社会インフラとして定着させるため、公益性を重視した活動を行っています。
            </p>

            {/* 段落2: ソリューション（QRコードによる永続化） */}
            <p
              ref={(el) => {
                paragraphsRef.current[1] = el;
              }} className="text-gray-700 leading-relaxed mb-5 text-base opacity-0 transform translate-y-4"
            >
              「もしも」は突然訪れます。本サービスでは、大切な人へのメッセージや生きた証を、<span className="text-indigo-500 font-semibold">QRコード</span>という物理的な形に変換し、永続的に保管可能にします。
              事前の準備が、ご自身とご遺族の未来の安心に繋がります。
            </p>

            {/* 段落3: 安全性と持続可能性（永久無料の根拠） */}
            <p
              ref={(el) => {
                paragraphsRef.current[2] = el;
              }} className="text-gray-700 leading-relaxed mb-5 text-base opacity-0 transform translate-y-4"
            >
              お客様のデータはサーバーに依存しない独自の仕組みで生成されるため、プライバシーは堅牢に守られます。
              また、維持コストのかからない設計により、<strong className="text-rose-500 font-semibold">永久無料</strong>での提供を実現しました。経済的な負担なく、安心してご利用いただけます。
            </p>

            {/* 段落4: 今後の展望とリンク */}
            <p
              ref={(el) => {
                paragraphsRef.current[3] = el;
              }} className="text-gray-700 leading-relaxed mb-5 text-base opacity-0 transform translate-y-4"
            >
              今後も自治体や関連機関と連携し、この「想いのバトン」を社会全体で支える仕組みへと育ててまいります。
              活動の詳細は<Link href="https://www.miraimessage.net/" className="text-indigo-500 font-semibold hover:underline" target="_blank" rel="noopener noreferrer">未来メッセージ協会 公式サイト</Link>をご覧ください。
            </p>

            {/* 段落5: 理念（タグライン） */}
            <p
              ref={(el) => {
                paragraphsRef.current[4] = el;
              }} className="text-gray-600 italic text-sm opacity-0 transform translate-y-4 mt-8"
            >
              「思いを言葉にできる場所」を、ひとりでも多くの方へ。
            </p>

          </div>


          {/* 自己紹介 */}
          <div
            ref={profileCardRef}
            className="bg-white/60 backdrop-blur-lg text-black rounded-2xl p-10 text-center shadow-xl relative"
            id="profile"
          >

            <div className="relative">
              <CustomImage
                ref={profileImageRef}
                src="images/profile.png"
                alt="プロフィール写真"
                width={200}
                height={200}
                className="w-40 h-40 mx-auto mb-5 rounded-full object-cover object-[center_10%] border-4 border-blue-200 shadow-sm"
              />
            </div>
            <h3
              ref={(el) => { profileTextRef.current[0] = el }}
              className="text-2xl font-bold text-gray-800 opacity-0 transform translate-y-4"
            >
              SHOYA
            </h3>
            {/* 変更点: ここに協会代表の肩書きを追加 */}
            <p
              ref={(el) => { profileTextRef.current[1] = el }}
              className="text-gray-600 text-sm mb-4 opacity-0 transform translate-y-4"
            >
              <span className="block mb-1 text-indigo-600 font-medium">未来メッセージ協会 代表</span>
              Web Developer / Designer
            </p>
            <p
              ref={(el) => { profileTextRef.current[2] = el }}
              className="text-gray-700 text-sm leading-relaxed mb-4 opacity-0 transform translate-y-4"
            >
              神奈川県藤沢市出身
              学生時代にVancouver, CanadaでWeb開発を学び、<span className="text-purple-500 font-semibold">心に残る体験</span>を届けるプロダクトを目指して活動中。<br />
              アイディアと技術のあいだで試行錯誤しながら、「人の心に寄り添う」サービスを追求しています。
            </p>
            <p
              ref={(el) => { profileTextRef.current[3] = el }}
              className="text-gray-700 text-sm leading-relaxed mb-4 opacity-0 transform translate-y-4"
            >
              このプロジェクトを通じて、<span className="text-rose-500 font-semibold">「誰かのために作る」ことの喜び</span>を再確認しています。
              多くの出会いや支えが、今の私を動かしています。
            </p>
            <p
              ref={(el) => { profileTextRef.current[4] = el }}
              className="text-gray-500 text-xs opacity-0 transform translate-y-4"
            >
              趣味はWebアプリ開発、イラスト制作、作曲、そして異国の文化を探訪することです。
            </p>
            <nav
              ref={socialLinksRef}
              className="text-black text-xl flex items-center justify-center mt-5 space-x-2"
            >
              <Link
                href="https://www.shoyahoriuchi.me/"
                className="hover:bg-rose-400 hover:text-gray-100 rounded-full p-2 duration-300 transform transition-all"
              >
                <FiGlobe />
              </Link>
              <Link
                href="https://github.com/meso1007"
                className="hover:bg-rose-400 hover:text-gray-100 rounded-full p-2 duration-300 transform transition-all"
              >
                <FiGithub />
              </Link>
              <Link
                href="https://www.instagram.com/sh02__nmi/"
                className="hover:bg-rose-400 hover:text-gray-100 rounded-full p-2 duration-300 transform transition-all"
              >
                <FiInstagram />
              </Link>
              <Link
                href="https://www.linkedin.com/in/shoya-horiuchi-83b785278/"
                className="hover:bg-rose-400 hover:text-gray-100 rounded-full p-2 duration-300 transform transition-all"
              >
                <FiLinkedin />
              </Link>
            </nav>
          </div>
        </div>

        <div
          ref={thanksRef}
          className="mt-16 text-center text-sm text-gray-500"
        >
          <p className="mb-2">
            Special thanks to everyone who believed in this idea and supported me — your encouragement means the world.
          </p>
          <p className="italic text-gray-400">
            一緒に形にしてくれる仲間たちへ、心から感謝しています。
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;