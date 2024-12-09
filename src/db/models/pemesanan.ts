// path : sijarta-fe/src/db/models/pemesanan.ts

import { Pemesanan } from "../types/pemesanan";

const pemesananList: Pemesanan[] = [
  {
    id: 1,
    subkategori: "Cleaning Service",
    sesiLayanan: "2 Jam",
    harga: 100000,
    namaPekerja: "John Doe",
    status: "Menunggu Pembayaran",
    sudahMemberiTestimoni: false,
  },
  {
    id: 2,
    subkategori: "Repair Service",
    sesiLayanan: "1 Jam",
    harga: 200000,
    namaPekerja: "Jane Doe",
    status: "Pesanan Selesai",
    sudahMemberiTestimoni: false,
  },
  {
    id: 3,
    subkategori: "Moving Service",
    sesiLayanan: "5 Jam",
    harga: 500000,
    namaPekerja: "Mark Smith",
    status: "Mencari Pekerja Terdekat",
    sudahMemberiTestimoni: false,
  },
];

// Get all pemesanan
export const getPemesanan = async (): Promise<Pemesanan[]> => {
  return pemesananList;
};

// Update a pemesanan
export const updatePemesanan = async (
  id: number,
  updates: Partial<Pemesanan>
): Promise<Pemesanan | null> => {
  const index = pemesananList.findIndex((p) => p.id === id);
  if (index === -1) return null;

  pemesananList[index] = { ...pemesananList[index], ...updates };
  return pemesananList[index];
};
