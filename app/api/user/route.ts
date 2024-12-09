// path : sijarta-fe/app/api/user/route.tsx
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { getUserFromToken } from '@/src/functions/getUser';

const loadJSON = (filePath: string) => {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const data = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    return null;
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

    // Load data JSON
    const users = loadJSON('src/db/mocks/user.json');
    const pelanggan = loadJSON('src/db/mocks/pelanggan.json');
    const pekerja = loadJSON('src/db/mocks/pekerja.json');

    if (!users || !pelanggan || !pekerja) {
      return NextResponse.json(
        { role: null, data: null, error: 'Data file missing' },
        { status: 500 }
      );
    }

    // Find user data based on ID
    const currentUser = users.find((u: any) => u.Id === user.id);
    const isPelanggan = pelanggan.find((p: any) => p.Id === user.id);
    const isPekerja = pekerja.find((p: any) => p.Id === user.id);

    if (!currentUser) {
      return NextResponse.json(
        { role: null, data: null, error: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare full user data
    if (isPelanggan) {
      return NextResponse.json({
        role: 'pelanggan',
        data: {
          name: currentUser.Nama,
          gender: currentUser.JenisKelamin,
          phone: currentUser.NoHP,
          birthdate: currentUser.TglLahir,
          address: currentUser.Alamat,
          mypayBalance: currentUser.SaldoMyPay.toString(),
          level: isPelanggan.Level
        },
        error: null
      }, { status: 200 });
    }

    if (isPekerja) {
      return NextResponse.json({
        role: 'pekerja',
        data: {
          name: currentUser.Nama,
          gender: currentUser.JenisKelamin,
          phone: currentUser.NoHP,
          birthdate: currentUser.TglLahir,
          address: currentUser.Alamat,
          mypayBalance: currentUser.SaldoMyPay.toString(),
          bankName: isPekerja.NamaBank,
          bankAccount: isPekerja.NomorRekening,
          npwp: isPekerja.NPWP,
          rating: isPekerja.Rating,
          ordersCompleted: isPekerja.JmlPesananSelesai
        },
        error: null
      }, { status: 200 });
    }

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