'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IconEye, IconEyeOff, IconLoader2 } from '@tabler/icons-react'
import { login, signup } from '@/lib/auth/actions'
import { toast } from 'sonner'

interface AuthFormProps {
  mode: 'login' | 'signup'
}

export function AuthForm({ mode }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    setError(null)
    
    // Show loading toast
    const loadingToast = toast.loading(
      mode === 'login' ? 'Signing you in...' : 'Creating your account...'
    )

    try {
      let result
      if (mode === 'login') {
        result = await login(formData)
      } else {
        result = await signup(formData)
      }

      // Dismiss loading toast
      toast.dismiss(loadingToast)

      if (result.success) {
        // Determine success message
        const successMsg =
          'message' in result && result.message
            ? String(result.message)
            : mode === 'login'
            ? 'Welcome back!'
            : 'Account created successfully!'

        // Show success toast
        toast.success(successMsg)
        setError(null)
        
        // Redirect after short delay
        router.push(result.redirect ?? '/')
      } else {
        // Show error toast and set error state
        const err = String(result.error ?? 'An error occurred')
        toast.error(err)
        setError(err)
      }
    } catch (err) {
      // Dismiss loading toast
      toast.dismiss(loadingToast)
      const errMsg = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.'
      toast.error(errMsg)
      setError(errMsg)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </CardTitle>
          <CardDescription>
            {mode === 'login' 
              ? 'Sign in to access your Medifly dashboard' 
              : 'Sign up to get started with Medifly'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
              {error}
            </div>
          )}
          
          <form action={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  disabled={isPending}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  required
                  disabled={isPending}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isPending}
                >
                  {showPassword ? (
                    <IconEyeOff className="h-4 w-4" />
                  ) : (
                    <IconEye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="role">Account Type</Label>
                <select
                  id="role"
                  name="role"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs"
                  disabled={isPending}
                >
                  <option value="patient">Patient</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            )}

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isPending}
              aria-busy={isPending}
            >
              {isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <IconLoader2 className="h-4 w-4 animate-spin" />
                  <span>{mode === 'login' ? 'Signing in…' : 'Creating account…'}</span>
                </div>
              ) : mode === 'login' ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <a href="/signup" className="text-primary underline-offset-4 hover:underline">
                  Sign up
                </a>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <a href="/login" className="text-primary underline-offset-4 hover:underline">
                  Sign in
                </a>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
  )
}