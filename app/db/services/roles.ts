import fs from 'fs';
import path from 'path';
import { Convert } from '@/app/db/types/pelanggan';
import { Pelanggan } from '@/app/db/types/pelanggan';
import { Pekerja } from '@/app/db/types/pekerja';

const pelangganFilePath = path.resolve('app/db/mocks/pelanggan.json');
const pekerjaFilePath = path.resolve('app/db/mocks/pekerja.json');

// Fungsi untuk mendapatkan pelanggan berdasarkan ID
export async function getPelangganById(userId: string): Promise<Pelanggan | null> {
  const dataJson = fs.readFileSync(pelangganFilePath, 'utf-8');
  const data = Convert.toPelanggan(dataJson);  // Menggunakan Convert untuk memastikan data sesuai dengan model Pelanggan
  console.log('Data Pelanggan:', data);  // Cek data yang diambil setelah konversi
  console.log('Mencari ID Pelanggan:', userId);  // Cek ID yang dicari
  return data.find((pelanggan) => pelanggan.id === userId) || null;  // Cari pelanggan dengan id yang sesuai
}

// Fungsi untuk mendapatkan pekerja berdasarkan ID
export async function getPekerjaById(userId: string): Promise<Pekerja | null> {
  const data = JSON.parse(fs.readFileSync(pekerjaFilePath, 'utf-8')) as Pekerja[];  // Pekerja tidak perlu konversi
  console.log('Data Pekerja:', data);  // Cek data yang diambil
  console.log('Mencari ID Pekerja:', userId);  // Cek ID yang dicari
  return data.find((pekerja) => pekerja.id === userId) || null;  // Cari pekerja dengan id yang sesuai
}
