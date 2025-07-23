import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from 'next/script';
import { GA_TRACKING_ID } from '@/lib/analytics';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://otodokelife.com/'),
  title: "OTODOKE LIFE - 大切な人への想いを残す場所",
  description: "大切な人への想いやメッセージを、安全で意味のある形で残すためのプラットフォームです。QRコードを通じて、あなたの想いを未来へ届けます。",
  keywords: "メッセージ, QRコード, 想い, メモリー, デジタルレター, 大切な人へのメッセージ 電子手紙 電子遺書 手紙",
  authors: [{ name: "Shoya Horiuchi" }],
  creator: "Shoya Horiuchi",
  publisher: "OTODOKE LIFE",
  robots: "index, follow",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#5bbad5'
      }
    ]
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://99.79.63.2",
    siteName: "OTODOKE LIFE",
    title: "OTODOKE LIFE - 大切な人への想いを残す場所",
    description: "大切な人への想いやメッセージを、安全で意味のある形で残すためのプラットフォームです。",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "OTODOKE LIFE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OTODOKE LIFE - 大切な人への想いを残す場所",
    description: "大切な人への想いやメッセージを、安全で意味のある形で残すためのプラットフォームです。",
    images: ["/images/og-image.png"],
  },
  verification: {
    google: "your-google-site-verification", // Google Search Consoleの検証コード
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          // src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          src={`https://www.googletagmanager.com/gtag/js?id=G-R6DS0MJ3M4`}

        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}');
            `,
          }}
        />
        
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
