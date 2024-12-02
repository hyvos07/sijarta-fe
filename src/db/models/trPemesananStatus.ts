import { TrPemesananStatus, Convert } from '../types/trPemesananStatus';
import { StatusPesananModel } from './statusPesanan';
import { BaseModel } from '../model';
import pool from '../db';

export class TrPemesananStatusModel extends BaseModel<TrPemesananStatus> {
    constructor() {
        super('tr_pemesanan_status', Convert);
    }

    async getById(idTr: string): Promise<TrPemesananStatus | null> {
        const client = await pool.connect();
        const { rows } = await pool.query(`
            SELECT * FROM ${this.table} 
            WHERE id_tr_pemesanan = '${idTr}'
        `);
        client.release();

        if (rows.length === 0) {
            return null;
        }
        return (this.converter.toTypes(JSON.stringify(rows)) as TrPemesananStatus[])[0];
    }

    async getNamaStatusById(idPesanan: string): Promise<string> {
        // This returns the latest status of the order
        const client = await pool.connect();
        const { rows } = await client.query(`
            SELECT s.status
            FROM TR_PEMESANAN_STATUS ps JOIN STATUS_PESANAN s ON ps.id_status = s.id
            WHERE ps.id_tr_pemesanan = '${idPesanan}'
            ORDER BY ps.tgl_waktu DESC
            LIMIT 1;
        `);
        client.release();

        if (rows.length === 0) {
            return 'Tidak diketahui';
        }

        return rows[0].status;
    }
}