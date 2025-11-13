"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconSearch, type Icon } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { AnimatedTalkButton } from "@/components/ui/button-8"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function SearchNavMain({
  items,
  onAIToggle,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    description?: string
  }[]
  onAIToggle?: () => void
}) {
  const pathname = usePathname()
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-col gap-2">
            <AnimatedTalkButton onClick={() => onAIToggle?.()}>
              Talk with Aira
            </AnimatedTalkButton>
            <Button
              size="sm"
              className="group-data-[collapsible=icon]:opacity-0"
              variant="outline"
              asChild
            >
              <Link href="/search" className="flex items-center gap-2">
                <IconSearch className="h-4 w-4" />
                <span>New Search</span>
              </Link>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url || (item.url !== '#' && pathname.startsWith(item.url.split('?')[0]))
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.description || item.title} isActive={isActive}>
                  <Link href={item.url} className="flex items-center gap-2">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}