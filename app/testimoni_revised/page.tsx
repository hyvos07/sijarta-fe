'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import NavBar from '@/app/_components/NavBar';
import { Testimoni } from '@/src/db/types/testimoni';
import { TrPemesananJasa } from '@/src/db/types/trPemesananJasa';
import { User } from '@/src/db/types/user'; // Asumsi ada tipe User untuk data pengguna

const TestimoniPage = () => {
  const [testimonis, setTestimonis] = useState<Testimoni[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Menambahkan state untuk menyimpan data trPemesananJasa dan user
  const [testimoniWithDetails, setTestimoniWithDetails] = useState<(
    Testimoni & {
      trPemesananJasa: TrPemesananJasa | null;
      userPelanggan: User | null;
      userPekerja: User | null;
    }
  )[]>([]);

  useEffect(() => {
    const fetchTestimonis = async () => {
      try {
        const response = await fetch('/api/testimoni');
        if (!response.ok) {
          throw new Error('Failed to fetch testimonis');
        }
        const data = await response.json();
        setTestimonis(data.testimonis);

        // Ambil data trPemesananJasa berdasarkan idTrPemesanan
        const trPemesananJasaPromises = data.testimonis.map(async (testimoni: Testimoni) => {
          const trPemesananJasaResponse = await fetch(`/api/pemesananJasaAPI?id=${testimoni.idTrPemesanan}`);
          if (!trPemesananJasaResponse.ok) {
            throw new Error('Failed to fetch trPemesananJasa');
          }
          const trPemesananJasaData = await trPemesananJasaResponse.json();
          return trPemesananJasaData;
        });

        // Tunggu semua data trPemesananJasa selesai diambil
        const trPemesananJasasData = await Promise.all(trPemesananJasaPromises);

        // Ambil data user berdasarkan id_pelanggan dan id_pekerja
        const userPromises = trPemesananJasasData.map(async (trPemesananJasa: TrPemesananJasa) => {
          if (!trPemesananJasa.idPekerja) {
            return { userPelanggan: null, userPekerja: null, trPemesananJasa };
          }

          const idPelanggan = trPemesananJasa.idPelanggan;
          const idPekerja = trPemesananJasa.idPekerja;
          const userPelangganResponse = fetch(`/api/user/tambahan?id=${idPelanggan}`);
          const userPekerjaResponse = fetch(`/api/user/tambahan?id=${idPekerja}`);

          // Tunggu kedua request fetch selesai
          const [userPelangganData, userPekerjaData] = await Promise.all([userPelangganResponse, userPekerjaResponse]);

          const userPelanggan = await userPelangganData.json();
          const userPekerja = await userPekerjaData.json();

          return { userPelanggan, userPekerja, trPemesananJasa };
        });

        // Tunggu semua data user selesai diambil
        const usersData = await Promise.all(userPromises);

        // Gabungkan testimoni, trPemesananJasa, dan user
        const combinedData = data.testimonis.map((testimoni: Testimoni, index: number) => ({
          ...testimoni,
          trPemesananJasa: trPemesananJasasData[index] || null,
          userPelanggan: usersData[index]?.userPelanggan || null,
          userPekerja: usersData[index]?.userPekerja || null,
        }));

        setTestimoniWithDetails(combinedData);
      } catch (err) {
        setError('Error fetching testimonis, trPemesananJasa, or users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonis();
  }, []);

  const handleDeleteTestimoni = async (id: string) => {
    try {
      const response = await fetch(`/api/testimoni/?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete testimoni');
      }

      // Setelah berhasil dihapus, filter testimoni yang sudah dihapus
      setTestimoniWithDetails((prevState) => prevState.filter((testimoni) => testimoni.idTrPemesanan !== id));
    } catch (error) {
      setError('Error deleting testimoni');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Testimoni Pelanggan</h1>
        {testimoniWithDetails.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada testimoni.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimoniWithDetails.map((testimoniWithDetail) => (
              <div
                key={testimoniWithDetail.idTrPemesanan}
                className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
              >
                <div className="mb-4">
                  <span className="text-gray-500 text-sm">ID Pemesanan</span>
                  <p className="text-gray-800 font-semibold">
                    {testimoniWithDetail.idTrPemesanan}
                  </p>
                </div>
                <div className="mb-4">
                  <span className="text-gray-500 text-sm">Tanggal</span>
                  <p className="text-gray-800">
                    {new Date(testimoniWithDetail.tgl).toLocaleDateString()}
                  </p>
                </div>
                <div className="mb-4">
                  <span className="text-gray-500 text-sm">Rating</span>
                  <p className="text-yellow-500 font-semibold">
                    {'★'.repeat(testimoniWithDetail.rating)}{' '}
                    <span className="text-gray-500">/ 5</span>
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Testimoni</span>
                  <p className="text-gray-800">{testimoniWithDetail.teks}</p>
                </div>

                {/* Menampilkan data trPemesananJasa */}
                {testimoniWithDetail.trPemesananJasa && (
                  <div className="mt-4">
                    <div className="mt-2">
                      <p className="text-gray-600">
                        Nama Pelanggan: {testimoniWithDetail.userPelanggan?.data.nama || 'N/A'}
                      </p>
                      <p className="text-gray-600">
                        Nama Pekerja: {testimoniWithDetail.userPekerja.data.nama || 'N/A'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Tombol Batalkan untuk menghapus testimoni */}
                <div className="mt-4 text-center">
                  <button
                    onClick={() => handleDeleteTestimoni(testimoniWithDetail.idTrPemesanan)}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                  >
                    Batalkan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TestimoniPage;
