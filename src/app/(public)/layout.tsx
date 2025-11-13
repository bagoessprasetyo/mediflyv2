'use client';

import { PublicHeader } from '@/components/public/layout/public-header';
import { PublicFooter } from '@/components/public/layout/public-footer';
import { LiveChatWidget } from '@/components/public/layout/live-chat-widget';
import { ScrollToTop } from '@/components/public/layout/scroll-to-top';
import { FloatingAiAssistant } from '@/components/ui/glowing-ai-chat-assistant';
import { usePathname } from 'next/navigation';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSearchPage = pathname.startsWith('/search');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Hidden on search pages */}
      {!isSearchPage && <PublicHeader />}
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer - Hidden on search pages */}
      {!isSearchPage && <PublicFooter />}
      
      {/* Live Chat Widget - Only show on non-search pages since search has sidebar */}
      {!isSearchPage && <FloatingAiAssistant />}
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}