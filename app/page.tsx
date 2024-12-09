// path : sijarta-fe/app/page.tsx
'use client';
import { useEffect, useState } from 'react';
import NavBar from './_components/NavBar';
import CircularLoading from './_components/CircularLoading';

export default function Home() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{
    id: number;
    name: string;
    subcategories: { id: number; name: string }[];
  }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

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

    // Dummy data untuk kategori dan subkategori
    const dummyCategories = [
      {
        id: 1,
        name: 'Kebersihan Rumah',
        subcategories: [
          { id: 101, name: 'Kebersihan Rumah Tangga' },
          { id: 102, name: 'Deep Cleaning' },
        ],
      },
      {
        id: 2,
        name: 'Layanan Perbaikan',
        subcategories: [
          { id: 201, name: 'Perbaikan AC' },
          { id: 202, name: 'Perbaikan Elektronik' },
        ],
      },
      {
        id: 3,
        name: 'Perawatan Diri',
        subcategories: [
          { id: 301, name: 'Pijat' },
          { id: 302, name: 'Perawatan Rambut' },
        ],
      },
    ];

    setCategories(dummyCategories);
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
            <img src="/images/logo.png" alt="SIJARTA Logo" className="md:h-14 md:w-14 h-12 w-12" />
            <p className="font-semibold text-4xl md:text-6xl tracking-wide">SIJARTA</p>
          </div>
          <p className="md:text-lg text-center">Sistem Informasi Jasa Rumah Tangga</p>
          <p className="md:text-lg mb-8">
            Your Role: <strong>{role}</strong>
          </p>

          {/* Search bar and category selector */}
          <div className="w-full max-w-2xl flex md:flex-row flex-col gap-4 items-center">
            <input
              type="text"
              placeholder="Cari kategori atau subkategori..."
              className="w-full p-3 border border-gray-300 rounded-lg text-black"
            />
            <select
              onChange={(e) => setSelectedCategory(Number(e.target.value) || null)}
              className="p-3 bg-zinc-800 pl-2 border-r-[6px] border-zinc-800 outline outline-2 outline-zinc-700 rounded-xl w-full"
            >
              <option value="">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id} style={{color:'white'}}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Render kategori dan subkategori */}
          <div className="w-full max-w-2xl mt-6" style={{color:'white'}}>
            {categories
              .filter(
                (category) =>
                  !selectedCategory || category.id === selectedCategory
              )
              .map((category) => (
                <div
                  key={category.id}
                  className="mb-4 border border-gray-300 rounded-lg overflow-hidden"
                  style={{color:'black'}}
                >
                  <button
                    onClick={() =>
                      setExpandedCategory(
                        expandedCategory === category.id ? null : category.id
                      )
                    }
                    className="w-full p-4 text-left font-bold bg-gray-100 hover:bg-gray-200"
                  >
                    {category.name}
                  </button>
                  {expandedCategory === category.id && (
                    <div className="p-4 bg-white">
                      {category.subcategories.map((subcategory) => (
                        <p
                          key={subcategory.id}
                          className="text-gray-700 hover:text-gray-900"
                        >
                          {subcategory.name}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </main>
      </div>
    </>
  );
}