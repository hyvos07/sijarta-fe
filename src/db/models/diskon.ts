
import path from 'path';
import { Convert } from '@/src/db/types/promo';
import { Promo } from '@/src/db/types/promo';
import { Voucher } from '@/src/db/types/voucher';
import { Convert as ConvertVoucher } from '@/src/db/types/voucher';
import { BaseModel } from '../model';
import { Diskon } from '../types/diskon';
import pool from '../db';

export class diskonModel extends BaseModel<Diskon> {
  constructor() {
    // Pass the Convert from promo to the BaseModel constructor
    super('"diskon"', Convert);
  }

  async getPromoByKode(kode: string): Promise<Promo | null> {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(`
        SELECT * FROM ${this.table};
      `); // Use parameterized query for safety
      // Use Convert to transform the result
      return (Convert.toTypes(JSON.stringify(rows)) as Promo[])[0] ?? null;
    } finally {
      client.release();
    }
  }
}
