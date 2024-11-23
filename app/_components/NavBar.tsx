'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function NavBar() {
  const [role, setRole] = useState<'pelanggan' | 'pekerja' | null>(null);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/user');

        if (!response.ok) {
          setError(`Error ${response.status}: ${response.statusText}`);
          return;
        }

        const data = await response.json();

        if (data.role && data.data) {
          setRole(data.role);
          setName(data.data.name);
        } else {
          setError('Data pengguna tidak valid');
        }
      } catch (error: any) {
        console.error('Error fetching user data:', error.message);
        setError('Gagal mengambil data pengguna');
      }
    }

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
      setError('Gagal logout');
    }
  };

  return (
    <nav className="text-white sticky w-full top-0 z-[999] bg-black border-b border-stone-800">
      <div className="mx-auto px-4 sm:px-6 lg:px-16">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img src="/images/logo.png" alt="SIJARTA Logo" className="h-10 w-10 mr-2" />
            <Link href="/" className="text-xl font-bold hidden md:block md:tracking-wide">
              SIJARTA
            </Link>
          </div>
          <div className="flex space-x-4">
            {error && <span className="text-red-500">{error}</span>}
            {role === 'pelanggan' && (
              <>
                <span className="font-bold">{name} (Pelanggan)</span>
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
  );
}
