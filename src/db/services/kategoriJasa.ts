import { KategoriJasa, Convert } from '../types/kategoriJasa';
import kategoriJasaJson from '../mocks/kategoriJasa.json';

export const kategoriJasaService = {
    getAllKategori: async (): Promise<KategoriJasa[]> => {
        const jsonString = JSON.stringify(kategoriJasaJson);
        return Convert.toKategoriJasa(jsonString);
    },

    getKategoriJasaById: async (id: string): Promise<KategoriJasa> => {
        const kategori = await kategoriJasaService.getAllKategori();
        return kategori.find((k) => k.id === id) || { id: '', namaKategori: '' };
    },

    getNamaKategoriById: async (id: string): Promise<string> => {
        const kategori = await kategoriJasaService.getAllKategori();
        return kategori.find((k) => k.id === id)?.namaKategori || '';
    }
};