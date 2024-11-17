import { NextResponse } from 'next/server';

// Simulated database (replace with actual database logic)
const mockDatabase = new Map<string, { role: string; phone: string; password: string; name?: string; npwp?: string; bank?: string; accountNumber?: string }>();

interface RegisterData {
  role: 'Pelanggan' | 'Pekerja';
  phone: string;
  password: string;
  name?: string;
  npwp?: string;
  bank?: string;
  accountNumber?: string;
}

export async function POST(request: Request) {
  try {
    const body: RegisterData = await request.json();

    // Validate the received data
    const { role, phone, password, name, npwp, bank, accountNumber } = body;

    if (!role || !phone || !password) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    if (role === 'Pekerja' && (!name || !npwp || !bank || !accountNumber)) {
      return NextResponse.json({ message: 'Missing required fields for Pekerja.' }, { status: 400 });
    }

    // Check if phone number is already registered for both Pengguna and Pekerja
    if (mockDatabase.has(phone)) {
      return NextResponse.json(
        { 
          message: 'Nomor HP telah terdaftar. Silakan login dengan akun Anda.', 
          redirect: '/login' // Optional: Indicate the page to redirect to 
        },
        { status: 409 } // Conflict status
      );
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
