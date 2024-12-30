// path: sijarta-fe/app/(auth)/profile/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
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
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const router = useRouter();
  const banks = ['GoPay', 'OVO', 'Virtual Account BCA', 'Virtual Account BNI', 'Virtual Account Mandiri'];

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user');

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || `Error ${response.status}: ${response.statusText}`);
        return;
      }

      const data = await response.json();

      if (data.role && data.data) {
        // Convert birthdate to YYYY-MM-DD format
        const formattedBirthdate = data.data.birthdate
          ? new Date(data.data.birthdate).toISOString().split('T')[0]
          : '';

        const profileData: UserProfile = {
          name: data.data.name,
          role: data.role,
          level: data.data.level || '',
          gender: data.data.gender || 'L',
          phone: data.data.phone || '',
          birthdate: formattedBirthdate,
          address: data.data.address || '',
          mypayBalance: data.data.mypayBalance || '',
          bankName: data.data.bankName || '',
          bankAccount: data.data.bankAccount || '',
          npwp: data.data.npwp || '',
          rating: data.data.rating ? data.data.rating.toString() : '',
          ordersCompleted: data.data.ordersCompleted || 0,
          categories: data.data.categories || [],
          linkFoto: data.data.linkFoto || '',
        };

        setUserData(profileData);
        setFormData(profileData);
      } else {
        setError('Invalid user data');
      }
    } catch (err: any) {
      console.error('Error fetching user data:', err.message);
      setError('Failed to fetch user data');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, gender: e.target.value as 'L' | 'P' }));
  };

  const handleUpdate = () => {
    setIsEditing(!isEditing);
    setError(null);
    // Reset form data to current user data when canceling edit
    if (isEditing && userData) {
      setFormData({
        name: userData.name,
        phone: userData.phone,
        gender: userData.gender,
        birthdate: userData.birthdate || '',
        address: userData.address,
        bankName: userData.bankName,
        bankAccount: userData.bankAccount,
        npwp: userData.npwp,
        linkFoto: userData.linkFoto || '',
      });
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name || !formData.phone || !formData.birthdate || !formData.address) {
      setError('All fields are required.');
      return false;
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 12 || phoneDigits.length > 13) {
      setError('Phone number must be between 12 and 13 digits.');
      return false;
    }

    if (userData?.role === 'pekerja') {
      if (!formData.bankName || !formData.bankAccount || !formData.npwp || !formData.linkFoto) {
        setError('All fields including photo URL are required for Pekerja.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

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
            linkFoto: formData.linkFoto,
          }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update profile');
        return;
      }

      setShowSuccessModal(true);
      setError(null);
      setIsEditing(false);
      setTimeout(() => {
        setShowSuccessModal(false);
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      console.error('Error updating profile:', err.message);
      setError('An error occurred while updating your profile');
    }
  };

  const handleBackToMain = () => {
    router.push('/');
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).split('/').reverse().join('-');
  };

  const renderProfileItem = (
    label: string,
    value?: string | number | string[],
    isList = false
  ) => {
    if (isList && Array.isArray(value)) {
      if (value.length === 0) {
        return (
          <div key={label}>
            <p className="font-medium">{label}:</p>
            <p className="bg-black text-white p-2 rounded border border-white mt-1">No data available</p>
          </div>
        );
      }

      return (
        <div key={label}>
          <p className="font-medium">{label}:</p>
          <ul className="list-disc list-inside ml-4">
            {value.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
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

  if (error && !isEditing) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!userData) {
    return <div className="text-center">Loading data...</div>;
  }

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Display Section */}
        <div className="bg-black text-white p-6 rounded-lg space-y-4 border border-white">
          <h2 className="text-xl font-semibold mb-4">Data Profil</h2>

          {/* Profile Photo Section */}
          {userData.role === 'pekerja' && (
            <div className="mt-4 flex flex-col items-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-white mb-2">
                <img
                  src={userData.linkFoto || '/images/default-profile.png'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/default-profile.png';
                  }}
                />
              </div>
              <p className="text-sm text-gray-300 text-center">Profile Photo</p>
            </div>
          )}

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
              Cancel
            </button>
          )}
        </div>

        {/* Edit Form Section */}
        {isEditing && (
          <div className="bg-white text-black p-6 rounded-lg border border-black space-y-4">
            <h2 className="text-xl font-semibold mb-4">Edit Data</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium" htmlFor="name">Nama:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="border rounded w-full p-2"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block font-medium">Jenis Kelamin:</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="L"
                      checked={formData.gender === 'L'}
                      onChange={handleGenderChange}
                      className="form-radio"
                    />
                    <span className="ml-2">Laki-Laki</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="P"
                      checked={formData.gender === 'P'}
                      onChange={handleGenderChange}
                      className="form-radio"
                    />
                    <span className="ml-2">Perempuan</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-medium" htmlFor="phone">No HP:</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="border rounded w-full p-2"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block font-medium" htmlFor="birthdate">Tanggal Lahir:</label>
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  className="border rounded w-full p-2"
                  value={formData.birthdate || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block font-medium" htmlFor="address">Alamat:</label>
                <textarea
                  id="address"
                  name="address"
                  className="border rounded w-full p-2"
                  value={formData.address || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {userData.role === 'pekerja' && (
                <>
                  {/* Profile Photo URL Input */}
                  <div>
                    <label className="block font-medium" htmlFor="linkFoto">Link Foto:</label>
                    <input
                      type="url"
                      id="linkFoto"
                      name="linkFoto"
                      value={formData.linkFoto || ''}
                      onChange={handleInputChange}
                      placeholder="Enter photo URL"
                      className="border rounded w-full p-2"
                      required
                    />
                    {formData.linkFoto && (
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-1">Preview:</p>
                        <img
                          src={formData.linkFoto}
                          alt="Profile Preview"
                          className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
                          onError={(e) => {
                            e.currentTarget.src = '/images/default-profile.png';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-medium" htmlFor="bankName">Nama Bank:</label>
                    <select
                      id="bankName"
                      name="bankName"
                      className="border rounded w-full p-2"
                      value={formData.bankName || ''}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Bank</option>
                      {banks.map((bank) => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium" htmlFor="bankAccount">No Rekening:</label>
                    <input
                      type="text"
                      id="bankAccount"
                      name="bankAccount"
                      className="border rounded w-full p-2"
                      value={formData.bankAccount || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium" htmlFor="npwp">NPWP:</label>
                    <input
                      type="text"
                      id="npwp"
                      name="npwp"
                      className="border rounded w-full p-2"
                      value={formData.npwp || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </>
              )}

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <div className="flex justify-center gap-4 mt-6">
                <button
                  type="submit"
                  className="w-1/2 px-2 py-2 md:py-2.5 bg-black text-white font-medium rounded hover:bg-black"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white text-black p-8 rounded-lg shadow-lg max-w-sm w-full mx-4 text-center">
              <div className="text-green-500 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Profile Updated Successfully!</h3>
              <p className="text-gray-600 mb-4">Your profile has been updated successfully.</p>
              <p className="text-gray-600 text-sm">Redirecting...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
