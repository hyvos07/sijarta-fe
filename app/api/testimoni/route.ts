import { NextRequest, NextResponse } from 'next/server';
import { Convert as convertTestimoni } from '@/src/db/types/testimoni'; // Import konverter untuk testimoni
import pool from '@/src/db/db';

export async function GET() {
  try {
    const client = await pool.connect();

    // Query untuk mengambil data testimoni
    const testimoniResult = await client.query('SELECT * FROM testimoni;');

    client.release();

    // Konversi hasil query menjadi objek menggunakan konverter
    const testimonis = convertTestimoni.toTestimoni(JSON.stringify(testimoniResult.rows));

    return NextResponse.json({ testimonis }, { status: 200 });
  } catch (error) {
    console.error('Error fetching testimoni data:', error);
    return NextResponse.json({ error: 'Failed to fetch testimoni data' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Ambil id dari URL
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
 
    if (!id) {
      return NextResponse.json({ error: 'ID pemesanan tidak ditemukan' }, { status: 400 });
    }

    const client = await pool.connect();

    // Query untuk menghapus data testimoni berdasarkan id
    const deleteResult = await client.query('DELETE FROM testimoni WHERE id_tr_pemesanan = $1 RETURNING *;', [id]);

    client.release();

    if (deleteResult.rowCount === 0) {
      return NextResponse.json({ error: 'Testimoni tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Testimoni berhasil dihapus' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting testimoni:', error);
    return NextResponse.json({ error: 'Failed to delete testimoni' }, { status: 500 });
  }
}
