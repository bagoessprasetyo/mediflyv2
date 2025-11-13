"use client"

import * as React from "react"
import { IconStethoscope } from "@tabler/icons-react"

import { SearchNavMain } from "@/components/search-nav-main"
import { SearchNavFilters, SearchNavSpecialties, SearchNavLocations } from "@/components/search-nav-filters"
import { SearchNavHistory, SearchNavSaved } from "@/components/search-nav-history"
import { SearchNavSupport } from "@/components/search-nav-support"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { searchNavigationData } from "@/lib/search-navigation"

export function SearchSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
              size="lg"
            >
              <a href="/">
                <div className="w-8 h-8 bg-medifly-teal rounded-lg flex items-center justify-center">
                  <IconStethoscope className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-semibold">MediFly Search</span>
                  <span className="text-xs text-gray-500">Find Healthcare</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <SearchNavMain items={searchNavigationData.quickActions} />
        <SearchNavFilters items={searchNavigationData.filterPresets} />
        <SearchNavSpecialties items={searchNavigationData.specialtyCategories} />
        <SearchNavLocations items={searchNavigationData.locationPresets} />
        <SearchNavHistory items={searchNavigationData.recentSearches} />
        <SearchNavSaved items={searchNavigationData.savedAndHistory} />
        <SearchNavSupport items={searchNavigationData.helpAndSupport} />
      </SidebarContent>
    </Sidebar>
  )
}