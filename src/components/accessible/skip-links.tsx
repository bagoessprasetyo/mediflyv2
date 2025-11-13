'use client';

import { Button } from '@/components/ui/button';

export function SkipLinks() {
  const skipToContent = () => {
    const main = document.querySelector('main') || document.querySelector('[role="main"]');
    if (main) {
      (main as HTMLElement).focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const skipToNavigation = () => {
    const nav = document.querySelector('nav') || document.querySelector('[role="navigation"]');
    if (nav) {
      (nav as HTMLElement).focus();
      nav.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sr-only focus-within:not-sr-only fixed top-4 left-4 z-[9999] space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={skipToContent}
        className="focus:not-sr-only"
      >
        Skip to main content
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={skipToNavigation}
        className="focus:not-sr-only"
      >
        Skip to navigation
      </Button>
    </div>
  );
}