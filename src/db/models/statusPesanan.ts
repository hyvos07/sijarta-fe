import { StatusPesanan, Convert } from "../types/statusPesanan";
import { BaseModel } from "../model";
import pool from "../db";

export class StatusPesananModel extends BaseModel<StatusPesanan> {
    constructor() {
        super('status_pesanan', Convert);
    }

    async getNamaStatusById(idStatus: string): Promise<string> {
        const status = await this.getById(idStatus);
        return this.converter.toTypes<StatusPesanan>(JSON.stringify(status))[0].status ?? 'Tidak Diketahui';
    }
}