'use client'
import { useState } from 'react'

export default function Profile() {
  // Mock data untuk detail profil
  const [userType, setUserType] = useState<'Pengguna' | 'Pekerja'>('Pengguna')
  const [profileData, setProfileData] = useState({
    nama: 'John Doe',
    email: 'johndoe@example.com',
    saldoMyPay: 50000,
    level: 'Gold',
    rating: 4.8,
    jumlahPesananSelesai: 10,
    kategoriPekerjaan: 'Driver'
  })

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profileData)

  const handleEdit = () => {
    setFormData(profileData)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSave = () => {
    // Simpan data baru
    setProfileData(formData)
    setIsEditing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const renderReadonlyField = (label: string, value: any) => (
    <div>
      <label className="block text-gray-600">{label}</label>
      <input
        type="text"
        value={value}
        readOnly
        className="w-full border rounded p-2 bg-gray-100 text-gray-700"
      />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="space-y-4">
        {userType === 'Pengguna' && (
          <>
            <div>
              <label className="block text-gray-600">Nama</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className="w-full border rounded p-2"
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="block text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded p-2"
                readOnly={!isEditing}
              />
            </div>
            {renderReadonlyField('Saldo MyPay', profileData.saldoMyPay)}
            {renderReadonlyField('Level', profileData.level)}
          </>
        )}

        {userType === 'Pekerja' && (
          <>
            <div>
              <label className="block text-gray-600">Nama</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className="w-full border rounded p-2"
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="block text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded p-2"
                readOnly={!isEditing}
              />
            </div>
            {renderReadonlyField('Saldo MyPay', profileData.saldoMyPay)}
            {renderReadonlyField('Rating', profileData.rating)}
            {renderReadonlyField('Jumlah Pesanan Selesai', profileData.jumlahPesananSelesai)}
            {renderReadonlyField('Kategori Pekerjaan', profileData.kategoriPekerjaan)}
          </>
        )}
      </div>

      <div className="mt-6">
        {isEditing ? (
          <div className="flex space-x-4">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={handleEdit}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Update
          </button>
        )}
      </div>
    </div>
  )
}
