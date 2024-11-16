'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import '../../styles/login.css'

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ phone: '', password: '' })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (res.ok) {
      router.push('/')
      router.refresh()
    }

    // TODO: Kalo nggak oke display error di login page
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-6 rounded-lg w-full">
      <h1 className="mb-9 text-2xl md:text-3xl font-semibold text-center">Login</h1>
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
      <button
        type="submit"
        className="w-full px-2 py-2 md:py-2.5 bg-stone-100 text-black font-medium rounded hover:bg-white mt-6"
      >
        Login
      </button>
      <p className="text-center mt-6 text-sm">
        Don't have an account yet? <a href="/register" className="text-blue-500 hover:underline">Register here</a>.
      </p>
    </form>
  )
}