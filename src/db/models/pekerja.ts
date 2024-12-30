// path: sijarta-fe/src/db/models/pekerja.ts

import { Pekerja, Convert } from '../types/pekerja';
import { BaseModel } from '../model';
import pool from '../db';

interface UpdatePekerjaData {
  namaBank?: string;
  nomorRekening?: string;
  npwp?: string;
  linkFoto?: string;
}

export class PekerjaModel extends BaseModel<Pekerja> {
    constructor() {
        super('pekerja', Convert);
    }

    async updatePekerja(id: string, data: UpdatePekerjaData): Promise<void> {
        const client = await pool.connect();
        const setClauses = [];

        if (data.namaBank !== undefined) setClauses.push(`nama_bank = '${data.namaBank}'`);
        if (data.nomorRekening !== undefined) setClauses.push(`nomor_rekening = '${data.nomorRekening}'`);
        if (data.npwp !== undefined) setClauses.push(`npwp = '${data.npwp}'`);
        if (data.linkFoto !== undefined) setClauses.push(`link_foto = '${data.linkFoto}'`); // Tambahkan pembaruan link_foto

        if (setClauses.length > 0) {
            const query = `
                UPDATE ${this.table}
                SET ${setClauses.join(', ')}
                WHERE id = '${id}'
            `;
            await client.query(query);
        }

        client.release();
    }
}
