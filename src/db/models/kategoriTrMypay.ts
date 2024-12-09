// path : sijarta-fe/src/db/models/kategoriTrMypay.ts


import pool from '../db';
import { BaseModel } from '../model';
import { KategoriTrMyPay, Convert } from '../types/kategoriTrMypay';

export class KategoriTrMyPayModel extends BaseModel<KategoriTrMyPay> {
  constructor() {
    super('kategori_tr_mypay', Convert);
  }

  async getIdByName(nama: string): Promise<string | null>{
    const client = await pool.connect();
    const idKategori = await client.query(`
        SELECT id FROM ${this.table}
        WHERE nama = '${nama}'
    `);
    client.release();

    return idKategori.rows[0]?.id ?? null;
  }
}