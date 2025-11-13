import { getUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // If user is already authenticated, redirect to dashboard
  const user = await getUser()
  
  if (user) {
    if (user.profile?.role === 'admin') {
      redirect('/cms/dashboard')
    } else {
      redirect('/dashboard')  // Patient dashboard (to be created)
    }
  }

  return <>{children}</>
}