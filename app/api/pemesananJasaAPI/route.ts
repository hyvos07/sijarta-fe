import { NextRequest, NextResponse } from 'next/server';
import { Convert as convertTrPemesananJasa } from '@/src/db/types/trPemesananJasa'; // Import converter for trPemesananJasa
import pool from '@/src/db/db'; // Ensure correct DB pool is imported

export async function GET(request: NextRequest) {
  try {
    // Extract the "id" query parameter from the request URL
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Connect to the database
    const client = await pool.connect();

    // Fetch the tr_pemesanan_jasa data by ID
    const result = await client.query('SELECT * FROM tr_pemesanan_jasa WHERE id = $1;', [id]);
    client.release();

    // If no result is found, return an error response
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'TrPemesananJasa not found' }, { status: 404 });
    }

    // Handle conversion for each field to ensure correct types
    const trPemesananJasa = result.rows.map((row) => {
      // Convert string fields like "total_biaya" to proper number type
      if (row.total_biaya && typeof row.total_biaya === 'string') {
        row.total_biaya = parseFloat(row.total_biaya); // Convert string to number
      }

      // Cek dan pastikan id_diskon tidak menyebabkan error jika null
      if (row.id_diskon === null) {
        row.id_diskon = ''; // Atur id_diskon ke string kosong jika null
      }

      // Jika ada kolom lain yang perlu divalidasi atau dikonversi, lakukan hal yang sama di sini

      return convertTrPemesananJasa.toTypes(JSON.stringify([row]))[0]; // Use the converter
    })[0]; // Since we expect one result

    // Return the result directly (without wrapping it inside an object)
    return NextResponse.json(trPemesananJasa, { status: 200 });
  } catch (error) {
    console.error('Error fetching tr_pemesanan_jasa data:', error);
    return NextResponse.json({ error: 'Failed to fetch tr_pemesanan_jasa data' }, { status: 500 });
  }
}
