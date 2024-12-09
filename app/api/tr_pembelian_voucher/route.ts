import { NextRequest, NextResponse } from 'next/server';
import { Convert as convertVoucher } from '@/src/db/types/voucher';
import pool from '@/src/db/db';
import { v4 as uuidv4 } from 'uuid';
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json(); // Ambil data dari request body
    const { jumlahHari, idPelanggan, idVoucher, idMetodeBayar } = body;

    // Validasi input
    if (!jumlahHari || !idPelanggan || !idVoucher || !idMetodeBayar) {
      return NextResponse.json({ error: 'Field transaksi tidak lengkap' }, { status: 400 });
    }

    // Set tanggal awal ke tanggal sekarang
    const tglAwal = new Date();

    // Hitung tanggal akhir dengan menambahkan jumlah hari ke tglAwal
    const tglAkhir = new Date(tglAwal);
    tglAkhir.setDate(tglAwal.getDate() + jumlahHari);

    const id = uuidv4(); // Generate UUID untuk id
    const telahDigunakan = 0; // Set default ke 0

    const client = await pool.connect();

    // Query untuk menambahkan data transaksi pembelian voucher
    await client.query(
      `
      INSERT INTO tr_pembelian_voucher (id, tgl_awal, tgl_akhir, telah_digunakan, id_pelanggan, id_voucher, id_metode_bayar)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [id, tglAwal, tglAkhir, telahDigunakan, idPelanggan, idVoucher, idMetodeBayar]
    );

    client.release();

    return NextResponse.json({ message: 'Transaksi pembelian voucher berhasil ditambahkan' }, { status: 201 });
  } catch (error) {
    console.error('Error menambahkan transaksi pembelian voucher:', error);
    return NextResponse.json({ error: 'Gagal menambahkan transaksi pembelian voucher' }, { status: 500 });
  }
}
