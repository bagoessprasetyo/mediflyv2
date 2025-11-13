import { requireAdmin } from '@/lib/auth/actions'
import { UserProvider } from '@/contexts/user-context'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This will redirect to login if not authenticated
  // or to unauthorized if not admin
  const user = await requireAdmin()

  return (
    <UserProvider user={user}>
      {children}
    </UserProvider>
  )
}