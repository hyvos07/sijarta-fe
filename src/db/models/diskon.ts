// path : sijarta-fe/src/db/models/diskon.ts

import fs from 'fs';
import path from 'path';
import { Convert } from '@/src/db/types/promo';
import { Promo } from '@/src/db/types/promo';
import { Voucher } from '@/src/db/types/voucher';
import { Convert as ConvertVoucher } from '@/src/db/types/voucher';
// Define the file paths for Promo and Voucher
const promoFilePath = path.resolve('src/db/mocks/promo.json');
const voucherFilePath = path.resolve('src/db/mocks/voucher.json');

// Fungsi untuk mendapatkan promo berdasarkan Kode
export async function getPromoByKode(kode: string): Promise<Promo[] | null> {
  const dataJson = fs.readFileSync(promoFilePath, 'utf-8');
  const data = Convert.toPromo(dataJson);  // Menggunakan Convert untuk memastikan data sesuai dengan model Promo
  console.log('Data Promo:', data);  // Cek data yang diambil setelah konversi
  console.log('Mencari Kode Promo:', kode);  // Cek kode yang dicari
  return data || null;  // Cari promo dengan kode yang sesuai
}

// Fungsi untuk mendapatkan voucher berdasarkan Kode
export async function getVoucherByKode(kode: string): Promise<Voucher[] | null> {
  const dataJson = fs.readFileSync(voucherFilePath, 'utf-8');
  const data = ConvertVoucher.toVoucher(dataJson) as Voucher[];  // Voucher tidak perlu konversi
  console.log('Data Voucher:', data);  // Cek data yang diambil
  console.log('Mencari Kode Voucher:', kode);  // Cek kode yang dicari
  return data || null;  // Cari voucher dengan kode yang sesuai
}
