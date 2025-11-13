'use client'

import * as React from 'react'
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconBuilding,
  IconCurrencyDollar,
  IconStethoscope,
  IconBulb,
} from '@tabler/icons-react'

import { NavDocuments } from '@/components/nav-documents'
import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUserClient } from '@/components/nav-user-client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useUser } from '@/contexts/user-context'

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/cms/dashboard',
      icon: IconDashboard,
    },
    {
      title: 'Hospitals',
      url: '/cms/hospitals',
      icon: IconBuilding,
    },
    {
      title: 'Facilities',
      url: '/cms/facilities',
      icon: IconDatabase,
    },
    {
      title: 'Doctors',
      url: '/cms/doctors',
      icon: IconUsers,
    },
    {
      title: 'Treatments',
      url: '/cms/treatments',
      icon: IconReport,
    },
    {
      title: "Specialties",
      url: "/cms/specialties",
      icon: IconStethoscope,
    },
    {
      title: "Inspired Content",
      url: "/cms/inspired-content",
      icon: IconBulb,
    },
    {
      title: "Token Usage",
      url: "/cms/usage",
      icon: IconCurrencyDollar,
      items: [
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
      ],
    },
    {
      title: 'Analytics',
      url: '#',
      icon: IconChartBar,
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: IconSettings,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: IconHelp,
    },
    {
      title: 'Search',
      url: '#',
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: 'Data Library',
      url: '#',
      icon: IconDatabase,
    },
    {
      name: 'Reports',
      url: '#',
      icon: IconReport,
    },
    {
      name: 'Word Assistant',
      url: '#',
      icon: IconFileWord,
    },
  ],
}

export function AppSidebarClient({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()
  
  if (!user) {
    return null
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/cms/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">MediFly</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUserClient user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}