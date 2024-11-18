// Mengimpor interface Pemesanan
export interface Pemesanan {
  id: number;
  subkategori: string;
  sesiLayanan: string;
  harga: number;
  namaPekerja: string;
  status: string;
  sudahMemberiTestimoni: boolean;
}
export function toPemesanan(data: string): Pemesanan[] {
  try {
    const parsedData = JSON.parse(data);

    return parsedData.map((item: any) => ({
      id: item.id,
      subkategori: item.subkategori,
      sesiLayanan: item.sesiLayanan,
      harga: item.harga,
      namaPekerja: item.namaPekerja,
      status: item.status,
      sudahMemberiTestimoni: item.sudahMemberiTestimoni,
    }));
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
}
