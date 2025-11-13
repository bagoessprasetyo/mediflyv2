'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signupSchema = loginSchema.extend({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  role: z.enum(['admin', 'patient']).default('patient'),
})

export async function login(formData: FormData) {
  const supabase = await createClient()
  
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const validation = loginSchema.safeParse(data)
  if (!validation.success) {
    return {
      success: false,
      error: 'Please check your email and password'
    }
  }

  const { error } = await supabase.auth.signInWithPassword(validation.data)

  if (error) {
    console.error('Auth login error:', error)
    return {
      success: false,
      error: error.message === 'Invalid login credentials' 
        ? 'Invalid email or password' 
        : error.message
    }
  }

  revalidatePath('/', 'layout')
  return {
    success: true,
    redirect: '/cms/dashboard'
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    fullName: formData.get('fullName') as string,
    role: (formData.get('role') as 'admin' | 'patient') || 'patient',
  }

  const validation = signupSchema.safeParse(data)
  if (!validation.success) {
    return {
      success: false,
      error: 'Please check all required fields'
    }
  }

  try {
    // First test if we can connect to the database
    const { data: testData, error: testError } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1)

    if (testError) {
      console.error('Database connection test failed:', testError)
      return {
        success: false,
        error: 'Database connection failed. Please try again.'
      }
    }

    const { data: authData, error } = await supabase.auth.signUp({
      email: validation.data.email,
      password: validation.data.password,
      options: {
        data: {
          full_name: validation.data.fullName,
          role: validation.data.role,
        },
      },
    })

    if (error) {
      console.error('Auth signup error:', error)
      return {
        success: false,
        error: error.message === 'User already registered'
          ? 'An account with this email already exists'
          : error.message
      }
    }

    console.log('User created successfully:', authData.user?.id)

    revalidatePath('/', 'layout')
    return {
      success: true,
      message: 'Account created successfully! Please check your email to confirm your account.',
      redirect: '/login'
    }
  } catch (err) {
    console.error('Unexpected signup error:', err)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    }
  }
}

export async function logout() {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function getUser() {
  const supabase = await createClient()
  let resp
  try {
    resp = await supabase.auth.getUser()
  } catch (err) {
    console.error('Failed to fetch current user from Supabase:', err)
    return null
  }

  const user = resp?.data?.user ?? null
  if (!user) return null

  // Try to get user profile with fallback handling
  let profile = null

  try {
    const { getUserProfileById } = await import('@/lib/supabase/admin')
    profile = await getUserProfileById(user.id)
  } catch (e) {
    try {
      const { data: regularProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      profile = regularProfile
    } catch (innerErr) {
      console.error('Failed to fetch user profile:', innerErr)
      profile = null
    }
  }

  return {
    id: user.id,
    email: user.email,
    profile,
  }
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.profile?.role !== 'admin') {
    redirect('/unauthorized')
  }
  return user
}