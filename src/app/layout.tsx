import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | HỆ THỐNG GIÁM KHẢO - Chấm Điểm Điện Tử',
    default: 'HỆ THỐNG GIÁM KHẢO - Chấm Điểm Điện Tử | Hệ Sinh Thái TINGNECT',
  },
  description: 'Hệ thống chấm điểm điện tử chuyên nghiệp dành cho Ban Giám Khảo. Chấm điểm real-time, bảo mật tuyệt đối, thống kê chi tiết. Được phát triển bởi TingNect và TrustLabs với công nghệ hiện đại.',
  keywords: [
    'hệ thống giám khảo',
    'chấm điểm điện tử', 
    'BGK system',
    'electronic scoring',
    'judge system',
    'real-time scoring',
    'TingNect',
    'TrustLabs',
    'cuộc thi chấm điểm',
    'hệ thống chấm thi',
    'scoring platform',
    'contest management',
    'digital judging',
    'automated scoring'
  ],
  authors: [
    { name: 'TingNect Ecosystem', url: 'https://tingnect.com' },
    // { name: 'TrustLabs Technology', url: 'https://trustlabs.vn' }
  ],
  creator: 'TingNect x TrustLabs Partnership',
  publisher: 'TingNect Ecosystem Technology',
  icons: {
    icon: '/PreviewSeo/tingnecticon.png',
    shortcut: '/PreviewSeo/tingnecticon.png',
    apple: '/PreviewSeo/tingnecticon.png',
  },
  openGraph: {
    type: 'website',
    title: 'HỆ THỐNG GIÁM KHẢO - Chấm Điểm Điện Tử | Hệ Sinh Thái TINGNECT',
    description: 'Hệ thống chấm điểm điện tử chuyên nghiệp với công nghệ real-time, bảo mật cao và thống kê chi tiết. Phát triển bởi TingNect x TrustLabs.',
    url: 'https://bgk.tingnect.com',
    images: [
      {
        url: 'https://bgk.tingnect.com/PreviewSeo/social-preview-1200x630.png',
        width: 1200,
        height: 630,
        alt: 'HỆ THỐNG GIÁM KHẢO - Chấm Điểm Điện Tử | TingNect Ecosystem',
        type: 'image/png',
      },
      {
        url: 'https://bgk.tingnect.com/PreviewSeo/tingnecticon.png',
        width: 512,
        height: 512,
        alt: 'TingNect Logo - Hệ Sinh Thái Công Nghệ',
        type: 'image/png',
      }
    ],
    locale: 'vi_VN',
    siteName: 'HỆ THỐNG GIÁM KHẢO - TingNect Ecosystem',
    countryName: 'Vietnam',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@tingnect',
    creator: '@tingnect',
    title: 'HỆ THỐNG GIÁM KHẢO - Chấm Điểm Điện Tử',
    description: 'Hệ thống chấm điểm điện tử chuyên nghiệp với real-time scoring, bảo mật tuyệt đối. Powered by TingNect x TrustLabs.',
    images: [
      {
        url: 'https://bgk.tingnect.com/PreviewSeo/social-preview-1200x600.png',
        alt: 'HỆ THỐNG GIÁM KHẢO - Chấm Điểm Điện Tử | TingNect Ecosystem',
      }
    ],
  },
  alternates: {
    canonical: 'https://bgk.tingnect.com',
    languages: {
      'vi-VN': 'https://bgk.tingnect.com',
      'en-US': 'https://bgk.tingnect.com/en',
    },
  },

  robots: {
    index: false, // Không index cho hệ thống nội bộ
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    nocache: true,
  },
  category: 'technology',
  classification: 'Business Software',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://bgk.tingnect.com'),
  applicationName: 'HỆ THỐNG GIÁM KHẢO - BGK System',
  generator: 'Next.js 15+ TingNect Technology Stack',
  abstract: 'Hệ thống chấm điểm điện tử chuyên nghiệp cho Ban Giám Khảo với công nghệ real-time và bảo mật cao.',
  archives: [],
  assets: [],
  bookmarks: [],
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'format-detection': 'telephone=no',
    'msapplication-TileColor': '#00d4ff',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#00d4ff',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#00d4ff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'HỆ THỐNG GIÁM KHẢO - BGK System',
    description: 'Hệ thống chấm điểm điện tử chuyên nghiệp dành cho Ban Giám Khảo với công nghệ real-time và bảo mật cao',
    url: 'https://bgk.tingnect.com',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'VND',
    },
    author: {
      '@type': 'Organization',
      name: 'TingNect Ecosystem',
      url: 'https://tingnect.com',
    },
    provider: {
      '@type': 'Organization',
      name: 'TrustLabs Technology',
      email: 'contact@trustlab.app',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      ratingCount: '1',
    },
  };

  return (
    <html lang="vi">
      <head>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* DNS Prefetch & Preconnect for Performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* PWA & Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BGK System" />
        
        {/* Language & Region */}
        <meta httpEquiv="content-language" content="vi" />
        <meta name="language" content="Vietnamese" />
        <meta name="geo.region" content="VN" />
        <meta name="geo.placename" content="Vietnam" />
        
        {/* Favicon Override - Force TingNect Logo */}
        <link rel="icon" href="/PreviewSeo/tingnecticon.png?v=20251209" type="image/png" />
        <link rel="shortcut icon" href="/PreviewSeo/tingnecticon.png?v=20251209" type="image/png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/PreviewSeo/tingnecticon.png?v=20251209" />
        <link rel="icon" type="image/png" sizes="32x32" href="/PreviewSeo/tingnecticon.png?v=20251209" />
        <link rel="apple-touch-icon" sizes="180x180" href="/PreviewSeo/tingnecticon.png?v=20251209" />
        <link rel="mask-icon" href="/PreviewSeo/tingnecticon.png" color="#00d4ff" />
        
        {/* Social Media Preview Optimization */}
        <meta property="og:image:secure_url" content="https://bgk.tingnect.com/PreviewSeo/social-preview-1200x630.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image:src" content="https://bgk.tingnect.com/PreviewSeo/social-preview-1200x600.png" />
        
        {/* Zalo Specific Meta Tags */}
        <meta property="zalo:image" content="https://bgk.tingnect.com/PreviewSeo/social-preview-1200x630.png" />
        <meta property="zalo:title" content="HỆ THỐNG GIÁM KHẢO - Chấm Điểm Điện Tử | TingNect" />
        <meta property="zalo:description" content="Hệ thống chấm điểm điện tử chuyên nghiệp với công nghệ real-time, bảo mật cao. Phát triển bởi TingNect x TrustLabs." />
        
        {/* Additional Social Optimization */}
        <meta name="image" content="https://bgk.tingnect.com/PreviewSeo/social-preview-1200x630.png" />
        <meta name="thumbnail" content="https://bgk.tingnect.com/PreviewSeo/tingnecticon.png" />
        <link rel="image_src" href="https://bgk.tingnect.com/PreviewSeo/social-preview-1200x630.png" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
