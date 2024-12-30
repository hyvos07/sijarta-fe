// path : sijarta-fe/app/api/user/route.tsx
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUser } from '@/src/functions/getUser';
import { PelangganModel } from '@/src/db/models/pelanggan';
import { PekerjaModel } from '@/src/db/models/pekerja';

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

    const user = await getUser();

    if (user === null) {
      return NextResponse.json(
        { role: null, data: null, error: 'Invalid Token' },
        { status: 404 }
      );
    }

    const isPelanggan = await new PelangganModel().getById(user.id);
    const isPekerja = await new PekerjaModel().getById(user.id);

    // Prepare full user data
    if (isPelanggan) {
      return NextResponse.json({
        role: 'pelanggan',
        data: {
          userID: user.id,
          name: user.nama,
          gender: user.jenisKelamin,
          phone: user.noHP,
          birthdate: user.tglLahir,
          address: user.alamat,
          mypayBalance: user.saldoMyPay.toString(),
          level: isPelanggan.level,
        },
        error: null
      }, { status: 200 });
    } else if (isPekerja) {
      return NextResponse.json({
        role: 'pekerja',
        data: {
          userID: user.id,
          name: user.nama,
          gender: user.jenisKelamin,
          phone: user.noHP,
          birthdate: user.tglLahir,
          address: user.alamat,
          mypayBalance: user.saldoMyPay.toString(),
          linkFoto: isPekerja.linkFoto,
          bankName: isPekerja.namaBank,
          bankAccount: isPekerja.nomorRekening,
          npwp: isPekerja.npwp,
          rating: isPekerja.rating,
          ordersCompleted: isPekerja.jmlPesananSelesai,
        },
        error: null
      }, { status: 200 });
    }

    // Jika tidak ada kecocokan, kembalikan status unknown user
    return NextResponse.json(
      { role: 'Unknown User', data: null, error: null },
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