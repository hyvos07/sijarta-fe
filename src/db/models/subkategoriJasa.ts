import { SubkategoriJasa, Convert } from '../types/subkategoriJasa';
import { BaseModel } from '../model';
import pool from '../db';

export class SubkategoriJasaModel extends BaseModel<SubkategoriJasa> {
    constructor() {
        super('subkategori_jasa', Convert);
    }

    async getAllByKategori(kategoriId: string): Promise<SubkategoriJasa[]> {
        const client = await pool.connect();
        const { rows } = await client.query(`
            SELECT * FROM ${this.table}
            WHERE kategori_jasa_id = '${kategoriId}'
        `);
        client.release();

        return this.converter.toTypes(JSON.stringify(rows)) as SubkategoriJasa[];
    }

    async getAllNamaSubkategori(kategoriId: string): Promise<string[]> {
        const client = await pool.connect();
        const { rows } = await client.query(`
            SELECT nama_subkategori FROM ${this.table}
            WHERE kategori_jasa_id = '${kategoriId}'
        `);
        client.release();

        return rows.map((row) => row.nama_subkategori);
    }

    async getNamaSubkategoriById(id: string): Promise<string> {
        const client = await pool.connect();
        const { rows } = await client.query(`
            SELECT nama_subkategori FROM ${this.table}
            WHERE id = '${id}'
        `);
        client.release();

        return rows[0].nama_subkategori;
    }
}