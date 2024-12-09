import { NextResponse } from 'next/server';
import { Convert as convertMetodeBayar } from '@/src/db/types/metodeBayar'; // Import converter untuk metode bayar
import pool from '@/src/db/db'; // Pastikan koneksi database sudah terkonfigurasi
import { Convert as convertTrPemesananJasa } from '@/src/db/types/trPemesananJasa'; // Import converter untuk trPemesananJasa
export async function GET() {
  try {
    // Membuka koneksi ke database
    const client = await pool.connect();

    // Menjalankan query untuk mengambil data metode bayar
    const metodeBayarResult = await client.query('SELECT * FROM metode_bayar;');

    // Melepaskan koneksi ke pool agar dapat digunakan kembali
    client.release();

    // Mengonversi hasil query ke format yang sesuai dengan menggunakan converter
    const metodeBayar = convertMetodeBayar.toTypes(JSON.stringify(metodeBayarResult.rows));

    // Mengembalikan response JSON dengan data metode bayar
    return NextResponse.json({ metodeBayar }, { status: 200 });
  } catch (error) {
    // Menangkap error jika terjadi kesalahan saat pengambilan data
    console.error('Error fetching metode bayar data:', error);

    // Mengembalikan response JSON dengan pesan error
    return NextResponse.json(
      { error: 'Failed to fetch metode bayar data' },
      { status: 500 }
    );
  }
}
async function getTrPemesananJasaById(idTrPemesanan: string) {
  const client = await pool.connect();

  try {
    // Menjalankan query untuk mengambil data tr_pemesanan_jasa
    const result = await client.query('SELECT * FROM tr_pemesanan_jasa WHERE id = $1;', [idTrPemesanan]);

    // Jika data tidak ditemukan, kembalikan null
    if (result.rows.length === 0) {
      return null;
    }

    // Mengonversi hasil query ke format yang sesuai menggunakan convertTrPemesananJasa
    return convertTrPemesananJasa.toTypes(JSON.stringify(result.rows))[0];
  } catch (error) {
    console.error('Error fetching tr_pemesanan_jasa data:', error);
    throw new Error('Failed to fetch tr_pemesanan_jasa data');
  } finally {
    // Pastikan koneksi dilepas setelah query selesai
    client.release();
  }
}