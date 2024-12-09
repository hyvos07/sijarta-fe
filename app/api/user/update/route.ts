// path: sijarta-fe/app/api/user/update/route.ts

import { NextResponse } from 'next/server';
import { UserModel } from '@/src/db/models/user';
import { PelangganModel } from '@/src/db/models/pelanggan';
import { PekerjaModel } from '@/src/db/models/pekerja';
import { getUser } from '@/src/functions/getUser';

export async function PUT(request: Request) {
  try {
    const currentUser = await getUser(); // Get current authenticated user
    if (!currentUser) {
      return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.phone || !body.gender || !body.birthDate || !body.address) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Validate phone number format
    if (body.phone.length < 12 || body.phone.length > 13 || !/^\d+$/.test(body.phone)) {
      return NextResponse.json({ message: 'Invalid phone number format' }, { status: 400 });
    }

    // Check if phone number is already taken by another user
    if (body.phone !== currentUser.noHP) {
      const existingUser = await new UserModel().getUserByPhone(body.phone);
      if (existingUser && existingUser.id !== currentUser.id) {
        return NextResponse.json({ message: 'Phone number already in use' }, { status: 409 });
      }
    }

    // Update user base data
    const userModel = new UserModel();
    await userModel.updateUser(currentUser.id, {
      nama: body.name,
      noHP: body.phone,
      jenisKelamin: body.gender,
      tglLahir: body.birthDate,
      alamat: body.address,
    });

    // If user is a Pekerja, update additional fields
    if (body.role === 'pekerja') {
      const pekerjaModel = new PekerjaModel();
      await pekerjaModel.updatePekerja(currentUser.id, {
        namaBank: body.bankName,
        nomorRekening: body.bankAccount,
        npwp: body.npwp,
      });
    }

    return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}