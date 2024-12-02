import { SubkategoriJasa, Convert } from '../types/subkategoriJasa';
import { BaseModel } from '../model';

export class SubkategoriJasaModel extends BaseModel<SubkategoriJasa> {
    constructor() {
        super('subkategori_jasa', Convert);
    }

    async getAllByKategori(kategoriId: string): Promise<SubkategoriJasa[]> {
        const all = await this.getAll();
        return all.filter((subkategori) => subkategori.kategoriJasaID === kategoriId);
    }

    async getAllNamaSubkategori(kategoriId: string): Promise<string[]> {
        const subkategori = await this.getAllByKategori(kategoriId);
        return subkategori.map((k) => k.namaSubKategori);
    }

    async getNamaSubkategoriById(id: string): Promise<string> {
        const subkategori = await this.getById(id);
        return this.converter.toTypes<SubkategoriJasa>(JSON.stringify(subkategori))[0].namaSubKategori ?? 'Tidak Diketahui';
    }
}