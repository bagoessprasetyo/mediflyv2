import { PublicHeader } from '@/components/public/layout/public-header';
import { PublicFooter } from '@/components/public/layout/public-footer';
import { LiveChatWidget } from '@/components/public/layout/live-chat-widget';
import { ScrollToTop } from '@/components/public/layout/scroll-to-top';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MediFly - World-Class Healthcare Anywhere',
  description: 'Access top medical specialists across Asia. Get expert diagnoses, second opinions, and personalized treatment plans. Connect with world-class healthcare from anywhere.',
  keywords: 'healthcare, medical tourism, specialists, doctors, treatment, hospitals, Asia, Singapore, Malaysia, Thailand, India',
  authors: [{ name: 'MediFly' }],
  creator: 'MediFly',
  publisher: 'MediFly',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://medifly.com',
    siteName: 'MediFly',
    title: 'MediFly - World-Class Healthcare Anywhere',
    description: 'Access top medical specialists across Asia. Get expert diagnoses, second opinions, and personalized treatment plans.',
    images: [
      {
        url: '/api/placeholder/1200/630',
        width: 1200,
        height: 630,
        alt: 'MediFly - Healthcare Platform'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MediFly - World-Class Healthcare Anywhere',
    description: 'Access top medical specialists across Asia. Get expert diagnoses, second opinions, and personalized treatment plans.',
    creator: '@medifly',
    images: ['/api/placeholder/1200/630']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code'
  }
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <PublicHeader />
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <PublicFooter />
      
      {/* Live Chat Widget */}
      <LiveChatWidget />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}