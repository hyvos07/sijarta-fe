import { SubkategoriJasa, Convert } from '../types/subkategoriJasa';
import subkategoriJasaJson from '../mocks/subkategoriJasa.json';

export const subkategoriJasaService = {
    getAllSubkategori: async (idKategori: string): Promise<SubkategoriJasa[]> => {
        const jsonString = JSON.stringify(subkategoriJasaJson);
        return Convert.toSubkategoriJasa(jsonString).filter((s) => s.kategoriJasaID === idKategori);
    },

    getAllNamaSubkategori: async (idKategori: string): Promise<string[]> => {
        const subkategori = await subkategoriJasaService.getAllSubkategori(idKategori);
        return subkategori.map((k) => k.namaSubKategori);
    },

    getNamaSubkategoriById: async (id: string): Promise<string> => {
        const jsonString = JSON.stringify(subkategoriJasaJson);
        const subkategori = Convert.toSubkategoriJasa(jsonString);
        return subkategori.find((k) => k.id === id)?.namaSubKategori || '';
    }
};