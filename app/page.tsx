'use client';
import { useEffect, useState } from 'react';
import NavBar from './components/NavBar';

export default function Home() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await fetch('/api/user/role');
        if (response.ok) {
          const data = await response.json();
          setRole(data.role); // 'Pelanggan', 'Pekerja', atau 'Unknown'
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
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavBar />
      <div className="items-center justify-center min-h-[10000px] p-16 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-4 items-center">
          <p className="font-semibold text-6xl tracking-wide">SIJARTA</p>
          <p className="text-lg text-center">Sistem Informasi Jasa Rumah Tangga</p>
          <p className="text-lg">
            Your Role: <strong>{role}</strong>
          </p>
        </main>
      </div>
    </>
  );
}
