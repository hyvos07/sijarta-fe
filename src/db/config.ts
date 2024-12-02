import pool from "./db";


// Seeding the database
async function seed() {
    try {
        const client = await pool.connect();

        console.log('Starting Seed Process...');
        
        // "user" table
        await client.query(`
            CREATE TABLE IF NOT EXISTS "user" (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                nama VARCHAR,
                jenis_kelamin CHAR(1) CHECK(jenis_kelamin IN ('P', 'L')),
                no_hp VARCHAR NOT NULL,
                pwd VARCHAR,
                tgl_lahir DATE,
                alamat VARCHAR,
                saldo_mypay DECIMAL
            );
        `);
        console.log('Created table "user"');


        // PELANGGAN table
        await client.query(`
            CREATE TABLE IF NOT EXISTS PELANGGAN (
                id UUID PRIMARY KEY,
                "level" VARCHAR 
                    DEFAULT 'BASIC'
                    CHECK("level" IN ('BASIC', 'SILVER', 'GOLD')),
                CONSTRAINT id
                    FOREIGN KEY (id) REFERENCES "user"(id)
                    ON DELETE RESTRICT ON UPDATE CASCADE
            );
        `);
        console.log('Created table PELANGGAN');


        // PEKERJA table
        await client.query(`
            CREATE TABLE IF NOT EXISTS PEKERJA (
                id UUID PRIMARY KEY,
                nama_bank VARCHAR,
                nomor_rekening VARCHAR,
                npwp VARCHAR,
                link_foto VARCHAR,
                rating FLOAT,
                jml_pesanan_selesai INT,
                CONSTRAINT id
                    FOREIGN KEY (id) REFERENCES "user"(id)
                    ON DELETE RESTRICT ON UPDATE CASCADE
            );
        `);
        console.log('Created table PEKERJA');


        // KATEGORI_TR_MYPAY table
        await client.query(`
            CREATE TABLE IF NOT EXISTS KATEGORI_TR_MYPAY (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                nama VARCHAR
            );
        `);
        console.log('Created table KATEGORI_TR_MYPAY');


        // KATEGORI_JASA table
        await client.query(`
            CREATE TABLE IF NOT EXISTS KATEGORI_JASA (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                nama_kategori VARCHAR
            );
        `);
        console.log('Created table KATEGORI_JASA');

        
        // TR_MYPAY table
        await client.query(`
            CREATE TABLE IF NOT EXISTS TR_MYPAY (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID,
                tgl DATE,
                nominal DECIMAL,
                kategori_id UUID,
                CONSTRAINT user_id
                    FOREIGN KEY (user_id) REFERENCES "user"(id)
                    ON DELETE RESTRICT ON UPDATE CASCADE,
                CONSTRAINT kategori_id
                    FOREIGN KEY (kategori_id) REFERENCES KATEGORI_TR_MYPAY(id)
                    ON DELETE RESTRICT ON UPDATE CASCADE
            );
        `);
        console.log('Created table TR_MYPAY');


        // PEKERJA_KATEGORI_JASA table
        await client.query(`
            CREATE TABLE IF NOT EXISTS PEKERJA_KATEGORI_JASA (
                pekerja_id UUID,
                kategori_jasa_id UUID,
                PRIMARY KEY (pekerja_id, kategori_jasa_id),
                CONSTRAINT pekerja_id
                    FOREIGN KEY (pekerja_id) REFERENCES PEKERJA(id)
                    ON DELETE RESTRICT ON UPDATE CASCADE,
                CONSTRAINT kategori_jasa_id
                    FOREIGN KEY (kategori_jasa_id) REFERENCES KATEGORI_JASA(id)
                    ON DELETE RESTRICT ON UPDATE CASCADE
            );
        `);
        console.log('Created table PEKERJA_KATEGORI_JASA');


        // SUBKATEGORI_JASA table
        await client.query(`
            CREATE TABLE IF NOT EXISTS SUBKATEGORI_JASA (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                nama_subkategori VARCHAR,
                deskripsi TEXT,
                kategori_jasa_id UUID,
                CONSTRAINT kategori_jasa_id
                    FOREIGN KEY (kategori_jasa_id) REFERENCES KATEGORI_JASA(id)
                    ON DELETE RESTRICT ON UPDATE CASCADE
            );
        `);
        console.log('Created table SUBKATEGORI_JASA');


        // SESI_LAYANAN table
        await client.query(`
            CREATE TABLE IF NOT EXISTS SESI_LAYANAN (
                subkategori_id UUID,
                sesi INT,
                harga DECIMAL,
                PRIMARY KEY(subkategori_id, sesi),
                CONSTRAINT subkategori_id
                    FOREIGN KEY (subkategori_id) REFERENCES SUBKATEGORI_JASA(id)
                    ON DELETE RESTRICT ON UPDATE CASCADE
            );
        `);
        console.log('Created table SESI_LAYANAN');


        // DISKON table
        await client.query(`
            CREATE TABLE IF NOT EXISTS DISKON (
                kode VARCHAR(50) PRIMARY KEY,
                potongan DECIMAL NOT NULL CHECK(potongan>=0),
                min_tr_pemesanan INT NOT NULL CHECK(potongan>=0)
            );
        `);
        console.log('Created table DISKON');


        // VOUCHER table
        await client.query(`
            CREATE TABLE IF NOT EXISTS VOUCHER (
                kode VARCHAR PRIMARY KEY,
                jml_hari_berlaku INT NOT NULL CHECK(jml_hari_berlaku>=0),
                kuota_penggunaan INT,
                harga DECIMAL NOT NULL CHECK(harga>=0),
                CONSTRAINT kode
                    FOREIGN KEY (kode) REFERENCES DISKON(kode)
                    ON DELETE RESTRICT ON UPDATE CASCADE
            );
        `);
        console.log('Created table VOUCHER');


        // PROMO table
        await client.query(`
            CREATE TABLE IF NOT EXISTS PROMO (
                kode VARCHAR PRIMARY KEY,
                tgl_akhir_berlaku DATE NOT NULL,
                CONSTRAINT kode
                    FOREIGN KEY (kode) REFERENCES DISKON(kode)
                    ON DELETE RESTRICT ON UPDATE CASCADE
            );
        `);
        console.log('Created table PROMO');


        // METODE_BAYAR table
        await client.query(`
            CREATE TABLE IF NOT EXISTS METODE_BAYAR (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                nama VARCHAR NOT NULL
            );
        `);
        console.log('Created table METODE_BAYAR');


        // TR_PEMBELIAN_VOUCHER table
        await client.query(`
            CREATE TABLE IF NOT EXISTS TR_PEMBELIAN_VOUCHER (
                id UUID PRIMARY KEY,
                tgl_awal DATE NOT NULL,
                tgl_akhir DATE NOT NULL,
                telah_digunakan INT NOT NULL CHECK(telah_digunakan>=0),
                id_pelanggan UUID,
                id_voucher VARCHAR,
                id_metode_bayar UUID,
                CONSTRAINT id_pelanggan
                    FOREIGN KEY (id_pelanggan) REFERENCES PELANGGAN(id)
                    ON DELETE RESTRICT ON UPDATE CASCADE,
                CONSTRAINT id_voucher
                    FOREIGN KEY (id_voucher) REFERENCES VOUCHER(kode)
                    ON DELETE RESTRICT ON UPDATE CASCADE,
                CONSTRAINT id_metode_bayar
                    FOREIGN KEY (id_metode_bayar) REFERENCES METODE_BAYAR(id)
                    ON DELETE RESTRICT ON UPDATE CASCADE
            );
        `);
        console.log('Created table TR_PEMBELIAN_VOUCHER');


        // TR_PEMESANAN_JASA table
        await client.query(`
            CREATE TABLE IF NOT EXISTS TR_PEMESANAN_JASA (
                id UUID PRIMARY KEY,
                tgl_pemesanan DATE NOT NULL,
                tgl_pekerjaan DATE NOT NULL,
                waktu_pekerjaan timestamp NOT NULL,
                total_biaya DECIMAL NOT NULL CHECK(total_biaya >=0),
                id_pelanggan UUID,
                id_pekerja UUID,
                id_kategori_jasa UUID,
                sesi INT,
                id_diskon VARCHAR(50),
                id_metode_bayar UUID,
                CONSTRAINT id_pelanggan
                    FOREIGN KEY (id_pelanggan) REFERENCES PELANGGAN(id)
                    ON DELETE RESTRICT ON UPDATE CASCADE,
                CONSTRAINT id_pekerja
                    FOREIGN KEY (id_pekerja) REFERENCES PEKERJA(id)
                    ON DELETE RESTRICT ON UPDATE CASCADE,
                CONSTRAINT id_kategori_jasa
                    FOREIGN KEY (id_kategori_jasa, sesi) REFERENCES SESI_LAYANAN(subkategori_id, sesi)
                    ON DELETE RESTRICT ON UPDATE CASCADE,
                CONSTRAINT id_diskon
                    FOREIGN KEY (id_diskon) REFERENCES DISKON(kode)
                    ON DELETE RESTRICT ON UPDATE CASCADE,
                CONSTRAINT id_metode_bayar
                    FOREIGN KEY (id_metode_bayar) REFERENCES METODE_BAYAR(id)
                    ON DELETE RESTRICT ON UPDATE CASCADE
            );
        `);
        console.log('Created table TR_PEMESANAN_JASA');


        // STATUS_PESANAN table
        await client.query(`
            CREATE TABLE IF NOT EXISTS STATUS_PESANAN (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                "status" VARCHAR(50) NOT NULL
            );
        `);
        console.log('Created table STATUS_PESANAN');


        // TR_PEMESANAN_STATUS table
        await client.query(`
            CREATE TABLE IF NOT EXISTS TR_PEMESANAN_STATUS (
                id_tr_pemesanan UUID,
                id_status UUID,
                tgl_waktu timestamp NOT NULL,
                PRIMARY KEY (id_tr_pemesanan, id_status),
                CONSTRAINT id_tr_pemesanan
                    FOREIGN KEY (id_tr_pemesanan) REFERENCES TR_PEMESANAN_JASA(id)
                    ON DELETE RESTRICT ON UPDATE CASCADE,
                CONSTRAINT id_status
                    FOREIGN KEY (id_status) REFERENCES STATUS_PESANAN(id)
                    ON DELETE RESTRICT ON UPDATE CASCADE
            );
        `);
        console.log('Created table TR_PEMESANAN_STATUS');


        // TESTIMONI table
        await client.query(`
            CREATE TABLE IF NOT EXISTS TESTIMONI (
                id_tr_pemesanan UUID,
                tgl DATE,
                teks TEXT,
                rating INT NOT NULL DEFAULT 0,
                PRIMARY KEY(id_tr_pemesanan, tgl),
                CONSTRAINT id_tr_pemesanan
                    FOREIGN KEY (id_tr_pemesanan) REFERENCES TR_PEMESANAN_JASA(id)
                    ON DELETE RESTRICT ON UPDATE CASCADE
            );
        `);
        console.log('Created table TESTIMONI');


        // Filling the tables with some initial data
        console.log('Inserting initial data into tables...');


        // KATEGORI_JASA
        await client.query(`
            INSERT INTO KATEGORI_JASA VALUES
                ('c1d070dc-9c0d-4af8-81f9-8723087b5ae0','Kebersihan Rumah'),
                ('d54404a1-5810-4883-9486-1bd600bd645d','Binatu'),
                ('96addf33-ee51-468c-b826-cc31b9180ef2','Pengasuh Anak'),
                ('b843763a-075f-46a7-9057-2f68510cb0b6','Pindahan Rumah'),
                ('a7b47102-5bd6-4eac-82a0-94fd38d8ef5a','Service Elektronik');
        `);
        console.log('Inserted data into KATEGORI_JASA');


        // SUBKATEGORI_JASA
        await client.query(`
            INSERT INTO SUBKATEGORI_JASA VALUES 
                ('9b449030-5748-46bb-b3bb-71979b6ffea5','Cuci Kering dan Setrika','Layanan binatu yang mencakup cuci kering, penyetrikaan, dan pelipatan pakaian. Cocok untuk bahan-bahan halus yang memerlukan perawatan khusus.','d54404a1-5810-4883-9486-1bd600bd645d'),
                ('2d6831c2-5b46-46e3-958b-8e568c6762f2','Pengasuh Bayi (Baby Sitter)','Layanan pengasuhan bayi profesional yang meliputi perawatan harian, makan, tidur, dan menjaga kenyamanan serta kesehatan bayi.','96addf33-ee51-468c-b826-cc31b9180ef2'),
                ('86cf46cc-2e7c-49e9-9ad8-a7aff0f5274a','Servis AC dan Kulkas','Perbaikan dan perawatan rutin untuk perangkat pendingin seperti AC dan kulkas, termasuk penggantian freon, pembersihan, dan perbaikan unit.','a7b47102-5bd6-4eac-82a0-94fd38d8ef5a'),
                ('2e6abf6d-7e03-4382-8264-f0e4689fbd39','Servis Televisi dan Audio','Layanan perbaikan untuk televisi, home theater, speaker, dan perangkat audio lain yang mencakup troubleshooting dan penggantian komponen.','a7b47102-5bd6-4eac-82a0-94fd38d8ef5a'),
                ('3d516838-2f20-4cdc-9a0e-0a70278102b3','Pembersihan Harian','Layanan kebersihan rutin yang mencakup menyapu, mengepel, membersihkan debu, dan menjaga kebersihan umum di dalam rumah setiap hari.','c1d070dc-9c0d-4af8-81f9-8723087b5ae0'),
                ('5a0590d9-d1d0-404f-8203-6420ef57e542','Jasa Bongkar Pasang Furnitur','Membantu membongkar, memindahkan, dan memasang kembali furnitur besar seperti lemari, tempat tidur, atau rak di lokasi baru.','b843763a-075f-46a7-9057-2f68510cb0b6'),
                ('b20135ee-92ee-4a62-ac5b-53c6b3423c3d','Cuci Sepatu dan Tas','Layanan khusus membersihkan sepatu, tas, dan aksesori lainnya, termasuk perawatan bahan kulit dan suede untuk menjaga kualitasnya.','d54404a1-5810-4883-9486-1bd600bd645d'),
                ('3f9ac327-3627-4718-b7b6-a0a2db8866e8','Jasa Packing Profesional','Layanan pengemasan profesional untuk memastikan barang-barang pribadi, furnitur, dan barang elektronik terlindungi selama proses pindahan.','b843763a-075f-46a7-9057-2f68510cb0b6'),
                ('03170d2f-8a86-4553-9983-9a2be1be9480','Pembersihan Halaman dan Taman','Pembersihan halaman dan taman, termasuk penyapuan daun, pengaturan tanaman, dan perawatan kebersihan area luar rumah.','c1d070dc-9c0d-4af8-81f9-8723087b5ae0'),
                ('c7fe7417-f7cf-4838-bfdf-0a7b25ac5994','Pengasuh Sementara (Backup Nanny)','Layanan pengasuh sementara yang dapat diandalkan saat pengasuh tetap sedang berhalangan, baik untuk sehari atau dalam keadaan darurat.','96addf33-ee51-468c-b826-cc31b9180ef2');
        `);
        console.log('Inserted data into SUBKATEGORI_JASA');


        // SESI_LAYANAN
        await client.query(`
            INSERT INTO SESI_LAYANAN VALUES
                ('9b449030-5748-46bb-b3bb-71979b6ffea5',1,60000),
                ('2d6831c2-5b46-46e3-958b-8e568c6762f2',1,180000),
                ('86cf46cc-2e7c-49e9-9ad8-a7aff0f5274a',1,130000),
                ('2e6abf6d-7e03-4382-8264-f0e4689fbd39',1,110000),
                ('3d516838-2f20-4cdc-9a0e-0a70278102b3',1,130000),
                ('5a0590d9-d1d0-404f-8203-6420ef57e542',1,200000),
                ('b20135ee-92ee-4a62-ac5b-53c6b3423c3d',1,70000),
                ('3f9ac327-3627-4718-b7b6-a0a2db8866e8',1,100000),
                ('03170d2f-8a86-4553-9983-9a2be1be9480',1,90000),
                ('c7fe7417-f7cf-4838-bfdf-0a7b25ac5994',1,140000),
                ('9b449030-5748-46bb-b3bb-71979b6ffea5',2,65000),
                ('2d6831c2-5b46-46e3-958b-8e568c6762f2',2,190000),
                ('3d516838-2f20-4cdc-9a0e-0a70278102b3',2,140000),
                ('5a0590d9-d1d0-404f-8203-6420ef57e542',2,210000),
                ('03170d2f-8a86-4553-9983-9a2be1be9480',2,100000),
                ('c7fe7417-f7cf-4838-bfdf-0a7b25ac5994',2,150000),
                ('9b449030-5748-46bb-b3bb-71979b6ffea5',3,70000),
                ('2d6831c2-5b46-46e3-958b-8e568c6762f2',3,200000),
                ('3d516838-2f20-4cdc-9a0e-0a70278102b3',3,150000),
                ('03170d2f-8a86-4553-9983-9a2be1be9480',3,110000),
                ('c7fe7417-f7cf-4838-bfdf-0a7b25ac5994',3,160000),
                ('2d6831c2-5b46-46e3-958b-8e568c6762f2',4,210000),
                ('3d516838-2f20-4cdc-9a0e-0a70278102b3',4,160000),
                ('03170d2f-8a86-4553-9983-9a2be1be9480',4,120000),
                ('c7fe7417-f7cf-4838-bfdf-0a7b25ac5994',4,170000),
                ('3d516838-2f20-4cdc-9a0e-0a70278102b3',5,170000),
                ('03170d2f-8a86-4553-9983-9a2be1be9480',5,130000),
                ('c7fe7417-f7cf-4838-bfdf-0a7b25ac5994',5,180000),
                ('3d516838-2f20-4cdc-9a0e-0a70278102b3',6,180000),
                ('03170d2f-8a86-4553-9983-9a2be1be9480',6,180000);
        `);
        console.log('Inserted data into SESI_LAYANAN');


        // KATEGORI_TR_MYPAY
        await client.query(`
            INSERT INTO KATEGORI_TR_MYPAY VALUES
                ('125b0aad-aadb-4dce-b6c6-dd18af82d08b','TopUp MyPay'),
                ('c5e9ab3f-5eec-40ee-8a25-bd92580954a3','Bayar transaksi jasa'),
                ('b9020f52-f5e7-4ff8-8b67-ec669f4166db','Transfer MyPay'),
                ('9a918391-62c8-4834-8d57-437516dd6db2','Terima honor'),
                ('9edc1b92-5cf4-407a-addc-52342fd65985','Withdraw MyPay ke rekening Bank');
        `);
        console.log('Inserted data into KATEGORI_TR_MYPAY');

        
        // DISKON
        await client.query(`
            INSERT INTO DISKON VALUES 
                ('WAILMER101',8000.0,10000),
                ('WAILMER102',15000.0,20000),
                ('WAILMER103',20000.0,25000),
                ('WAILMER104',60000.0,77777),
                ('WAILMER105',3000.0,5000),
                ('WAILMER106',40000.0,50000),
                ('WAILMER107',25000.0,40000),
                ('WAILMER108',30000.0,40000),
                ('WAILMER109',5000.0,10000),
                ('WAILMER110',45000.0,60000),
                ('WAILMER201',35000.0,45000),
                ('WAILMER202',30000.0,50000),
                ('WAILMER203',12000.0,20000),
                ('WAILMER204',20000.0,30000),
                ('WAILMER205',80000.0,100000),
                ('WAILMER206',50000.0,75000),
                ('WAILMER207',20000.0,45000),
                ('WAILMER208',5000.0,10000),
                ('WAILMER209',10000.0,15000),
                ('WAILMER210',20000.0,25000);
        `);
        console.log('Inserted data into DISKON');


        // VOUCHER
        await client.query(`
            INSERT INTO VOUCHER VALUES   
                ('WAILMER101',1,10,1000.0),
                ('WAILMER102',2,9,2000.0),
                ('WAILMER103',3,8,3000.0),
                ('WAILMER104',4,7,4000.0),
                ('WAILMER105',5,6,5000.0),
                ('WAILMER106',6,5,6000.0),
                ('WAILMER107',7,4,7000.0),
                ('WAILMER108',8,3,8000.0),
                ('WAILMER109',9,2,9000.0),
                ('WAILMER110',10,1,10000.0);
        `);
        console.log('Inserted data into VOUCHER');


        // PROMO
        await client.query(`
            INSERT INTO PROMO VALUES 
                ('WAILMER201','2024-05-12'),
                ('WAILMER202','2025-11-23'),
                ('WAILMER203','2023-03-07'),
                ('WAILMER204','2026-08-19'),
                ('WAILMER205','2027-01-30'),
                ('WAILMER206','2023-12-15'),
                ('WAILMER207','2025-04-03'),
                ('WAILMER208','2024-09-21'),
                ('WAILMER209','2026-02-28'),
                ('WAILMER210','2023-07-14');
        `);
        console.log('Inserted data into PROMO');


        // METODE_BAYAR
        await client.query(`
            INSERT INTO METODE_BAYAR VALUES 
                ('3db174dc-b17d-41b2-b61c-743089f642f5','MyPay'),
                ('e50c67c1-533a-4a2a-a04f-a74efa77aaeb','GoPay'),
                ('7d55fd2f-3d91-44f6-8770-46b66fad7671','OVO'),
                ('d38a6298-ca8a-40df-baec-5c63aefc7d80','Virtual Account BCA'),
                ('e8018adc-d869-41c1-84ce-182c4b5b1ab4','Virtual Account BNI'),
                ('6a73f89c-58cd-4d8a-b251-c2f7e7d61671','Virtual Account Mandiri');
        `);
        console.log('Inserted data into METODE_BAYAR');


        // STATUS_PESANAN
        await client.query(`
            INSERT INTO STATUS_PESANAN VALUES 
                ('df71e37a-628e-4115-a294-9d5f683db116','Menunggu Pembayaran'),
                ('942fc323-7400-41d1-b33f-3352ea500100','Mencari Pekerja Terdekat'),
                ('0e95bab4-5f9b-4ad7-a6fc-091e72dcfeb6','Menunggu Pekerja Berangkat'),
                ('f92d7019-d815-47fd-95e4-c4a9b7f5c708','Pekerja tiba di lokasi'),
                ('d0f43dac-78ed-4af1-9c68-a0ae79afd067','Pelayanan jasa sedang dilakukan'),
                ('7ddd2e53-e1c8-474a-b23e-045aeef12fa4','Pesanan selesai'),
                ('93e9f4dc-2f3f-490b-b890-31067a8bab4e','Pesanan dibatalkan');
        `);
        console.log('Inserted data into STATUS_PESANAN');

        await client.query(`
            INSERT INTO "user" VALUES
                ('36759dfd-b661-44b9-83ab-7cbeb42fec65','Ujang Koesman','L','087899365824','password123','2005-03-10','Jl. Kemang Raya No. 88, Bangka, Mampang Prapatan, Jakarta Selatan',1000000.0),
	            ('b57a4f4b-c0c7-45a9-8a02-104f0d8880a0','Vanessa Chintya','P','081381728925','1234567890','2003-11-09','Jl. Duren Sawit No. 14, Pondok Kelapa, Duren Sawit, Jakarta Timur',200000.0);
            INSERT INTO PELANGGAN VALUES ('36759dfd-b661-44b9-83ab-7cbeb42fec65','BASIC');
            INSERT INTO PEKERJA VALUES ('b57a4f4b-c0c7-45a9-8a02-104f0d8880a0','BCA','5220304399','751359668025758','https://dummyimage.com/npwp/9',1.8,50);
        `);
        console.log('Inserted initial user data');

        // Trigger & Stored Function Coming Soon :)

        client.release();

        // End of the seed process
        console.log('Seed Process Completed Successfully!');
    } catch (error) {
        console.error('An error occured!\n' + error);
    } finally {
        await pool.end();
    }
}


// Clearing the database
async function clear() {
    try {
        const client = await pool.connect();

        console.log('Starting to Clear the Database...');
        
        await client.query(`DROP TABLE IF EXISTS TESTIMONI CASCADE;`);
        console.log('Dropped table TESTIMONI...');

        await client.query(`DROP TABLE IF EXISTS TR_PEMESANAN_STATUS CASCADE;`);
        console.log('Dropped table TR_PEMESANAN_STATUS...');

        await client.query(`DROP TABLE IF EXISTS STATUS_PESANAN CASCADE;`);
        console.log('Dropped table STATUS_PESANAN...');

        await client.query(`DROP TABLE IF EXISTS TR_PEMESANAN_JASA CASCADE;`);
        console.log('Dropped table TR_PEMESANAN_JASA...');

        await client.query(`DROP TABLE IF EXISTS TR_PEMBELIAN_VOUCHER CASCADE;`);
        console.log('Dropped table TR_PEMBELIAN_VOUCHER...');

        await client.query(`DROP TABLE IF EXISTS METODE_BAYAR CASCADE;`);
        console.log('Dropped table METODE_BAYAR...');

        await client.query(`DROP TABLE IF EXISTS PROMO CASCADE;`);
        console.log('Dropped table PROMO...');

        await client.query(`DROP TABLE IF EXISTS VOUCHER CASCADE;`);
        console.log('Dropped table VOUCHER...');

        await client.query(`DROP TABLE IF EXISTS DISKON CASCADE;`);
        console.log('Dropped table DISKON...');

        await client.query(`DROP TABLE IF EXISTS SESI_LAYANAN CASCADE;`);
        console.log('Dropped table SESI_LAYANAN...');

        await client.query(`DROP TABLE IF EXISTS SUBKATEGORI_JASA CASCADE;`);
        console.log('Dropped table SUBKATEGORI_JASA...');

        await client.query(`DROP TABLE IF EXISTS PEKERJA_KATEGORI_JASA CASCADE;`);
        console.log('Dropped table PEKERJA_KATEGORI_JASA...');

        await client.query(`DROP TABLE IF EXISTS TR_MYPAY CASCADE;`);
        console.log('Dropped table TR_MYPAY...');

        await client.query(`DROP TABLE IF EXISTS KATEGORI_JASA CASCADE;`);
        console.log('Dropped table KATEGORI_JASA...');

        await client.query(`DROP TABLE IF EXISTS KATEGORI_TR_MYPAY CASCADE;`);
        console.log('Dropped table KATEGORI_TR_MYPAY...');

        await client.query(`DROP TABLE IF EXISTS PEKERJA CASCADE;`);
        console.log('Dropped table PEKERJA...');

        await client.query(`DROP TABLE IF EXISTS PELANGGAN CASCADE;`);
        console.log('Dropped table PELANGGAN...');

        await client.query(`DROP TABLE IF EXISTS "user" CASCADE;`);
        console.log('Dropped table "user"...');

        client.release();
        console.log('Clear Process Completed Successfully!');
    } catch (error) {
        console.error('An error occured!\n' + error);
    } finally {
        await pool.end();
    }
}

// logic here
const args = process.argv.slice(2);

if (args[0] === "seed") {
    seed();
} else if (args[0] === "clear") {
    clear();
} else {
    console.log('Invalid command. Please use "seed" or "clear"');
}