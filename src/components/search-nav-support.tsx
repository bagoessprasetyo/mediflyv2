"use client"

import Link from 'next/link'
import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function SearchNavSupport({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    description?: string
  }[]
}) {
  return (
    <SidebarGroup className="mt-auto">
      <SidebarGroupLabel>Help & Support</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.description || item.title}>
                  <Link href={item.url} className="flex items-center gap-2">
                    {item.icon && <item.icon className="h-4 w-4 text-gray-600" />}
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