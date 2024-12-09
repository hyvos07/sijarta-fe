import { Convert as ConvertTestimoni } from '@/src/db/types/testimoni'; // Import konverter untuk testimoni
import { Testimoni } from '@/src/db/types/testimoni'; // Import interface Testimoni
import { BaseModel } from '../model'; // Import BaseModel untuk kelas dasar
import pool from '../db'; // Koneksi ke database

export class TestimoniModel extends BaseModel<Testimoni> {
  constructor() {
    // Pass the Convert from testimoni to the BaseModel constructor
    super('"testimoni"', ConvertTestimoni); // Pastikan nama tabel sesuai dengan yang ada di database
  }

  // Fungsi untuk mengambil testimoni berdasarkan ID transaksi
  async getTestimoniById(id: string): Promise<Testimoni | null> {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(`
        SELECT * FROM ${this.table} WHERE "idTrPemesanan" = $1;
      `, [id]); // Menggunakan parameterized query untuk keamanan

      // Mengonversi hasil query menjadi tipe Testimoni
      return (ConvertTestimoni.toTestimoni(JSON.stringify(rows)) as Testimoni[])[0] ?? null;
    } finally {
      client.release();
    }
  }

  // Fungsi untuk mengambil semua testimoni
  async getAllTestimoni(): Promise<Testimoni[]> {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(`
        SELECT * FROM ${this.table};
      `); // Query untuk mengambil semua testimoni

      // Mengonversi hasil query menjadi array Testimoni
      return ConvertTestimoni.toTestimoni(JSON.stringify(rows)) as Testimoni[];
    } finally {
      client.release();
    }
  }
}
