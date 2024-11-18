import { userService } from './user';
import { metodeBayarService } from './metodeBayar';
import { TrPemesananJasa, Convert } from '../types/trPemesananJasa';
import trPemesananJasaJson from '../mocks/trPemesananJasa.json';
import { trPemesananStatusService } from './trPemesananStatus';
import { subkategoriJasaService } from './subkategoriJasa';

export const trPemesananJasaService = {
    getAllPesanan: async (subKategoriId: string): Promise<TrPemesananJasa[]> => {
        const jsonString = JSON.stringify(trPemesananJasaJson);
        const trPemesananJasa = Convert.toTrPemesananJasa(jsonString);
        return trPemesananJasa.filter((tr) => tr.idKategoriJasa === subKategoriId);
    },

    getPesananWithDetails: async (subKategoriId: string): Promise<any[]> => {
        const pesanan = await trPemesananJasaService.getAllPesanan(subKategoriId);
        const filteredPesanan = pesanan.filter((pesanan) => pesanan.idKategoriJasa === subKategoriId);

        const detailedPesanan = await Promise.all(pesanan.map(async (pesanan) => {
            const pelanggan = await userService.getUserByID(pesanan.idPelanggan);
            const pekerja = await userService.getUserByID(pesanan.idPekerja);
            const subkategoriJasa = await subkategoriJasaService.getNamaSubkategoriById(pesanan.idKategoriJasa);
            const metodeBayar = await metodeBayarService.getNamaMetodeBayar(pesanan.idMetodeBayar);
            const status = await trPemesananStatusService.getStatusById(pesanan.id);

            return {
                ...pesanan,
                pelanggan: pelanggan?.nama,
                pekerja: pekerja?.nama,
                subkategori: subkategoriJasa,
                metodeBayar: metodeBayar,
                status: status,
            };
        }));

        return detailedPesanan;
    }
};