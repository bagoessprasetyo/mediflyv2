'use client'

import React, { useState, createContext, useContext } from 'react'
import { SearchSidebar } from '@/components/search-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AIAssistantInterface } from '@/components/ui/ai-assistant-interface'

// Create context for AI panel state
const AIContext = createContext<{
  isAIOpen: boolean
  toggleAI: () => void
  searchContext?: any
  setSearchContext: (context: any) => void
}>({
  isAIOpen: false,
  toggleAI: () => {},
  setSearchContext: () => {}
})

export const useAI = () => useContext(AIContext)

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [searchContext, setSearchContext] = useState<any>(null)

  const toggleAI = () => {
    setIsAIOpen(!isAIOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AIContext.Provider value={{ 
        isAIOpen, 
        toggleAI, 
        searchContext, 
        setSearchContext 
      }}>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 64)",
              "--sidebar-width-icon": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <SearchSidebar onAIToggle={toggleAI} />
          <SidebarInset className="flex flex-col">
            <div className="flex-1 overflow-hidden">
              {isAIOpen ? (
                <AIAssistantInterface
                  isOpen={isAIOpen}
                  onClose={() => setIsAIOpen(false)}
                  searchContext={searchContext}
                />
              ) : (
                children
              )}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </AIContext.Provider>
    </div>
  )
}