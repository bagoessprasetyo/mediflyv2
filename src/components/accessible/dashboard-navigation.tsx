'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconKeyboard, IconSearch, IconSettings, IconChartBar, IconCurrencyDollar } from '@tabler/icons-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
  category: string;
}

export function DashboardNavigation() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'Ctrl+K',
      description: 'Open command palette',
      action: () => setSearchMode(true),
      category: 'Navigation'
    },
    {
      key: 'Ctrl+/',
      description: 'Show keyboard shortcuts',
      action: () => setShowShortcuts(true),
      category: 'Help'
    },
    {
      key: 'G then D',
      description: 'Go to Dashboard',
      action: () => router.push('/cms/dashboard'),
      category: 'Navigation'
    },
    {
      key: 'G then U',
      description: 'Go to Usage Analytics',
      action: () => router.push('/cms/usage'),
      category: 'Navigation'
    },
    {
      key: 'G then F',
      description: 'Go to Facilities',
      action: () => router.push('/cms/facilities'),
      category: 'Navigation'
    },
    {
      key: 'G then T',
      description: 'Go to Treatments',
      action: () => router.push('/cms/treatments'),
      category: 'Navigation'
    },
    {
      key: 'R',
      description: 'Refresh current page',
      action: () => window.location.reload(),
      category: 'Actions'
    },
    {
      key: 'Esc',
      description: 'Close dialogs/modals',
      action: () => {
        setShowShortcuts(false);
        setSearchMode(false);
      },
      category: 'Actions'
    }
  ];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts if user is typing in an input
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    const isCtrl = event.ctrlKey || event.metaKey;

    // Ctrl+K - Command palette
    if (isCtrl && event.key === 'k') {
      event.preventDefault();
      setSearchMode(true);
      return;
    }

    // Ctrl+/ - Show shortcuts
    if (isCtrl && event.key === '/') {
      event.preventDefault();
      setShowShortcuts(true);
      return;
    }

    // Escape - Close dialogs
    if (event.key === 'Escape') {
      setShowShortcuts(false);
      setSearchMode(false);
      return;
    }

    // 'G' then navigation keys
    if (event.key === 'g') {
      // Set up listener for the next key
      const handleNextKey = (nextEvent: KeyboardEvent) => {
        switch (nextEvent.key) {
          case 'd':
            router.push('/cms/dashboard');
            break;
          case 'u':
            router.push('/cms/usage');
            break;
          case 'f':
            router.push('/cms/facilities');
            break;
          case 't':
            router.push('/cms/treatments');
            break;
        }
        window.removeEventListener('keydown', handleNextKey);
      };
      
      window.addEventListener('keydown', handleNextKey);
      // Clean up after 2 seconds
      setTimeout(() => {
        window.removeEventListener('keydown', handleNextKey);
      }, 2000);
      return;
    }

    // 'R' - Refresh
    if (event.key === 'r') {
      event.preventDefault();
      window.location.reload();
      return;
    }
  }, [router]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (searchMode && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchMode]);

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  return (
    <>
      {/* Keyboard shortcuts help button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowShortcuts(true)}
        className="fixed bottom-4 right-4 z-50"
        aria-label="Show keyboard shortcuts (Ctrl+/)"
      >
        <IconKeyboard className="h-4 w-4" />
      </Button>

      {/* Keyboard shortcuts dialog */}
      <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconKeyboard className="h-5 w-5" />
              Keyboard Shortcuts
            </DialogTitle>
            <DialogDescription>
              Use these shortcuts to navigate faster
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6">
            {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
              <div key={category}>
                <h3 className="font-medium text-sm text-muted-foreground mb-3">{category}</h3>
                <div className="space-y-2">
                  {categoryShortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{shortcut.description}</span>
                      <Badge variant="outline" className="font-mono text-xs">
                        {shortcut.key}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Command palette dialog */}
      <Dialog open={searchMode} onOpenChange={setSearchMode}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconSearch className="h-5 w-5" />
              Quick Navigation
            </DialogTitle>
            <DialogDescription>
              Search for pages and actions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Type to search..."
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
              aria-label="Search navigation"
            />

            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  router.push('/cms/dashboard');
                  setSearchMode(false);
                }}
              >
                <IconChartBar className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  router.push('/cms/usage');
                  setSearchMode(false);
                }}
              >
                <IconCurrencyDollar className="h-4 w-4 mr-2" />
                Usage Analytics
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  router.push('/cms/facilities');
                  setSearchMode(false);
                }}
              >
                <IconSettings className="h-4 w-4 mr-2" />
                Facilities
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}