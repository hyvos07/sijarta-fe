'use client'
import Link from 'next/link'

export default function NavBar() {
  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <nav className="text-white sticky w-full top-0 z-99 bg-black border-b border-stone-800">
      <div className="mx-auto px-4 sm:px-6 lg:px-16">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold hidden md:block md:tracking-wide">
              Sijarta
            </Link>
          </div>
          <div className="flex space-x-4">
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