import { BaseModel } from '../model';
import pool from '../db';
import { TrPembelianVoucher, Convert } from '../types/trPembelianVoucher';
import { UserModel } from './user';
import { MetodeBayarModel } from './metodeBayar';

export class TrPembelianVoucherModel extends BaseModel<TrPembelianVoucher> {
    constructor() {
        super('tr_pembelian_voucher', Convert);
    }

    // Get all vouchers for a specific pelanggan
    async getAllByPelanggan(idPelanggan: string): Promise<TrPembelianVoucher[]> {
        const client = await pool.connect();
        const { rows } = await client.query(`
            SELECT * FROM ${this.table}
            WHERE id_pelanggan = $1
        `, [idPelanggan]);
        client.release();
        return this.converter.toTypes(JSON.stringify(rows)) as TrPembelianVoucher[];
    }

    // Get detailed voucher data including pelanggan and metode bayar
    async getVoucherWithDetails(idPelanggan: string): Promise<any[]> {
        const client = await pool.connect();
        const { rows } = await client.query(`
            SELECT 
                tpv.*,
                mb.nama as nama_metode
            FROM tr_pembelian_voucher tpv
            LEFT JOIN METODE_BAYAR AS mb ON tpv.id_metode_bayar = mb.id
            WHERE tpv.id_pelanggan = $1
        `, [idPelanggan]);
        client.release();

        const detailedVoucher = await Promise.all(rows.map(async (row) => {
            const userModel = new UserModel();
            const pelanggan = await userModel.getById(row.idPelanggan);

            return {
                id: row.id,
                tglAwal: row.tgl_awal,
                tglAkhir: row.tgl_akhir,
                telahDigunakan: row.telah_digunakan,
                idPelanggan: row.id_pelanggan,
                idVoucher: row.id_voucher,
                idMetodeBayar: row.id_metode_bayar,
                metodeBayar: row.nama_metode,
                pelanggan: pelanggan,
            };
        }));

        return detailedVoucher;
    }
}
