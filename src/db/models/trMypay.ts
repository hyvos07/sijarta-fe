// path : sijarta-fe/src/db/models/trMypay.ts

import { TrMyPay, Convert } from '../types/trMypay';
import { BaseModel } from '../model';
import pool from '../db';

export class TrMyPayModel extends BaseModel<TrMyPay> {
  constructor() {
    super('tr_mypay', Convert);
  }

  async getTransaksiByUserID(userID: string): Promise<TrMyPay[]> {
    const client = await pool.connect();
    const { rows } = await client.query(`
      SELECT * FROM TR_MYPAY
      WHERE user_id = '${userID}'
      ORDER BY tgl DESC
    `);
    client.release();

    return this.converter.toTypes(JSON.stringify(rows)) as TrMyPay[]
  }

  async createNewTr(userID: string, kategoriID: string, nominal: number, date: string): Promise<Boolean> {
    try {
      const client = await pool.connect();
      await client.query(`
        INSERT INTO ${this.table} (user_id, tgl, nominal, kategori_id)
        VALUES (
          '${userID}',
          '${date}',
          ${nominal},
          '${kategoriID}'
        )
      `);
      client.release();
      return true;
    } catch (error) {
      return false;
    }
  }
}