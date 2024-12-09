// path : sijarta-fe/app/api/register/route.ts

import { NextResponse } from 'next/server';

// Simulated database (replace with actual database logic)
const mockDatabase = new Map<string, { role: string; phone: string; password: string; name?: string; npwp?: string; bank?: string; accountNumber?: string }>();

interface RegisterData {
  role: 'Pelanggan' | 'Pekerja';
  phone: string;
  password: string;
  confirmPassword: string;
  name?: string;
  npwp?: string;
  bank?: string;
  accountNumber?: string;
}

export async function POST(request: Request) {
  try {
    const body: RegisterData = await request.json();

    // Extract fields from the request body
    const { role, phone, password, confirmPassword, name, npwp, bank, accountNumber } = body;

    // Validate required fields
    if (!role || !phone || !password || !confirmPassword) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    // Validate phone number length
    if (phone.length < 12 || phone.length > 13) {
      return NextResponse.json({ message: 'Phone number must be between 12 and 13 digits.' }, { status: 400 });
    }

    // Check if phone number is already registered
    if (mockDatabase.has(phone)) {
      return NextResponse.json(
        { message: 'Nomor HP telah terdaftar. Silakan login dengan akun Anda.', redirect: '/login' },
        { status: 409 } // Conflict status
      );
    }

    // Ensure passwords match
    if (password !== confirmPassword) {
      return NextResponse.json({ message: 'Passwords do not match.' }, { status: 400 });
    }

    // Validate fields for "Pekerja" role
    if (role === 'Pekerja' && (!name || !npwp || !bank || !accountNumber)) {
      return NextResponse.json({ message: 'Missing required fields for Pekerja.' }, { status: 400 });
    }

    // Simulate saving data to the database
    mockDatabase.set(phone, {
      role,
      phone,
      password,
      ...(role === 'Pekerja' && { name, npwp, bank, accountNumber }),
    });

    console.log('Registering user:', {
      role,
      phone,
      password,
      ...(role === 'Pekerja' && { name, npwp, bank, accountNumber }),
    });

    return NextResponse.json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ message: 'An error occurred during registration.' }, { status: 500 });
  }
}
