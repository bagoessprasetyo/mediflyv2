"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconCirclePlusFilled, IconSearch, type Icon } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
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
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    description?: string
  }[]
}) {
  const pathname = usePathname()
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="New Search"
              className="bg-medifly-teal text-white hover:bg-medifly-teal/90 hover:text-white active:bg-medifly-teal/90 active:text-white min-w-8 duration-200 ease-linear"
              asChild
            >
              <Link href="/search">
                <IconCirclePlusFilled />
                <span>Talk with Aira</span>
              </Link>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
              asChild
            >
              <Link href="/search">
                <IconSearch />
                <span className="sr-only">Search</span>
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