'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for client-side routing in the App Directory
import '../../styles/login.css';

interface UserForm {
  phone: string;
  password: string;
  confirmPassword: string;
  name?: string;
  npwp?: string;
  bank?: string;
  accountNumber?: string;
}

const RegisterPage = () => {
  const [role, setRole] = useState<'Pengguna' | 'Pekerja' | ''>(''); 
  const [formData, setFormData] = useState<UserForm>({
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const banks = ['GoPay', 'OVO', 'Virtual Account BCA', 'Virtual Account BNI', 'Virtual Account Mandiri'];

  const handleRoleSelection = (selectedRole: 'Pengguna' | 'Pekerja') => {
    setRole(selectedRole);
    setFormData({
      phone: '',
      password: '',
      confirmPassword: '',
    });
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.phone || !formData.password || !formData.confirmPassword) {
      setError('All fields are required.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    if (role === 'Pekerja' && (!formData.name || !formData.npwp || !formData.bank || !formData.accountNumber)) {
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
        if (response.status === 409 && errorData.redirect) {
          alert(errorData.message);
          router.push(errorData.redirect); // Redirect to login
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
      <h1 className="mb-9 text-2xl md:text-3xl font-semibold text-center">Register</h1>
      {!role ? (
        <div className="space-y-3">
          <button
            onClick={() => handleRoleSelection('Pengguna')}
            className="w-full px-2 py-2 md:py-2.5 bg-stone-100 text-black font-medium rounded hover:bg-white transition-transform transform hover:scale-105 active:scale-95"
          >
            Register as Pengguna
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
          {role === 'Pekerja' && (
            <>
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  placeholder="Full Name"
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
            </>
          )}
          {error && <div className="text-red-500">{error}</div>}
          <div className="w-full flex justify-center">
            <button
              type="submit"
              className="w-full py-3 bg-primary text-white rounded-lg"
            >
              Register
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RegisterPage;
