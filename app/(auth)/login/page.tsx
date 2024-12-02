'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import '@/app/_styles/login.css'

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ phone: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)  // Error state
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)  // Show loading animation when login is submitted
    setError(null)  // Reset any previous error

    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    setIsLoading(false)  // Reset loading state

    if (res.ok) {
      router.push('/')
      router.refresh()
    } else {
      // Set error message if login fails
      const errorData = await res.json()
      setError(errorData.message || 'An error occurred during login. Please try again.') 
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-6 rounded-lg w-full">
      <header className="flex items-center justify-center mb-9">
        <img src="/images/logo.png" alt="SIJARTA Logo" className="h-14 w-14 mr-2" />
        <h1 className="text-3xl font-bold">SIJARTA</h1>
      </header>
      {/* <h1 className="mb-9 text-2xl md:text-3xl font-semibold text-center">Login</h1> */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Phone Number"
          value={credentials.phone}
          onChange={(e) => setCredentials(prev => ({ ...prev, phone: e.target.value }))}
          className="w-full py-3 md:px-5 px-3 border border-gray-600 rounded-lg bg-transparent md:text-base text-sm focus:outline focus:outline-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
          className="w-full py-3 md:px-5 px-3 border border-gray-600 rounded-lg bg-transparent md:text-base text-sm focus:outline focus:outline-blue-500"
          required
        />
      </div>
      
      {/* Display error message if there's any */}
      {error && (
        <p className="text-red-500 text-sm text-center mt-3">{error}</p>
      )}
      
      <button
        type="submit"
        className={`w-full px-2 py-2 md:py-2.5 bg-stone-100 text-black font-medium rounded hover:bg-white mt-6 ${isLoading ? 'animate-pulse' : ''} transition-transform transform hover:scale-105 active:scale-95 flex items-center justify-center`}
        disabled={isLoading}  // Disable the button during loading
      >
        {isLoading ? (
          <div className="spinner-border animate-spin w-5 h-5 border-4 border-t-4 border-gray-600 rounded-full"></div>
        ) : (
          'Login'
        )}
      </button>
      <p className="text-center mt-6 text-sm">
        Don&apos;t have an account yet? <a href="/register" className="text-blue-500 hover:underline">Register here</a>.
      </p>
    </form>
  )
}
