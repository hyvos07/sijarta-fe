import { NextResponse } from 'next/server';
import { Convert as convertMetodeBayar } from '@/src/db/types/metodeBayar';  // Import converter untuk metode bayar
import pool from '@/src/db/db';  // Pastikan kamu sudah mengonfigurasi koneksi database

export async function GET() {
  try {
    const client = await pool.connect();

    // Fetch data for metode bayar
    const metodeBayarResult = await client.query('SELECT * FROM metode_bayar;');

    client.release();

    // Convert rows to objects using their respective converters
    const metodeBayar = convertMetodeBayar.toTypes(JSON.stringify(metodeBayarResult.rows));

    return NextResponse.json({ metodeBayar }, { status: 200 });
  } catch (error) {
    console.error('Error fetching metode bayar data:', error);
    return NextResponse.json({ error: 'Failed to fetch metode bayar data' }, { status: 500 });
  }
}
