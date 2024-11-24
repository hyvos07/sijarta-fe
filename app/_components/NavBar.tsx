'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function NavBar() {
  const [role, setRole] = useState<'pelanggan' | 'pekerja' | null>(null);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);

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
            <Link href="/" className="text-xl font-bold flex items-center md:tracking-wide">
              <img src="/images/logo.png" alt="SIJARTA Logo" className="h-8 w-8 md:h-10 md:w-10 md:mr-2" />
              <p className='hidden md:block'>SIJARTA</p>
            </Link>
          </div>
          <div className="flex space-x-4">
            {error && <span className="text-red-500">{error}</span>}
            <div className="md:hidden">
              <button className="text-white focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
              </button>
              {menuOpen && (
                <div className="absolute right-4 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  {role === 'pelanggan' && (
                    <>
                      <span className="block px-4 py-2 text-sm font-bold text-zinc-700">{name} (Pelanggan)</span>
                      <Link href="/" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">Homepage</Link>
                      <Link href="/mypay" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">MyPay</Link>
                      <Link href="/kelola-pesanan" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">Kelola Pesanan Saya</Link>
                      <Link href="/diskon" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">Diskon</Link>
                      <Link href="/profile" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">Profile</Link>
                    </>
                  )}
                  {role === 'pekerja' && (
                    <>
                      <span className="block px-4 py-2 text-sm font-bold text-zinc-700">{name} (Pekerja)</span>
                      <Link href="/" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">Homepage</Link>
                      <Link href="/kelola-pekerjaan" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">Kelola Pekerjaan Saya</Link>
                      <Link href="/status-pekerjaan" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">Kelola Status Pekerjaan</Link>
                      <Link href="/mypay" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">MyPay</Link>
                      <Link href="/profile" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">Profile</Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            <div className="hidden md:flex space-x-4">
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
      </div>
    </nav>
  );
}
