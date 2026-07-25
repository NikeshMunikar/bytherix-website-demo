import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

const siteUrl = 'https://bytherix.com'

export const viewport: Viewport = {
  themeColor: '#0A1628',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Bytherix — Build. Learn. Secure. Innovate.', template: '%s | Bytherix' },
  description: 'Bytherix is a premier tech education and digital solutions company. Master AI, Robotics, Ethical Hacking, Web & App Development.',
  keywords: ['Bytherix', 'tech education', 'coding courses', 'ethical hacking', 'web development', 'AI', 'robotics', 'cybersecurity'],
  authors: [{ name: 'Bytherix', url: siteUrl }],
  creator: 'Bytherix',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Bytherix',
    title: 'Bytherix — Build. Learn. Secure. Innovate.',
    description: 'Premier tech education and digital solutions.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Bytherix' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bytherix',
    description: 'Premier tech education and digital solutions.',
    images: ['/og-image.png'],
    creator: '@bytherix',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/icon-32.png', sizes: '32x32', type: 'image/png' }],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
  },
  manifest: '/manifest.json',
  alternates: { canonical: siteUrl },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script
  dangerouslySetInnerHTML={{
    __html: `
      (function() {
        try {
          var saved = localStorage.getItem('theme');
          var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          var isDark = saved ? saved === 'dark' : prefersDark;
          if (!isDark) document.documentElement.classList.add('light');
        } catch(e) {}
      })();
    `,
  }}
/>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Bytherix',
          url: siteUrl,
          logo: `${siteUrl}/logo.jpg`,
          description: 'Premier tech education and digital solutions company.',
          sameAs: ['https://twitter.com/bytherix', 'https://linkedin.com/company/bytherix', 'https://github.com/bytherix'],
        })}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Bytherix',
          url: siteUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/training?q={search_term_string}` },
            'query-input': 'required name=search_term_string',
          },
        })}} />
      </head>
      <body className="bg-bx-navy text-bx-white font-sans antialiased">
        <QueryProvider><AuthProvider>{children}</AuthProvider></QueryProvider>
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0D1A2E',
              border: '1px solid #1E2D4A',
              color: '#F8FAFF',
            },
          }}
        />
      </body>
    </html>
  )
}