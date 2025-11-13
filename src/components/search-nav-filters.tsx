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

export function SearchNavFilters({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    description?: string
    color?: string
  }[]
}) {
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Quick Filters</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.description || item.title}>
                  <Link href={item.url} className="flex items-center gap-2">
                    {item.icon && <item.icon className={`h-4 w-4 ${item.color || 'text-gray-600'}`} />}
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

export function SearchNavSpecialties({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    color?: string
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Medical Specialties</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={`Search ${item.title} specialists`}>
                  <Link href={item.url} className="flex items-center gap-2">
                    {item.icon && <item.icon className={`h-4 w-4 ${item.color || 'text-gray-600'}`} />}
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

export function SearchNavLocations({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    flag?: string
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Popular Locations</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={`Search healthcare in ${item.title}`}>
                  <Link href={item.url} className="flex items-center gap-2">
                    <span className="text-lg">{item.flag}</span>
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