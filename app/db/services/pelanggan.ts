import { Pelanggan, Convert } from '../types/pelanggan';
import pelangganJson from '../mocks/pelanggan.json';

export const pelangganService = {
    getAllPelanggan: async (): Promise<Pelanggan[]> => {
        const jsonString = JSON.stringify(pelangganJson);
        return Convert.toPelanggan(jsonString);
    },

    getPelangganByID: async (id: string): Promise<Pelanggan | null> => {
        const pelanggan = await pelangganService.getAllPelanggan();
        return pelanggan.find((p) => p.id === id) || null;
    },
};