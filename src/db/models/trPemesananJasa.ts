// path : sijarta-fe/src/db/models/trPemesananJasa.ts

import { UserModel } from './user';
import { MetodeBayarModel } from './metodeBayar';
import { TrPemesananJasa, Convert } from '../types/trPemesananJasa';
import { TrPemesananStatusModel } from './trPemesananStatus';
import { SubkategoriJasaModel } from './subkategoriJasa';
import { BaseModel } from '../model';
import pool from '../db';

export class TrPemesananJasaModel extends BaseModel<TrPemesananJasa> {
    constructor() {
        super('tr_pemesanan_jasa', Convert);
    }

    async getAllBySubKategori(subKategoriId: string): Promise<TrPemesananJasa[]> {
        const client = await pool.connect();
        const { rows } = await client.query(`
            SELECT * FROM ${this.table}
            WHERE id_kategori_jasa = '${subKategoriId}'
        `);
        client.release();
        return this.converter.toTypes(JSON.stringify(rows)) as TrPemesananJasa[];
    }

    async getPesananWithDetails(subKategoriId: string): Promise<any[]> {
        const client = await pool.connect();
        const { rows } = await client.query(`
            SELECT 
                tpj.*,
                skj.nama_subkategori as nama_subkategori,
                mb.nama as nama_metode,
                sp.status as nama_status
            FROM tr_pemesanan_jasa tpj
            LEFT JOIN SUBKATEGORI_JASA AS skj ON tpj.id_kategori_jasa = skj.id
            LEFT JOIN METODE_BAYAR AS mb ON tpj.id_metode_bayar = mb.id
            LEFT JOIN TR_PEMESANAN_STATUS AS tps ON tpj.id = tps.id_tr_pemesanan
            LEFT JOIN STATUS_PESANAN AS sp ON tps.id_status = sp.id
            WHERE tpj.id_kategori_jasa = '${subKategoriId}';
        `);
        client.release();

        const detailedPesanan = await Promise.all(rows.map(async (row) => {
            const userModels = new UserModel();

            const pelanggan = await userModels.getById(row.idPelanggan);
            const pekerja = await userModels.getById(row.idPekerja);

            return {
                id: row.id,
                tglPemesanan: row.tgl_pemesanan,
                tglPekerjaan: row.tgl_pekerjaan,
                waktuPekerjaan: row.waktu_pekerjaan,
                totalBiaya: row.total_biaya,
                idPelanggan: row.id_pelanggan,
                idPekerja: row.id_pekerja,
                idKategoriJasa: row.id_kategori_jasa,
                sesi: row.sesi,
                idDiskon: row.id_diskon,
                idMetodeBayar: row.id_metode_bayar,
                subkategori: row.subkategori,
                metodeBayar: row.metode_bayar,
                status: row.status,
                // Object Pelanggan dan Pekerja
                pelanggan: pelanggan,
                pekerja: pekerja,
            };
        }));

        return detailedPesanan;
    }

    async getPesananPekerja(idPekerja: string, query: string, filter: string): Promise<any[]> {
        const pesanan = await this.getAll();
        const detailedPesanan = await Promise.all(pesanan.map(async (pesanan) => {
            const pelanggan = await new UserModel().getById(pesanan.idPelanggan);
            const subkategoriJasa = await new SubkategoriJasaModel().getNamaSubkategoriById(pesanan.idKategoriJasa);
            const metodeBayar = await new MetodeBayarModel().getNamaMetodeBayar(pesanan.idMetodeBayar);
            const status = await new TrPemesananStatusModel().getNamaStatusById(pesanan.id);

            return {
                ...pesanan,
                pelanggan: pelanggan,
                subkategori: subkategoriJasa,
                metodeBayar: metodeBayar,
                status: status,
            };
        }));

        const filteredPesanan = detailedPesanan.filter((pesanan) => {
            const filterNamaJasa = query ? pesanan.subkategori.toLowerCase().includes(query.toLowerCase()) : true;
            const filterStatus = filter !== 'none' ? String(pesanan.status) === filter : true;
            const filterIdPekerja = pesanan.idPekerja === idPekerja;
            return filterNamaJasa && filterStatus && filterIdPekerja;
        });

        return filteredPesanan;
    }

    async getTagihanMyPay(idPelanggan: string): Promise<any[]> {
        const client = await pool.connect();
        const { rows } = await client.query(`
            SELECT tpj.*, skj.nama_subkategori
            FROM ${this.table} tpj
                LEFT JOIN SUBKATEGORI_JASA skj ON tpj.id_kategori_jasa = skj.id
            WHERE tpj.id_pelanggan = '${idPelanggan}'
            AND tpj.id_metode_bayar IN (
                SELECT id FROM METODE_BAYAR WHERE nama = 'MyPay'
            )
            AND tpj.id IN (
                SELECT ps.id_tr_pemesanan
                FROM TR_PEMESANAN_STATUS ps JOIN STATUS_PESANAN s ON ps.id_status = s.id
                WHERE s."status" = 'Menunggu Pembayaran'
                AND ps.tgl_waktu = (
                    SELECT MAX(tgl_waktu)
                    FROM TR_PEMESANAN_STATUS
                    WHERE id_tr_pemesanan = ps.id_tr_pemesanan
                )
            );
        `);
        client.release();

        const detailedPesanan = await Promise.all(rows.map(async (row) => {
            return {
                id: row.id,
                tglPemesanan: row.tgl_pemesanan,
                tglPekerjaan: row.tgl_pekerjaan,
                waktuPekerjaan: row.waktu_pekerjaan,
                totalBiaya: row.total_biaya,
                idPelanggan: row.id_pelanggan,
                idPekerja: row.id_pekerja,
                idKategoriJasa: row.id_kategori_jasa,
                sesi: row.sesi,
                idDiskon: row.id_diskon,
                idMetodeBayar: row.id_metode_bayar,
                subkategori: row.subkategori,
                metodeBayar: row.metode_bayar,
                status: row.status,
                namaSubkategori: row.nama_subkategori,  // Nama Subkategori
            };
        }));

        return detailedPesanan;
    }
}
