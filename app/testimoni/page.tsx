'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import NavBar from '@/app/_components/NavBar';
import { TrPemesananJasa } from '@/src/db/types/trPemesananJasa';
import { TrPemesananStatus } from '@/src/db/types/trPemesananStatus';
import { StatusPesanan } from '@/src/db/types/statusPesanan';
// Dummy data untuk subkategori jasa
const dummyData = [
  {
    id: 1,
    subkategori: 'Home Cleaning',
    jasa: [
      { nama: 'Pel Lantai', durasi: '2 jam', hargaPerJam: 50000, namaPekerja: 'Budi', status: 'Pesanan Selesai' },
      { nama: 'Cuci Baju', durasi: '3 jam', hargaPerJam: 45000, namaPekerja: 'Siti', status: 'Dalam Proses' },
      { nama: 'Bersih Kaca', durasi: '2 jam', hargaPerJam: 40000, namaPekerja: 'Eka', status: 'Dalam Proses' },
      { nama: 'Sapu Taman', durasi: '1 jam', hargaPerJam: 30000, namaPekerja: 'Lukman', status: 'Pesanan Selesai' },
      { nama: 'Cuci Mobil', durasi: '2 jam', hargaPerJam: 60000, namaPekerja: 'Rina', status: 'Dalam Proses' },
    ],
  },
  {
    id: 2,
    subkategori: 'Deep Cleaning',
    jasa: [
      { nama: 'Cuci Sofa', durasi: '4 jam', hargaPerJam: 70000, namaPekerja: 'Andi', status: 'Pesanan Selesai' },
      { nama: 'Poles Lantai', durasi: '5 jam', hargaPerJam: 80000, namaPekerja: 'Dewi', status: 'Dalam Proses' },
      { nama: 'Cuci Karpet', durasi: '3 jam', hargaPerJam: 60000, namaPekerja: 'Bagus', status: 'Dalam Proses' },
      { nama: 'Desinfeksi', durasi: '2 jam', hargaPerJam: 90000, namaPekerja: 'Wulan', status: 'Pesanan Selesai' },
      { nama: 'Vacuum Lantai', durasi: '1 jam', hargaPerJam: 55000, namaPekerja: 'Joko', status: 'Dalam Proses' },
    ],
  },
  {
    id: 3,
    subkategori: 'AC Service',
    jasa: [
      { nama: 'Cek AC', durasi: '1 jam', hargaPerJam: 60000, namaPekerja: 'Eko', status: 'Pesanan Selesai' },
      { nama: 'Isi Freon', durasi: '2 jam', hargaPerJam: 75000, namaPekerja: 'Rina', status: 'Dalam Proses' },
      { nama: 'Cuci AC', durasi: '3 jam', hargaPerJam: 70000, namaPekerja: 'Farhan', status: 'Pesanan Selesai' },
      { nama: 'Pasang AC', durasi: '4 jam', hargaPerJam: 100000, namaPekerja: 'Gita', status: 'Dalam Proses' },
      { nama: 'Servis AC', durasi: '3 jam', hargaPerJam: 85000, namaPekerja: 'Tono', status: 'Pesanan Selesai' },
    ],
  },
];

const TestimoniPage = () => {
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ rating: '', komentar: '' });
  const [testimoniStatus, setTestimoniStatus] = useState<{ [key: string]: boolean }>({});
  const [notification, setNotification] = useState<string | null>(null);
  const [sortStatus, setSortStatus] = useState<string>('All');
  const router = useRouter();
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/user');
  
        if (!response.ok) {
          return;
        }
  
        const data = await response.json();
  
        if (data.role) {
          // Jika role bukan pelanggan, lakukan redirect
          if (data.role !== 'pelanggan') {
            window.alert('Role bukan pelanggan. Redirect ke halaman utama.');
            router.push('/'); // Redirect jika bukan pelanggan
          }
        } else {
        }
  
        // Ambil nilai saldo_mypay dan set ke userBalance
        
        // const userID = data.data.userID; 
        // setUserID(userID);
      } catch (error: any) {
        console.error('Error fetching user data:', error.message);
      }
    }
  
    fetchUserData();
  }, [router]);

  
  // Handle perubahan dropdown untuk subkategori
  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value, 10);
    setSelectedSubcategoryId(selectedId);
  };

  // Fungsi untuk menampilkan modal
  const openModal = (jasaKey: string) => {
    setIsModalOpen(true);
    setFormData({ rating: '', komentar: '' });
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Fungsi untuk menangani submit form
  const handleSubmit = (jasaKey: string) => {
    setNotification('Berhasil memberikan testimoni!');
    setTestimoniStatus((prev) => ({ ...prev, [jasaKey]: true }));
    setTimeout(() => setNotification(null), 3000);
    closeModal();
  };

  // Fungsi untuk mengubah status testimoni
  const toggleTestimoniStatus = (jasaKey: string) => {
    setTestimoniStatus((prev) => ({ ...prev, [jasaKey]: !prev[jasaKey] }));
  };

  // Handle perubahan input pada form modal
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Subkategori yang dipilih
  const selectedSubcategory = dummyData.find((subcategory) => subcategory.id === selectedSubcategoryId);

  // Filter jasa berdasarkan status
  const filteredJasa = selectedSubcategory
    ? selectedSubcategory.jasa.filter((jasa) =>
        sortStatus === 'All'
          ? true
          : sortStatus === 'Pesanan Selesai'
          ? jasa.status === 'Pesanan Selesai'
          : jasa.status !== 'Pesanan Selesai'
      )
    : [];

  return (
    <>
      <NavBar />
      <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center' }}>Testimoni Pelanggan</h1>

        {/* Dropdown untuk memilih subkategori */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="subcategory" style={{ color: 'black' }}>
            Pilih Subkategori Jasa:
            <select
              id="subcategory"
              onChange={handleSubcategoryChange}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px',
                marginTop: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
              }}
            >
              <option value="">Pilih subkategori...</option>
              {dummyData.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.subkategori}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Filter berdasarkan status */}
        {selectedSubcategory && (
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="statusFilter" style={{ color: 'black' }}>
              Filter Status:
              <select
                id="statusFilter"
                onChange={(e) => setSortStatus(e.target.value)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px',
                  marginTop: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                }}
              >
                <option value="All">Semua</option>
                <option value="Pesanan Selesai">Pesanan Selesai</option>
                <option value="Other">Lainnya</option>
              </select>
            </label>
          </div>
        )}

        {/* Tabel untuk menampilkan jasa */}
        {selectedSubcategory && (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: '1px solid #ddd',
              marginTop: '20px',
            }}
          >
            <thead>
              <tr>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Nama Jasa</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Durasi</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Harga Per Jam</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Nama Pekerja</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredJasa.map((jasa, index) => (
                <tr key={index}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{jasa.nama}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{jasa.durasi}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{jasa.hargaPerJam}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{jasa.namaPekerja}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{jasa.status}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                    {jasa.status === 'Pesanan Selesai' && (
											testimoniStatus[jasa.nama] ? (
												<button
													style={{
														padding: '10px 15px',
														backgroundColor: '#f44336',
														color: '#fff',
														border: 'none',
														borderRadius: '5px',
														cursor: 'pointer',
													}}
													onClick={() => toggleTestimoniStatus(jasa.nama)}
												>
													Batalkan
												</button>
											) : (
												<button
													style={{
														padding: '10px 15px',
														backgroundColor: '#333',
														color: '#fff',
														border: 'none',
														borderRadius: '5px',
														cursor: 'pointer',
													}}
													onClick={() => openModal(jasa.nama)}
												>
													Buat Testimoni
												</button>
                    	)
										)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div
            style={{
              position: 'fixed',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '5px',
                boxShadow: '0px 0px 10px rgba(0,0,0,0.25)',
                width: '400px',
                position: 'relative',
              }}
            >
              <h2 style= {{color: 'black'}}>Buat Testimoni</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit('');
                }}
              >
                <label style= {{color: 'black'}}>
                  Rating (1-5):
                  <input
                    type="number"
                    min="1"
                    max="5"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    required
                    style={{ display: 'block', width: '100%', marginTop: '10px', color: 'black',border: '1px solid #ddd', borderRadius: '5px', }}
                  />
                </label>
                <label style= {{color: 'black'}}>
                  Komentar:
                  <textarea
                    name="komentar"
                    value={formData.komentar}
                    onChange={handleInputChange}
                    required
                    style={{
                      display: 'block',
                      width: '100%',
                      marginTop: '10px',
                      height: '80px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
											color: 'black',
                    }}
                  />
                </label>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '20px',
                  }}
                >
                  <button
                    type="button"
                    onClick={closeModal}
                    style={{
                      padding: '10px 15px',
                      backgroundColor: '#000000',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 15px',
                      backgroundColor: '#333',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Kirim
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Notifikasi */}
        {notification && (
          <div
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#4caf50',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '5px',
              boxShadow: '0px 0px 10px rgba(0,0,0,0.25)',
            }}
          >
            {notification}
          </div>
        )}
      </div>
    </>
  );
};

export default TestimoniPage;
