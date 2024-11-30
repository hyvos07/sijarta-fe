import { UserModel } from './user';
import { MetodeBayarModel } from './metodeBayar';
import { TrPemesananJasa, Convert } from '../types/trPemesananJasa';
import { TrPemesananStatusModel } from './trPemesananStatus';
import { SubkategoriJasaModel } from './subkategoriJasa';
import { BaseModel } from '../model';
import pool from '../db';

export class TrPemesananJasaModel extends BaseModel<TrPemesananJasa> {
    constructor() {
        super('tr_pemesanan_jasa', Convert);
    }

    async getAllBySubKategori(subKategoriId: string): Promise<TrPemesananJasa[]> {
        const all = await this.getAll();
        return all.filter((pesanan) => pesanan.idKategoriJasa === subKategoriId);
    }

    async getPesananWithDetails(subKategoriId: string): Promise<any[]> {
        const pesanan = await this.getAllBySubKategori(subKategoriId);

        const detailedPesanan = await Promise.all(pesanan.map(async (pesanan) => {
            const userModels = new UserModel();

            const pelanggan = await userModels.getById(pesanan.idPelanggan);
            const pekerja = await userModels.getById(pesanan.idPekerja);
            const subkategoriJasa = await new SubkategoriJasaModel().getNamaSubkategoriById(pesanan.idKategoriJasa);
            const metodeBayar = await new MetodeBayarModel().getNamaMetodeBayar(pesanan.idMetodeBayar);
            const status = await new TrPemesananStatusModel().getNamaStatusById(pesanan.id);

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

    async getPesananPekerja(idPekerja: string, query: string, filter: string): Promise<any[]> {
        const pesanan = await this.getAll();
        const detailedPesanan = await Promise.all(pesanan.map(async (pesanan) => {
            const pelanggan = await new UserModel().getById(pesanan.idPelanggan);
            const subkategoriJasa = await new SubkategoriJasaModel().getNamaSubkategoriById(pesanan.idKategoriJasa);
            const metodeBayar = await new MetodeBayarModel().getNamaMetodeBayar(pesanan.idMetodeBayar);
            const status = await new TrPemesananStatusModel().getNamaStatusById(pesanan.id);

            return {
                ...pesanan,
                pelanggan: pelanggan?.nama,
                subkategori: subkategoriJasa,
                metodeBayar: metodeBayar,
                status: status,
            };
        }));

        const filteredPesanan = detailedPesanan.filter((pesanan) => {
            const filterNamaJasa = query ? pesanan.subkategori.toLowerCase().includes(query.toLowerCase()) : true;
            const filterStatus = filter !== 'none' ? String(pesanan.status) === filter : true;
            const filterIdPekerja = pesanan.idPekerja === idPekerja;
            return filterNamaJasa && filterStatus && filterIdPekerja;
        });

        return filteredPesanan;
    }
}
