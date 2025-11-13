"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconCurrencyDollar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconHistory,
  IconInnerShadowTop,
  IconListDetails,
  IconBuilding,
  IconReport,
  IconSearch,
  IconSettings,
  IconTarget,
  IconUsers,
  IconStethoscope,
  IconBulb,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUsage } from "@/components/nav-usage"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { getUser } from "@/lib/auth/actions"
import type { AuthUser } from "@/types/auth"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Facilities",
      url: "/cms/facilities",
      icon: IconBuilding,
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: IconListDetails,
    },
    {
      title: "Treatments",
      url: "/cms/treatments",
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
      title: "Projects",
      url: "#",
      icon: IconFolder,
    },
    {
      title: "Team",
      url: "#",
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "Token Usage",
      icon: IconCurrencyDollar,
      isActive: true,
      url: "/cms/usage",
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
      title: "Capture",
      icon: IconCamera,
      isActive: false,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = await getUser()
  
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
        <NavUsage />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
