import { Pekerja, Convert } from '../types/pekerja';
import pekerjaJson from '../mocks/pekerja.json';

export const pekerjaService = {
    getAllPekerja: async (): Promise<Pekerja[]> => {
        const jsonString = JSON.stringify(pekerjaJson);
        return Convert.toPekerja(jsonString);
    },

    getPekerjaByID: async (id: string): Promise<Pekerja | null> => {
        const pekerja = await pekerjaService.getAllPekerja();
        return pekerja.find((p) => p.id === id) || null;
    },
};