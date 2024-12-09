// path: sijarta-fe/app/api/register/route.ts

import { NextResponse } from 'next/server';
import pool from '@/src/db/db';

interface RegisterData {
  role: 'Pelanggan' | 'Pekerja';
  name: string;
  password: string;
  phone: string;
  birthDate: string;
  address: string;
  gender: 'L' | 'P';
  bank?: string;
  accountNumber?: string;
  npwp?: string;
  photoUrl?: string;
}

interface DatabaseError {
  code?: string;
  constraint?: string;
  message: string;
}

export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    const body: RegisterData = await request.json();
    await client.query('BEGIN');

    const userResult = await client.query(`
      INSERT INTO "user" (nama, jenis_kelamin, no_hp, pwd, tgl_lahir, alamat, saldo_mypay)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [body.name, body.gender, body.phone, body.password, body.birthDate, body.address, 0]);

    const userId = userResult.rows[0].id;

    if (body.role === 'Pelanggan') {
      await client.query(`
        INSERT INTO pelanggan (id, level)
        VALUES ($1, 'BASIC')
      `, [userId]);
    } else {
      await client.query(`
        INSERT INTO pekerja (id, nama_bank, nomor_rekening, npwp, link_foto, rating, jml_pesanan_selesai)
        VALUES ($1, $2, $3, $4, $5, 0, 0)
      `, [userId, body.bank, body.accountNumber, body.npwp, body.photoUrl]);
    }

    await client.query('COMMIT');
    return NextResponse.json({ message: 'Registration successful', userId });

  } catch (error) {
    await client.query('ROLLBACK');
    const dbError = error as DatabaseError;
    
    if (dbError.code === '23505' && dbError.constraint === 'user_no_hp_key') {
      return NextResponse.json({ 
        message: 'Phone number already registered',
        redirect: '/login' 
      }, { status: 409 });
    }

    console.error('Registration error:', dbError.message);
    return NextResponse.json({ message: 'Registration failed' }, { status: 500 });
  } finally {
    client.release();
  }
}