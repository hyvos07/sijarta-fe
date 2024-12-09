// path : sijarta-fe/src/db/models/pekerjaKategoriJasa.ts

import { PekerjaKategoriJasa, Convert } from '../types/pekerjaKategoriJasa';
import { kategoriJasaService } from './kategoriJasa';
import pekerjaKategoriJson from '../mocks/pekerjaKategoriJasa.json';
import { KategoriJasa } from '../types/kategoriJasa';

export const pekerjaKategoriJasaService = {
    getAllRelationPK: async (pekerjaID: string): Promise<PekerjaKategoriJasa[]> => {
        const jsonString = JSON.stringify(pekerjaKategoriJson);
        return Convert.toPekerjaKategoriJasa(jsonString).filter((pk) => pk.pekerjaID === pekerjaID);
    },

    getAllNamaKategoriJasaByID: async (pekerjaID: string): Promise<string[]> => {
        const pekerjaKategoriJasa = await pekerjaKategoriJasaService.getAllRelationPK(pekerjaID);
        const kategoriJasaPromises = pekerjaKategoriJasa
            .map(async (pk) => await kategoriJasaService.getNamaKategoriById(pk.kategoriJasaID));
        return Promise.all(kategoriJasaPromises);
    },

    getMapKategoriJasaByID: async (pekerjaID: string): Promise<Map<string, KategoriJasa>> => {
        const map = new Map<string, KategoriJasa>();
        const pekerjaKategoriJasa = await pekerjaKategoriJasaService.getAllRelationPK(pekerjaID);
        for (const pk of pekerjaKategoriJasa) {
            const kategori = await kategoriJasaService.getKategoriJasaById(pk.kategoriJasaID);
            map.set(pk.kategoriJasaID, kategori);
        }
        
        return map;
    }
};