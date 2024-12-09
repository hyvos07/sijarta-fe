// path: sijarta-fe/app/(auth)/register/page.tsx

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/_styles/login.css';

interface UserForm {
  name: string;
  password: string;
  confirmPassword: string;
  phone: string;
  birthDate: string;
  address: string;
  gender: 'L' | 'P';
  bank?: string;
  accountNumber?: string;
  npwp?: string;
  photoUrl?: string;
}

export default function RegisterPage() {
  const [role, setRole] = useState<'Pelanggan' | 'Pekerja' | ''>('');
  const [formData, setFormData] = useState<UserForm>({
    name: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthDate: '',
    address: '',
    gender: 'L',
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
      gender: 'L',
    });
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, gender: e.target.value as 'L' | 'P' }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.phone || !formData.password || !formData.confirmPassword || !formData.birthDate || !formData.address) {
      setError('All fields are required.');
      return false;
    }

    if (formData.phone.length < 12 || formData.phone.length > 13) {
      setError('Phone number must be between 12 and 13 digits.');
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
        body: JSON.stringify({
          role,
          ...formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409 && errorData.redirect) {
          alert(errorData.message);
          router.push('/login');
        } else {
          setError(errorData.message || 'An error occurred.');
        }
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
      <header className="flex items-center justify-center mb-9">
        <img src="/images/logo.png" alt="SIJARTA Logo" className="h-14 w-14 mr-2" />
        <h1 className="text-3xl font-bold">SIJARTA</h1>
      </header>
      
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
            <label className="block text-sm font-medium mb-2">Gender:</label>
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
                <span className="ml-2">Laki-laki</span>
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
                  <option value="">Select Bank</option>
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
                  placeholder="Photo URL"
                  className="w-full py-3 md:px-5 px-3 border border-gray-600 rounded-lg bg-transparent md:text-base text-sm focus:outline focus:outline-blue-500"
                  required
                />
              </div>
            </>
          )}

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full px-2 py-2 md:py-2.5 bg-stone-100 text-black font-medium rounded hover:bg-white mt-6"
          >
            Register
          </button>

          <p className="text-center mt-4 text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
              Login here
            </a>
          </p>
        </form>
      )}
    </div>
  );
}