import { createClient } from '@/lib/supabase/server'

export async function testDatabaseConnection() {
  try {
    const supabase = await createClient()
    
    // Test basic connection
    const { data, error } = await supabase.from('user_profiles').select('count').limit(1)
    
    if (error) {
      console.error('Database connection error:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true, message: 'Database connection successful' }
  } catch (error) {
    console.error('Connection test failed:', error)
    return { success: false, error: 'Failed to connect to database' }
  }
}

export async function testUserCreation(email: string, password: string) {
  try {
    const supabase = await createClient()
    
    // Test user signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: 'Test User',
          role: 'patient',
        },
      },
    })
    
    if (error) {
      console.error('User creation error:', error)
      return { success: false, error: error.message }
    }
    
    console.log('User creation result:', data)
    return { success: true, user: data.user }
  } catch (error) {
    console.error('User creation test failed:', error)
    return { success: false, error: 'Failed to test user creation' }
  }
}