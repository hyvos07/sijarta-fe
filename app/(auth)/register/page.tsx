'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for client-side routing in the App Directory
import '../../styles/login.css';

interface UserForm {
  name: string;
  password: string;
  confirmPassword: string;
  phone: string;
  birthDate: string;
  address: string;
  gender: 'L' | 'P'; // L for Laki-laki, P for Perempuan
  bank?: string;
  accountNumber?: string;
  npwp?: string;
  photoUrl?: string;
}

const RegisterPage = () => {
  const [role, setRole] = useState<'Pelanggan' | 'Pekerja' | ''>('');
  const [formData, setFormData] = useState<UserForm>({
    name: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthDate: '',
    address: '',
    gender: 'L', // Default to Laki-laki
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const banks = ['GoPay', 'OVO', 'Virtual Account BCA', 'Virtual Account BNI', 'Virtual Account Mandiri'];

  const handleRoleSelection = (selectedRole: 'Pelanggan' | 'Pekerja') => {
    setRole(selectedRole);
    setFormData({
      name: '',
      password: '',
      confirmPassword: '',
      phone: '',
      birthDate: '',
      address: '',
      gender: 'L', // Reset gender to default
    });
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, gender: e.target.value as 'L' | 'P' }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.password || !formData.confirmPassword || !formData.phone || !formData.birthDate || !formData.address) {
      setError('All fields are required.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    if (role === 'Pekerja' && (!formData.bank || !formData.accountNumber || !formData.npwp || !formData.photoUrl)) {
      setError('All fields are required for Pekerja.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role, ...formData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'An error occurred.');
        return;
      }

      alert('Registration successful!');
      router.push('/login');
    } catch (err) {
      setError('An error occurred during registration.');
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 rounded-lg w-full">
      <h1 className="mb-9 text-2xl md:text-3xl font-semibold text-center">Register</h1>
      {!role ? (
        <div className="space-y-3">
          <button
            onClick={() => handleRoleSelection('Pelanggan')}
            className="w-full px-2 py-2 md:py-2.5 bg-stone-100 text-black font-medium rounded hover:bg-white transition-transform transform hover:scale-105 active:scale-95"
          >
            Register as Pelanggan
          </button>
          <button
            onClick={() => handleRoleSelection('Pekerja')}
            className="w-full px-2 py-2 md:py-2.5 bg-stone-100 text-black font-medium rounded hover:bg-white transition-transform transform hover:scale-105 active:scale-95"
          >
            Register as Pekerja
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full py-3 md:px-5 px-3 border border-gray-600 rounded-lg bg-transparent md:text-base text-sm focus:outline focus:outline-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full py-3 md:px-5 px-3 border border-gray-600 rounded-lg bg-transparent md:text-base text-sm focus:outline focus:outline-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              className="w-full py-3 md:px-5 px-3 border border-gray-600 rounded-lg bg-transparent md:text-base text-sm focus:outline focus:outline-blue-500"
              required
            />
          </div>
          <div>
            <label>Gender: </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="L"
                checked={formData.gender === 'L'}
                onChange={handleGenderChange}
              />
              Laki-laki
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="P"
                checked={formData.gender === 'P'}
                onChange={handleGenderChange}
              />
              Perempuan
            </label>
          </div>
          <div>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone Number"
              className="w-full py-3 md:px-5 px-3 border border-gray-600 rounded-lg bg-transparent md:text-base text-sm focus:outline focus:outline-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              className="w-full py-3 md:px-5 px-3 border border-gray-600 rounded-lg bg-transparent md:text-base text-sm focus:outline focus:outline-blue-500"
              required
            />
          </div>
          <div>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="w-full py-3 md:px-5 px-3 border border-gray-600 rounded-lg bg-transparent md:text-base text-sm focus:outline focus:outline-blue-500"
              required
            />
          </div>

          {role === 'Pekerja' && (
            <>
              <div>
                <select
                  name="bank"
                  value={formData.bank || ''}
                  onChange={handleInputChange}
                  className="w-full py-3 md:px-5 px-3 border border-gray-600 rounded-lg bg-transparent md:text-base text-sm focus:outline focus:outline-blue-500"
                  required
                >
                  <option value="">Select a bank</option>
                  {banks.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber || ''}
                  onChange={handleInputChange}
                  placeholder="Bank Account Number"
                  className="w-full py-3 md:px-5 px-3 border border-gray-600 rounded-lg bg-transparent md:text-base text-sm focus:outline focus:outline-blue-500"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  name="npwp"
                  value={formData.npwp || ''}
                  onChange={handleInputChange}
                  placeholder="NPWP"
                  className="w-full py-3 md:px-5 px-3 border border-gray-600 rounded-lg bg-transparent md:text-base text-sm focus:outline focus:outline-blue-500"
                  required
                />
              </div>
              <div>
                <input
                  type="url"
                  name="photoUrl"
                  value={formData.photoUrl || ''}
                  onChange={handleInputChange}
                  placeholder="Profile Photo URL"
                  className="w-full py-3 md:px-5 px-3 border border-gray-600 rounded-lg bg-transparent md:text-base text-sm focus:outline focus:outline-blue-500"
                  required
                />
              </div>
            </>
          )}

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
          >
            Register
          </button>
        </form>
      )}
    </div>
  );
};

export default RegisterPage;
