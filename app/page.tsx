'use client';
import { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import CircularLoading from './components/CircularLoading';

export default function Home() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await fetch('/api/user/role');
        if (response.ok) {
          const data = await response.json();
          setRole(data.role);
        } else {
          console.log(response);
        }
      } catch (error) {
        console.error('Error fetching role:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularLoading />
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="items-center justify-center min-h-[100vh] p-16 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-4 items-center">
          <div className="flex items-center gap-4">
            <img src="/images/logo.png" alt="SIJARTA Logo" className="h-14 w-14" />
            <p className="font-semibold text-6xl tracking-wide">SIJARTA</p>
          </div>
          <p className="text-lg text-center">Sistem Informasi Jasa Rumah Tangga</p>
          <p className="text-lg">
            Your Role: <strong>{role}</strong>
          </p>
        </main>
      </div>
    </>
  );
}
