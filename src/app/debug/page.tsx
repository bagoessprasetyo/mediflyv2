import { getUser } from '@/lib/auth/actions'
import { createClient } from '@/lib/supabase/server'

export default async function DebugPage() {
  const user = await getUser()
  
  let authUserData = null
  let profileData = null
  let error = null

  try {
    const supabase = await createClient()
    
    // Get auth user data
    const { data: authData, error: authError } = await supabase.auth.getUser()
    authUserData = authData

    // Get profile data if user exists
    if (authData.user) {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single()
      
      profileData = profile
      if (profileError) {
        error = profileError.message
      }
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error'
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug Page</h1>
      
      <div className="space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">getUser() Result:</h2>
          <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Raw Auth Data:</h2>
          <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(authUserData, null, 2)}
          </pre>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Profile Data:</h2>
          <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(profileData, null, 2)}
          </pre>
        </div>

        {error && (
          <div className="border rounded-lg p-4 border-red-300 bg-red-50">
            <h2 className="text-lg font-semibold mb-2 text-red-700">Error:</h2>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Environment Variables:</h2>
          <ul className="space-y-1">
            <li>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</li>
            <li>NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Quick Actions:</h2>
          <div className="flex gap-2 flex-wrap">
            <a href="/login" className="bg-blue-500 text-white px-4 py-2 rounded">Login</a>
            <a href="/cms" className="bg-green-500 text-white px-4 py-2 rounded">CMS (Admin)</a>
            <a href="/cms/dashboard" className="bg-green-600 text-white px-4 py-2 rounded">CMS Dashboard</a>
            <a href="/unauthorized" className="bg-red-500 text-white px-4 py-2 rounded">Unauthorized Page</a>
          </div>
        </div>
      </div>
    </div>
  )
}