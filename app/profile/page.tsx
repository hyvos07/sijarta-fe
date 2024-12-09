'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  linkFoto?: string;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
            linkFoto: data.data.linkFoto || '',
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

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: userData?.role,
          name: formData.name,
          phone: formData.phone,
          gender: formData.gender,
          birthDate: formData.birthdate,
          address: formData.address,
          ...(userData?.role === 'pekerja' && {
            bankName: formData.bankName,
            bankAccount: formData.bankAccount,
            npwp: formData.npwp,
          }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update profile');
        return;
      }

      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('An error occurred while updating your profile');
    }
  };

  const handleBackToMain = () => {
    router.push('/');
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).split('/').reverse().join('-');
  };

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!userData) {
    return <div className="text-center">Memuat data...</div>;
  }

  const renderProfileItem = (label: string, value?: string | number | string[], isList = false) => {
    if (isList && Array.isArray(value)) {
      return (
        <div key={label}>
          <p className="font-medium">{label}:</p>
          <ul className="list-disc list-inside ml-4">
            {value.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      );
    }

    return (
      <div key={label}>
        <p className="font-medium">{label}:</p>
        <p className="bg-black text-white p-2 rounded border border-white mt-1">{value || '-'}</p>
      </div>
    );
  };

  return (
    <div className="p-6 relative">
      <button
        onClick={handleBackToMain}
        className="absolute top-4 right-4 bg-white text-black px-4 py-2 rounded transition"
      >
        Back
      </button>

      <h1 className="text-2xl font-bold mb-6">
        Profile {userData.role === 'pelanggan' ? 'Pelanggan' : 'Pekerja'}
      </h1>

      {userData.role === 'pekerja' && userData.linkFoto && (
        <div className="mt-4 flex justify-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-white">
            <img
              src={userData.linkFoto}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/images/default-profile.png';
              }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black text-white p-6 rounded-lg space-y-4 border border-white">
          <h2 className="text-xl font-semibold mb-4">Data Profil</h2>
          {renderProfileItem('Nama', userData.name)}
          {userData.role === 'pelanggan' && renderProfileItem('Level', userData.level)}
          {renderProfileItem('Jenis Kelamin', userData.gender === 'L' ? 'Laki-Laki' : 'Perempuan')}
          {renderProfileItem('No HP', userData.phone)}
          {renderProfileItem('Tanggal Lahir', formatDate(userData.birthdate))}
          {renderProfileItem('Alamat', userData.address)}
          {renderProfileItem('Saldo MyPay', userData.mypayBalance)}

          {userData.role === 'pekerja' && (
            <>
              {renderProfileItem('Nama Bank', userData.bankName)}
              {renderProfileItem('No Rekening', userData.bankAccount)}
              {renderProfileItem('NPWP', userData.npwp)}
              {renderProfileItem('Rating', userData.rating)}
              {renderProfileItem('Jumlah Pesanan Selesai', userData.ordersCompleted?.toString())}
              {renderProfileItem('Kategori Pekerjaan', userData.categories, true)}
            </>
          )}

          {!isEditing ? (
            <button
              className="bg-white text-black px-4 py-2 rounded mt-4"
              onClick={handleUpdate}
            >
              Update
            </button>
          ) : (
            <button
              className="bg-white text-black px-4 py-2 rounded mt-4"
              onClick={handleUpdate}
            >
              Batal
            </button>
          )}
        </div>

        {isEditing && (
          <div className="bg-white text-black p-6 rounded-lg border border-black space-y-4">
            <h2 className="text-xl font-semibold mb-4">Edit Data</h2>

            <div>
              <label className="block font-medium">Nama:</label>
              <input
                type="text"
                className="border rounded w-full p-2"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium">Jenis Kelamin:</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-1">
                  <input
                    type="radio"
                    value="L"
                    checked={formData.gender === 'L'}
                    onChange={() => handleInputChange('gender', 'L')}
                  />
                  <span>Laki-Laki</span>
                </label>
                <label className="flex items-center space-x-1">
                  <input
                    type="radio"
                    value="P"
                    checked={formData.gender === 'P'}
                    onChange={() => handleInputChange('gender', 'P')}
                  />
                  <span>Perempuan</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block font-medium">No HP:</label>
              <input
                type="text"
                className="border rounded w-full p-2"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium">Tanggal Lahir:</label>
              <input
                type="date"
                className="border rounded w-full p-2"
                value={formData.birthdate || ''}
                onChange={(e) => handleInputChange('birthdate', e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium">Alamat:</label>
              <textarea
                className="border rounded w-full p-2"
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>

            {userData.role === 'pekerja' && (
              <>
                <div>
                  <label className="block font-medium">Nama Bank:</label>
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
                  <label className="block font-medium">No Rekening:</label>
                  <input
                    type="text"
                    className="border rounded w-full p-2"
                    value={formData.bankAccount || ''}
                    onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-medium">NPWP:</label>
                  <input
                    type="text"
                    className="border rounded w-full p-2"
                    value={formData.npwp || ''}
                    onChange={(e) => handleInputChange('npwp', e.target.value)}
                  />
                </div>
              </>
            )}

            <button
              className="bg-black text-white px-4 py-2 rounded mt-4"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}