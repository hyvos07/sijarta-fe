import fs from 'fs';
import path from 'path';
import { Convert } from '@/src/db/types/pelanggan';
import { Pelanggan } from '@/src/db/types/pelanggan';
import { Pekerja } from '@/src/db/types/pekerja';

const pelangganFilePath = path.resolve('src/db/mocks/pelanggan.json');
const pekerjaFilePath = path.resolve('src/db/mocks/pekerja.json');

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
