import React from 'react'
import { SearchSidebar } from '@/components/search-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 64)",
            "--sidebar-width-icon": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <SearchSidebar />
        <SidebarInset className="flex flex-col">
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}