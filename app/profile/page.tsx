'use client';

import { useState, useEffect } from 'react';

interface UserProfile {
  name: string;
  role: 'pelanggan' | 'pekerja';
  level?: string;
  gender?: 'L' | 'P';
  phone?: string;
  birthdate?: string;
  address?: string;
  mypayBalance?: string;
  bankName?: string;
  bankAccount?: string;
  npwp?: string;
  rating?: string;
  ordersCompleted?: number;
  categories?: string[];
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/user');

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || `Error ${response.status}: ${response.statusText}`);
          return;
        }

        const data = await response.json();

        if (data.role && data.data) {
          setUserData({
            name: data.data.name,
            role: data.role,
            level: data.data.level || '',
            gender: data.data.gender || 'L',
            phone: data.data.phone || '',
            birthdate: data.data.birthdate || '',
            address: data.data.address || '',
            mypayBalance: data.data.mypayBalance || '',
            bankName: data.data.bankName || '',
            bankAccount: data.data.bankAccount || '',
            npwp: data.data.npwp || '',
            rating: data.data.rating ? data.data.rating.toString() : '',
            ordersCompleted: data.data.ordersCompleted || 0,
            categories: data.data.categories || [],
          });
          setFormData(data.data);
        } else {
          setError('Data pengguna tidak valid');
        }
      } catch (err: any) {
        console.error('Error fetching user data:', err.message);
        setError('Gagal mengambil data pengguna');
      }
    }

    fetchUserData();
  }, []);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleUpdate = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = () => {
    alert('Data berhasil diperbarui!');
    setIsEditing(false);
  };

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!userData) {
    return <div className="text-center">Memuat data...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Data Profil */}
      <div className="bg-black text-white p-6 rounded-lg">
        <h1 className="text-2xl font-semibold mb-4">
          Profil {userData.role === 'pelanggan' ? 'Pelanggan' : 'Pekerja'}
        </h1>
        <p><strong>Nama:</strong> {userData.name}</p>
        {userData.role === 'pelanggan' && (
          <p><strong>Level:</strong> {userData.level}</p>
        )}
        <p><strong>Jenis Kelamin:</strong> {userData.gender}</p>
        <p><strong>No HP:</strong> {userData.phone}</p>
        <p><strong>Tanggal Lahir:</strong> {userData.birthdate}</p>
        <p><strong>Alamat:</strong> {userData.address}</p>
        <p><strong>Saldo MyPay:</strong> {userData.mypayBalance}</p>
        {userData.role === 'pekerja' && (
          <>
            <p><strong>Nama Bank:</strong> {userData.bankName}</p>
            <p><strong>No Rekening:</strong> {userData.bankAccount}</p>
            <p><strong>NPWP:</strong> {userData.npwp}</p>
            <p><strong>Rating:</strong> {userData.rating}</p>
            <p><strong>Jumlah Pesanan Selesai:</strong> {userData.ordersCompleted}</p>
            <div>
              <p><strong>Kategori Pekerjaan:</strong></p>
              <ul className="list-disc list-inside">
                {userData.categories?.map((category, index) => (
                  <li key={index}>{category}</li>
                ))}
              </ul>
            </div>
          </>
        )}
        <button
          className="bg-white text-black px-4 py-2 rounded mt-4"
          onClick={handleUpdate}
        >
          {isEditing ? 'Batal' : 'Update'}
        </button>
      </div>

      {/* Form Edit */}
      {isEditing && (
        <div className="bg-white text-black p-6 rounded-lg border border-black">
          <h2 className="text-xl font-semibold mb-4">Edit Data</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-medium">Nama</label>
              <input
                type="text"
                className="border rounded w-full p-2"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium">Jenis Kelamin</label>
              <label>
                <input
                  type="radio"
                  value="L"
                  checked={formData.gender === 'L'}
                  onChange={() => handleInputChange('gender', 'L')}
                />
                Laki-Laki
              </label>
              <label className="ml-4">
                <input
                  type="radio"
                  value="P"
                  checked={formData.gender === 'P'}
                  onChange={() => handleInputChange('gender', 'P')}
                />
                Perempuan
              </label>
            </div>
            <div>
              <label className="block font-medium">No HP</label>
              <input
                type="text"
                className="border rounded w-full p-2"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium">Tanggal Lahir</label>
              <input
                type="date"
                className="border rounded w-full p-2"
                value={formData.birthdate || ''}
                onChange={(e) => handleInputChange('birthdate', e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium">Alamat</label>
              <textarea
                className="border rounded w-full p-2"
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>
            {userData.role === 'pekerja' && (
              <>
                <div>
                  <label className="block font-medium">Nama Bank</label>
                  <select
                    className="border rounded w-full p-2"
                    value={formData.bankName || ''}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                  >
                    <option value="">Pilih Bank</option>
                    <option value="BCA">BCA</option>
                    <option value="Mandiri">Mandiri</option>
                    <option value="BRI">BRI</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium">No Rekening</label>
                  <input
                    type="text"
                    className="border rounded w-full p-2"
                    value={formData.bankAccount || ''}
                    onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-medium">NPWP</label>
                  <input
                    type="text"
                    className="border rounded w-full p-2"
                    value={formData.npwp || ''}
                    onChange={(e) => handleInputChange('npwp', e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
          <button
            className="bg-black text-white px-4 py-2 rounded mt-4"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

