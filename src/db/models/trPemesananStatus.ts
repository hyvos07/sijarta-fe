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
        const { rows } = await pool.query(`SELECT * FROM ${this.table} WHERE id_tr_pemesanan = ${idTr}`);
        client.release();

        if (rows.length === 0) {
            return null;
        }
        return (this.converter.toTypes(JSON.stringify(rows)) as TrPemesananStatus[])[0];
    }

    async getNamaStatusById(idPesanan: string): Promise<string> {
        const status = await this.getById(idPesanan);
        const statusName = await new StatusPesananModel().getNamaStatusById(status?.idStatus ?? '');
        return statusName;
    }
}