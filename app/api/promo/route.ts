import { NextResponse } from 'next/server';
import { Convert as convertPromo } from '@/src/db/types/promo';
import { Convert as convertVoucher } from '@/src/db/types/voucher';
import pool from '@/src/db/db';


export async function GET() {
  try {
    const client = await pool.connect();

    // Fetch data for promo and voucher in parallel
    const [promoResult, voucherResult] = await Promise.all([
      client.query('SELECT * FROM promo;'),
      client.query('SELECT * FROM voucher;'),
    ]);

    client.release();

    // Convert rows to objects using their respective converters
    const promos = convertPromo.toPromo(JSON.stringify(promoResult.rows));
    const vouchers = convertVoucher.toVoucher(JSON.stringify(voucherResult.rows));

    return NextResponse.json({ promos, vouchers }, { status: 200 });
  } catch (error) {
    console.error('Error fetching diskon data:', error);
    return NextResponse.json({ error: 'Failed to fetch diskon data' }, { status: 500 });
  }
}
