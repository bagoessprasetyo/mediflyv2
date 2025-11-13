import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold">MediFly Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome to the admin control panel</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold">Total Users</h3>
                <p className="text-2xl font-bold text-blue-600">1,234</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold">Active Patients</h3>
                <p className="text-2xl font-bold text-green-600">856</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold">Appointments Today</h3>
                <p className="text-2xl font-bold text-purple-600">42</p>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">• New patient registration - John Doe</p>
                <p className="text-sm text-muted-foreground">• Appointment scheduled - Dr. Smith</p>
                <p className="text-sm text-muted-foreground">• Lab results uploaded - Patient #123</p>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}