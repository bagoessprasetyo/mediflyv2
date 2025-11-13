"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconChevronRight, IconCurrencyDollar } from "@tabler/icons-react"
import { useState } from 'react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

interface UsageNavItem {
  title: string
  url: string
}

interface UsageNavProps {
  items: UsageNavItem[]
}

const usageNavItems = [
  {
    title: "Overview",
    url: "/cms/usage",
  },
  {
    title: "Usage History",
    url: "/cms/usage/history",
  },
  {
    title: "Budget Settings",
    url: "/cms/usage/budgets",
  },
]

export function NavUsage() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(pathname.startsWith('/cms/usage'))

  const isUsageActive = pathname.startsWith('/cms/usage')

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Usage Analytics</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                tooltip="Token Usage"
                className={isUsageActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
              >
                <IconCurrencyDollar />
                <span>Token Usage</span>
                <IconChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {usageNavItems.map((item) => {
                  const isActive = pathname === item.url
                  
                  return (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton 
                        asChild
                        isActive={isActive}
                      >
                        <Link href={item.url}>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  )
}