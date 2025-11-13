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
import { Badge } from "@/components/ui/badge"

export function SearchNavHistory({
  items,
}: {
  items: {
    query?: string
    location?: string
    timestamp?: string
    icon?: Icon
    url: string
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Recent Searches</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, index) => {
            const displayText = item.query ? 
              `${item.query.substring(0, 30)}${item.query.length > 30 ? '...' : ''}` : 
              'Recent search'
            
            return (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild tooltip={`${item.query} in ${item.location}`}>
                  <Link href={item.url} className="flex flex-col gap-1 py-2">
                    <div className="flex items-center gap-2">
                      {item.icon && <item.icon className="h-3 w-3 text-gray-500" />}
                      <span className="text-xs font-medium truncate">{displayText}</span>
                    </div>
                    <div className="flex items-center gap-2 ml-5">
                      <Badge variant="outline" className="text-xs h-4">
                        {item.location}
                      </Badge>
                      <span className="text-xs text-gray-500">{item.timestamp}</span>
                    </div>
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

export function SearchNavSaved({
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
    <SidebarGroup>
      <SidebarGroupLabel>Saved & Favorites</SidebarGroupLabel>
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