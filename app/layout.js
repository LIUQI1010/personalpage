import './globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata = {
  metadataBase: new URL('https://qiliu.dev'),
  title: 'Qi Liu - Portfolio',
  description: "Qi Liu's portfolio - AWS-Certified Solutions Architect & Full-Stack Developer",
  authors: [{ name: 'Qi Liu' }],
  keywords: [
    'Qi Liu',
    'portfolio',
    'AWS',
    'solutions architect',
    'full-stack developer',
    'Wellington',
    'New Zealand',
  ],
  openGraph: {
    type: 'website',
    title: 'Qi Liu - Portfolio',
    description:
      'AWS-Certified Solutions Architect & Full-Stack Developer. Computer Science graduate student at VUW.',
    images: ['/og-image.svg'],
    siteName: 'Qi Liu Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Qi Liu - Portfolio',
    description: 'AWS-Certified Solutions Architect & Full-Stack Developer',
    images: ['/og-image.svg'],
  },
  other: {
    'theme-color': '#1a1a2e',
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }, { url: '/favicon.ico' }],
    apple: '/favicon.svg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#1a1a2e',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        {/* SSR 遮罩：防止开屏动画加载前看到主页内容，由 LoadingAnimation 客户端接管后移除 */}
        <div
          id='ssr-loading-overlay'
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'oklch(0.13 0.03 261.7)',
            pointerEvents: 'none',
          }}
        />
        {/* 如果动画已播放过或非首页，立即移除遮罩；否则等 LoadingAnimation 接管 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem('loading-played')||location.pathname!=='/'){var e=document.getElementById('ssr-loading-overlay');if(e)e.remove()}}catch(e){}`,
          }}
        />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
