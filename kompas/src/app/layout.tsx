import type { Metadata, Viewport } from 'next'
import { Literata, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider';
import { PostHogProvider } from '@/components/providers/PostHogProvider';
import { PWAInstallerBanner } from '@/components/pwa/PWAInstallerBanner';
import { SingleSessionModal } from '@/components/auth/SingleSessionModal';

const serifFont = Literata({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  style: ['normal', 'italic'],
})

const sansFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
})

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kompas-cesi.fr';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0B' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Kompas | La plateforme d\'excellence pour élèves-ingénieurs CESI',
    template: '%s | Kompas CESI',
  },
  description: 'La plateforme collaborative d\'entraide, d\'annales CCTL, d\'aide aux Prosits, de génération de livrables et de tuteur IA pour les 18 000 étudiants du CESI.',
  keywords: [
    'CESI',
    'Kompas',
    'CCTL',
    'Annales CESI',
    'Prosits CESI',
    'Livrables CESI',
    'École d\'ingénieurs CESI',
    'A1',
    'A2',
    'A3',
    'A4',
    'A5',
    'FISA',
    'FISE',
    'Tuteur IA ingénieur',
    'Entraide étudiante CESI'
  ],
  authors: [{ name: 'Kompas Engineering Team' }],
  creator: 'Kompas',
  publisher: 'Kompas',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Kompas | La plateforme d\'excellence pour élèves-ingénieurs CESI',
    description: 'Accédez à toutes les annales CCTL corrigées, simulateur d\'examens, assistant de Prosits et tuteur IA 24/7 pour réussir vos années au CESI.',
    url: siteUrl,
    siteName: 'Kompas CESI',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/img/logo-dark.png',
        width: 512,
        height: 512,
        alt: 'Kompas CESI Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kompas | La plateforme d\'excellence pour élèves-ingénieurs CESI',
    description: 'Accédez aux annales CCTL, assistant Prosits et tuteur IA pour les élèves-ingénieurs du CESI.',
    images: ['/img/logo-dark.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/img/favicon.png',
    shortcut: '/img/favicon.png',
    apple: '/img/favicon.png',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kompas CESI',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
  },
  description: 'Plateforme d\'entraide, de révision d\'annales CCTL, d\'aide aux Prosits et de tuteur IA pour les élèves-ingénieurs du CESI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="fr"
      className={`${serifFont.variable} ${sansFont.variable} ${monoFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${sansFont.className} antialiased bg-background text-text-primary selection:bg-amber-300 selection:text-black min-h-screen`}>
        <PostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <PWAInstallerBanner />
            <SingleSessionModal />
            {children}
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}
