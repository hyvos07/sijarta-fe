import { NextResponse } from 'next/server';
import { UserModel } from '@/src/db/models/user'; // pastikan kamu punya model User untuk mengambil data user

export async function GET(req: Request) {
  try {
    // Mengambil parameter userId dari URL
    const url = new URL(req.url);
    const userId = url.searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { role: null, data: null, error: 'userId parameter is required' },
        { status: 400 }
      );
    }

    // Mengambil data user berdasarkan userId
    const user = await new UserModel().getById(userId);

    if (!user) {
      return NextResponse.json(
        { role: null, data: null, error: 'User not found' },
        { status: 404 }
      );
    }

    // Return data sesuai dengan format User
    return NextResponse.json({
      role: 'User',
      data: {
        id: user.id,
        nama: user.nama,
        jenisKelamin: user.jenisKelamin,
        noHP: user.noHP,
        pwd: user.pwd,
        tglLahir: user.tglLahir,
        alamat: user.alamat,
        saldoMyPay: user.saldoMyPay.toString()
      },
      error: null
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error in GET /api/user:', error);
    return NextResponse.json(
      { role: null, data: null, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
