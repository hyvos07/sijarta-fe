import { KategoriTrMyPay, Convert } from '../types/kategoriTrMypay';
import kategoriTrMyPayJson from '../mocks/kategoriTrMypay.json';

export const kategoriTrMyPayService = {
  getAllKategori: async (): Promise<KategoriTrMyPay[]> => {
    const jsonString = JSON.stringify(kategoriTrMyPayJson);
    return Convert.toKategoriTrMyPay(jsonString);
  },

  getKategoriById: async (id: string): Promise<string> => {
    const kategori = await kategoriTrMyPayService.getAllKategori();
    return kategori.find((k) => k.id === id)?.nama || '';
  }
};