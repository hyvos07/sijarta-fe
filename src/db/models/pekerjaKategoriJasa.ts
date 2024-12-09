// path : sijarta-fe/src/db/models/pekerjaKategoriJasa.ts

import { PekerjaKategoriJasa, Convert } from '../types/pekerjaKategoriJasa';
import { KategoriJasa } from '../types/kategoriJasa';
import { BaseModel } from '../model';
import pool from '../db';

export class PekerjaKategoriJasaModel extends BaseModel<PekerjaKategoriJasa> {
    constructor() {
        super('pekerja_kategori_jasa', Convert);
    }

    async getAllKategoriById(pekerjaID: string): Promise<string[]> {
        const client = await pool.connect();
        const { rows } = await client.query(`
            SELECT kj.nama_kategori
            FROM ${this.table} pkj
            LEFT JOIN kategori_jasa kj ON pkj.kategori_jasa_id = kj.id
            WHERE pkj.pekerja_id = '${pekerjaID}'
        `);
        client.release();
        
        return rows.map(row => row.nama_kategori);
    }

    async getMapKategoriJasaByID(pekerjaID: string): Promise<Map<string, KategoriJasa>> {
        const client = await pool.connect();
        const { rows } = await client.query(`
            SELECT kj.*
            FROM ${this.table} pkj
            LEFT JOIN kategori_jasa kj ON pkj.kategori_jasa_id = kj.id
            WHERE pkj.pekerja_id = '${pekerjaID}'
        `);
        client.release();

        const map = new Map<string, KategoriJasa>();

        for (const row of rows) {
            map.set(row.id, {
                id: row.id,
                namaKategori: row.nama_kategori,
            });
        }

        return map;
    }
}