import { MetodeBayar, Convert } from '../types/metodeBayar';
import metodeBayarJson from '../mocks/metodeBayar.json';

export const metodeBayarService = {
    getAllMetodeBayar: async (): Promise<MetodeBayar[]> => {
        const jsonString = JSON.stringify(metodeBayarJson);
        return Convert.toMetodeBayar(jsonString);
    },

    getNamaMetodeBayar: async (idMetodeBayar: string): Promise<string> => {
        const metodeBayar = await metodeBayarService.getAllMetodeBayar();
        return metodeBayar.find((m) => m.id === idMetodeBayar)?.nama || '';   
    }
};