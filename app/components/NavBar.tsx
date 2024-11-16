'use client'
import Link from 'next/link'

export default function NavBar() {
  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Sijarta
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link href="/login" className="hover:text-gray-300">
              Login
            </Link>
            <button 
              onClick={handleLogout}
              className="hover:text-gray-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}