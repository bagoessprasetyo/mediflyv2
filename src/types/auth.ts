export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: 'admin' | 'patient'
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string | undefined
  profile?: UserProfile
}