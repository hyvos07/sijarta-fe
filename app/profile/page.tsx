'use client'

import { useState, useEffect } from 'react'

export default function ProfilePage() {
  const [role, setRole] = useState<'pengguna' | 'pekerja' | null>(null)
  const [profileData, setProfileData] = useState<any>({})
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/user')
        const data = await response.json()

        setRole(data.role)
        setProfileData(data.data)
      } catch (error) {
        console.error('Error fetching profile data:', error)
      }
    }
    fetchProfile()
  }, [])

  const handleUpdate = () => {
    // Simulasi pesan sukses tanpa mengubah database
    alert('Berhasil mengupdate data!')
    setIsEditing(false)
  }

  const renderReadOnlyField = (label: string, value: any) => (
    <div className="mb-4">
      <label className="font-bold">{label}:</label>
      <p className="text-gray-700">{value}</p>
    </div>
  )

  const renderEditableField = (label: string, value: any) => (
    <div className="mb-4">
      <label className="font-bold">{label}:</label>
      {isEditing ? (
        <input
          type="text"
          defaultValue={value}
          disabled // Field hanya untuk tampilan, tidak dapat diubah
          className="mt-2 p-2 border bg-gray-100"
        />
      ) : (
        <p className="text-gray-700">{value}</p>
      )}
    </div>
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {role === 'pengguna' && (
        <>
          {renderEditableField('Nama', profileData.name)}
          {renderReadOnlyField('Saldo MyPay', profileData.saldoMyPay)}
          {renderReadOnlyField('Level', profileData.level)}
          {renderEditableField('Email', profileData.email)}
          {renderEditableField('Alamat', profileData.alamat)}
        </>
      )}
      {role === 'pekerja' && (
        <>
          {renderEditableField('Nama', profileData.name)}
          {renderReadOnlyField('Saldo MyPay', profileData.saldoMyPay)}
          {renderReadOnlyField('Rating', profileData.rating)}
          {renderReadOnlyField('Jumlah Pesanan Selesai', profileData.jumlahPesananSelesai)}
          {renderReadOnlyField('Kategori Pekerjaan', profileData.kategoriPekerjaan)}
          {renderEditableField('Email', profileData.email)}
          {renderEditableField('Alamat', profileData.alamat)}
        </>
      )}
      <div className="mt-4">
        {isEditing ? (
          <>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              onClick={handleUpdate}
            >
              Simpan
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setIsEditing(false)}
            >
              Batal
            </button>
          </>
        ) : (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setIsEditing(true)}
          >
            Update
          </button>
        )}
      </div>
    </div>
  )
}
