import * as React from "react"
import { AppSidebarClient } from "@/components/app-sidebar-client"
import { getUser } from "@/lib/auth/actions"
import {
  Sidebar,
} from "@/components/ui/sidebar"

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = await getUser()
  
  return <AppSidebarClient user={user} {...props} />
}
