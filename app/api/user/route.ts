import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { getUserFromToken } from '@/app/db/services/auth';

// Fungsi untuk memuat file JSON
const loadJSON = (filePath: string) => {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const data = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    return null; // Mengembalikan null jika terjadi error
  }
};

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { role: null, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json(
        { role: null, data: null, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Memuat data JSON
    const users = loadJSON('app/db/mocks/user.json');
    const pelanggan = loadJSON('app/db/mocks/pelanggan.json');
    const pekerja = loadJSON('app/db/mocks/pekerja.json');

    if (!users || !pelanggan || !pekerja) {
      return NextResponse.json(
        { role: null, data: null, error: 'Data file missing' },
        { status: 500 }
      );
    }

    // Mencari data pengguna berdasarkan ID
    const currentUser = users.find((u: any) => u.Id === user.id);

    if (!currentUser) {
      return NextResponse.json(
        { role: null, data: null, error: 'User not found' },
        { status: 404 }
      );
    }

    // Cek apakah ID ada di pelanggan.json
    const isPelanggan = pelanggan.some((p: any) => p.Id === user.id);

    if (isPelanggan) {
      return NextResponse.json(
        { role: 'pelanggan', data: { name: currentUser.Nama }, error: null },
        { status: 200 }
      );
    }

    // Cek apakah ID ada di pekerja.json
    const isPekerja = pekerja.some((p: any) => p.Id === user.id);

    if (isPekerja) {
      return NextResponse.json(
        { role: 'pekerja', data: { name: currentUser.Nama }, error: null },
        { status: 200 }
      );
    }

    // Jika tidak ditemukan di kedua file
    return NextResponse.json(
      { role: 'Unknown', data: null, error: null },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in GET /api/user:', error);
    return NextResponse.json(
      { role: null, data: null, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
