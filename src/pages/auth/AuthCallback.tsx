import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Loader2 } from 'lucide-react'

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          navigate('/?auth=signin&error=' + encodeURIComponent(error.message))
          return
        }

        if (data.session) {
          // Successfully authenticated
          navigate('/dashboard')
        } else {
          // No session found
          navigate('/?auth=signin')
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error)
        navigate('/?auth=signin&error=unexpected_error')
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Completing Sign In</h2>
        <p className="text-gray-400">Please wait while we finish setting up your account...</p>
      </div>
    </div>
  )
}

export default AuthCallback