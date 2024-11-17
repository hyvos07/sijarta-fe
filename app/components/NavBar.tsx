'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function NavBar() {
  const [role, setRole] = useState(null) // Role bisa "pengguna" atau "pekerja"
  const [name, setName] = useState('')

  // Simulasi pengambilan data role dan nama (misalnya dari API atau context)
  useEffect(() => {
    async function fetchUserData() {
      // Contoh request ke API (ubah sesuai kebutuhan)
      const response = await fetch('/api/user') 
      const data = await response.json()
      setRole(data.role) // Role: 'pengguna' atau 'pekerja'
      setName(data.name) // Nama pengguna
    }
    fetchUserData()
  }, [])

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
            {role === 'pengguna' && (
              <>
                <span className="font-bold">{name} (Pengguna)</span>
                <Link href="/" className="hover:text-gray-300">Homepage</Link>
                <Link href="/mypay" className="hover:text-gray-300">MyPay</Link>
                <Link href="/kelola-pesanan" className="hover:text-gray-300">Kelola Pesanan Saya</Link>
                <Link href="/diskon" className="hover:text-gray-300">Diskon</Link>
                <Link href="/profile" className="hover:text-gray-300">Profile</Link>
              </>
            )}
            {role === 'pekerja' && (
              <>
                <span className="font-bold">{name} (Pekerja)</span>
                <Link href="/" className="hover:text-gray-300">Homepage</Link>
                <Link href="/kelola-pekerjaan" className="hover:text-gray-300">Kelola Pekerjaan Saya</Link>
                <Link href="/status-pekerjaan" className="hover:text-gray-300">Kelola Status Pekerjaan</Link>
                <Link href="/mypay" className="hover:text-gray-300">MyPay</Link>
                <Link href="/profile" className="hover:text-gray-300">Profile</Link>
              </>
            )}
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
