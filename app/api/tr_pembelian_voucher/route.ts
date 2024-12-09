import { NextResponse } from 'next/server';
import { Convert as convertVoucher } from '@/src/db/types/voucher';
import pool from '@/src/db/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userID');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const client = await pool.connect();

    // Step 1: Fetch tr_pembelian_voucher and their related vouchers (idvoucher)
    const trPembelianVoucherResult = await client.query(
      `SELECT id_voucher FROM tr_pembelian_voucher tpv WHERE tpv.id_pelanggan = $1;`,
      [userId]
    );

    // Extract the list of idvoucher from tr_pembelian_voucher
    const idVouchers = trPembelianVoucherResult.rows.map(row => row.id_voucher);

    if (idVouchers.length === 0) {
      return NextResponse.json({ error: 'No tr_pembelian_voucher data found for this user' }, { status: 404 });
    }

    // Step 2: Fetch vouchers where voucher.kode matches any of the idvouchers
    const vouchersResult = await client.query(
      `SELECT * FROM voucher WHERE kode = ANY($1::text[]);`,
      [idVouchers]
    );

    client.release();

    // Step 3: Convert the filtered vouchers to the Voucher objects
    const vouchers = convertVoucher.toVoucher(JSON.stringify(vouchersResult.rows));

    return NextResponse.json({ vouchers }, { status: 200 });
  } catch (error) {
    console.error('Error fetching trPembelianVoucher data:', error);
    return NextResponse.json({ error: 'Failed to fetch trPembelianVoucher data' }, { status: 500 });
  }
}
