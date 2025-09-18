'use client'
import { useSession, signIn, signOut } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession()

  if (session) {
    console.log('Session Token:', session)
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-8">Welcome to HMS</h1>
          <img src={session.user?.image || ''} className="w-20 h-20 rounded-full mx-auto mb-4"/>
          <h2 className="text-xl font-semibold">{session.user?.name}</h2>
          <p className="text-gray-600 mb-6">{session.user?.email}</p>
          <button 
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sign out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold mb-8">HMS Login</h1>
        <p className="text-gray-600 mb-6">Sign in to access the system</p>
        <button 
          onClick={() => signIn('google')}
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Sign in with Googlex
        </button>
      </div>
    </div>
  )
}
