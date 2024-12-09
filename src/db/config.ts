// path : sijarta-fe/src/db/types/config.ts

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
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
                ('23e115b7-ebef-48a6-be35-725f3ad92744','Budiono Siregar','L','088902387726','akuCintaLestari','1983-03-12','Jl. Sudirman No. 45, Karet Tengsin, Tanah Abang, Jakarta Pusat',100000.0),
                ('36759dfd-b661-44b9-83ab-7cbeb42fec65','Ujang Koesman','L','087899365824','password123','2005-03-10','Jl. Kemang Raya No. 88, Bangka, Mampang Prapatan, Jakarta Selatan',100000.0),
                ('f20104d8-a4b8-47c2-b337-7d3c2b9c2a63','Indra Ridwan Lesmana','L','089798375532','k3b4kar4N','1997-09-30','Jl. Gajah Mada No. 12, Glodok, Taman Sari, Jakarta Barat',100000.0),
                ('6dcee1e7-8e68-4b53-b300-171352434f92','Lestari','P','081881879342','kerjakerjakerja','2009-06-18','Jl. Thamrin No. 10, Kebon Melati, Menteng, Jakarta Pusat',600000.0),
                ('1fa544e3-ba14-4a28-a3cd-ba37eddb8279','Rebecca Simarmata','P','089923974923','akuPunya20JTpower','1982-07-21','Jl. Panglima Polim No. 72, Melawai, Kebayoran Baru, Jakarta Selatan',100000.0),
                ('57544a2d-1156-43ae-ae7d-618a3ad626fa','Eko Raharjo Iskandar','L','085291274923','#sebanyakmungk1n','2004-01-08','Jl. Pluit Utara No. 19, Pluit, Penjaringan, Jakarta Utara',100000.0),
                ('811eeec2-4f35-49f3-bcd5-a74522f3251f','Iskandar Ling','P','083312338845','W1LLSm1th','1958-12-06','Jl. Matraman Raya No. 99, Utan Kayu Selatan, Matraman, Jakarta Timur',100000.0),
                ('c5504d97-40ac-4801-9c0f-9d5c90ffefec','Andrew Hutagalung','L','081847058842','w34kENT1TY','2007-06-21','Jl. Kuningan Barat No. 55, Kuningan, Setiabudi, Jakarta Selatan',100000.0),
                ('3c0d1ed8-1339-4afa-b7c9-475cdd7c2ca9','Angela Kestari','P','089642372352','@kank@hm@dg@','2007-02-24','Jl. Kota Bambu Selatan No. 31, Kota Bambu, Palmerah, Jakarta Barat',100000.0),
                ('b57a4f4b-c0c7-45a9-8a02-104f0d8880a0','Vanessa Chintya','P','081381728925','1234567890','2003-11-09','Jl. Duren Sawit No. 14, Pondok Kelapa, Duren Sawit, Jakarta Timur',100000.0);
        `);
        console.log('Inserted initial user data');
        
        await client.query(`
            INSERT INTO PELANGGAN VALUES
                ('23e115b7-ebef-48a6-be35-725f3ad92744','BASIC'),
                ('36759dfd-b661-44b9-83ab-7cbeb42fec65','BASIC'),
                ('f20104d8-a4b8-47c2-b337-7d3c2b9c2a63','BASIC'),
                ('6dcee1e7-8e68-4b53-b300-171352434f92','BASIC'),
                ('1fa544e3-ba14-4a28-a3cd-ba37eddb8279','BASIC');
        `);
        console.log('Inserted initial PELANGGAN data');
        
        await client.query(`
            INSERT INTO PEKERJA VALUES
                ('57544a2d-1156-43ae-ae7d-618a3ad626fa','BRI','540695113','405319382379672','https://dummyimage.com/npwp/0',0,0),
                ('811eeec2-4f35-49f3-bcd5-a74522f3251f','MANDIRI','1310007977954','407961060757403','https://dummyimage.com/npwp/1',0,0),
                ('c5504d97-40ac-4801-9c0f-9d5c90ffefec','BRI','379701509787534','877794206274467','https://dummyimage.com/npwp/2',0,0),
                ('3c0d1ed8-1339-4afa-b7c9-475cdd7c2ca9','BNI','196660532','900407087325812','https://dummyimage.com/npwp/3',0,0),
                ('b57a4f4b-c0c7-45a9-8a02-104f0d8880a0','BCA','5220304399','751359668025758','https://dummyimage.com/npwp/9',0,0);
        `);
        console.log('Inserted initial PEKERJA data');
        
        await client.query(`
            INSERT INTO PEKERJA_KATEGORI_JASA VALUES 
                ('57544a2d-1156-43ae-ae7d-618a3ad626fa','96addf33-ee51-468c-b826-cc31b9180ef2'),
                ('811eeec2-4f35-49f3-bcd5-a74522f3251f','d54404a1-5810-4883-9486-1bd600bd645d'),
                ('c5504d97-40ac-4801-9c0f-9d5c90ffefec','c1d070dc-9c0d-4af8-81f9-8723087b5ae0'),
                ('3c0d1ed8-1339-4afa-b7c9-475cdd7c2ca9','c1d070dc-9c0d-4af8-81f9-8723087b5ae0'),
                ('b57a4f4b-c0c7-45a9-8a02-104f0d8880a0','d54404a1-5810-4883-9486-1bd600bd645d'),
                ('811eeec2-4f35-49f3-bcd5-a74522f3251f','a7b47102-5bd6-4eac-82a0-94fd38d8ef5a'),
                ('c5504d97-40ac-4801-9c0f-9d5c90ffefec','b843763a-075f-46a7-9057-2f68510cb0b6'),
                ('811eeec2-4f35-49f3-bcd5-a74522f3251f','96addf33-ee51-468c-b826-cc31b9180ef2'),
                ('57544a2d-1156-43ae-ae7d-618a3ad626fa','a7b47102-5bd6-4eac-82a0-94fd38d8ef5a'),
                ('3c0d1ed8-1339-4afa-b7c9-475cdd7c2ca9','b843763a-075f-46a7-9057-2f68510cb0b6');
        `);
        console.log('Inserted initial PEKERJA_KATEGORI_JASA data');
        
        await client.query(`
            INSERT INTO TR_PEMBELIAN_VOUCHER VALUES 
                ('6c45db78-105a-4548-a9f8-c3a93123829c','2024-05-10','2024-05-11',7,'23e115b7-ebef-48a6-be35-725f3ad92744','WAILMER101','e50c67c1-533a-4a2a-a04f-a74efa77aaeb'),
                ('1663bfa9-7165-4e82-843c-3a9ce6ca90ab','2024-05-12','2024-05-14',6,'36759dfd-b661-44b9-83ab-7cbeb42fec65','WAILMER102','d38a6298-ca8a-40df-baec-5c63aefc7d80'),
                ('68f79b0a-75f9-4a7f-9b5b-5bd42594b96a','2024-05-14','2024-05-17',4,'f20104d8-a4b8-47c2-b337-7d3c2b9c2a63','WAILMER103','d38a6298-ca8a-40df-baec-5c63aefc7d80'),
                ('f8a53c4a-29e0-4ceb-b1a3-23a2963af83a','2024-05-16','2024-05-20',1,'36759dfd-b661-44b9-83ab-7cbeb42fec65','WAILMER104','e50c67c1-533a-4a2a-a04f-a74efa77aaeb'),
                ('b287c610-3504-46ff-9c0e-2c78909a7aa0','2024-05-18','2024-05-23',3,'6dcee1e7-8e68-4b53-b300-171352434f92','WAILMER105','d38a6298-ca8a-40df-baec-5c63aefc7d80'),
                ('caff81a3-52c4-4b11-913a-4b9f1e829e76','2024-05-20','2024-05-26',4,'f20104d8-a4b8-47c2-b337-7d3c2b9c2a63','WAILMER106','e50c67c1-533a-4a2a-a04f-a74efa77aaeb'),
                ('84405ce8-90e2-4e11-8b9c-d8c5f131c12d','2024-05-22','2024-05-29',2,'36759dfd-b661-44b9-83ab-7cbeb42fec65','WAILMER107','e50c67c1-533a-4a2a-a04f-a74efa77aaeb'),
                ('8f62563a-eb1f-4acd-941c-c812f8b1c74d','2024-05-24','2024-06-01',1,'6dcee1e7-8e68-4b53-b300-171352434f92','WAILMER108','d38a6298-ca8a-40df-baec-5c63aefc7d80'),
                ('8ca882b1-59b7-4d8c-9ae9-2cdb03c98426','2024-05-26','2024-06-04',0,'36759dfd-b661-44b9-83ab-7cbeb42fec65','WAILMER109','e50c67c1-533a-4a2a-a04f-a74efa77aaeb'),
                ('310c44ed-04a5-4a4b-9963-0c98405d0499','2024-05-28','2024-06-07',0,'f20104d8-a4b8-47c2-b337-7d3c2b9c2a63','WAILMER110','7d55fd2f-3d91-44f6-8770-46b66fad7671'),
                ('c9fa65f6-c3ad-4bed-b7c6-31edfbc5009d','2024-05-30','2024-06-03',3,'1fa544e3-ba14-4a28-a3cd-ba37eddb8279','WAILMER104','e8018adc-d869-41c1-84ce-182c4b5b1ab4'),
                ('7e64b13b-644c-4829-b2cd-8df60f7e9db6','2024-06-01','2024-06-05',2,'1fa544e3-ba14-4a28-a3cd-ba37eddb8279','WAILMER105','e8018adc-d869-41c1-84ce-182c4b5b1ab4'),
                ('6e7f09c5-02d2-456f-a185-355383f3efcc','2024-06-03','2024-06-09',3,'36759dfd-b661-44b9-83ab-7cbeb42fec65','WAILMER106','d38a6298-ca8a-40df-baec-5c63aefc7d80'),
                ('1b899b87-d544-4b14-af83-d4ade74ad453','2024-06-05','2024-06-12',2,'1fa544e3-ba14-4a28-a3cd-ba37eddb8279','WAILMER107','e8018adc-d869-41c1-84ce-182c4b5b1ab4'),
                ('4243a213-9dd0-4ffd-b5c9-0bd02922f87e','2024-06-07','2024-06-08',8,'f20104d8-a4b8-47c2-b337-7d3c2b9c2a63','WAILMER101','e50c67c1-533a-4a2a-a04f-a74efa77aaeb'),
                ('b1c81568-863f-4083-ac55-39f9c01f62d2','2024-06-09','2024-06-11',6,'6dcee1e7-8e68-4b53-b300-171352434f92','WAILMER102','d38a6298-ca8a-40df-baec-5c63aefc7d80'),
                ('e7c1b599-4956-4140-8743-de17ae1e4a4b','2024-06-11','2024-06-14',7,'1fa544e3-ba14-4a28-a3cd-ba37eddb8279','WAILMER103','e8018adc-d869-41c1-84ce-182c4b5b1ab4'),
                ('2bbdad4e-b678-4fd4-b530-ab0e28e5753a','2024-06-13','2024-06-17',2,'f20104d8-a4b8-47c2-b337-7d3c2b9c2a63','WAILMER104','6a73f89c-58cd-4d8a-b251-c2f7e7d61671');
        `);
        console.log('Inserted initial TR_PEMBELIAN_VOUCHER data');
        
        await client.query(`
            INSERT INTO TR_PEMESANAN_JASA VALUES
                ('6a81a88a-0d7a-49f6-9bf1-7cb0ad2eb64a','2024-10-16','2024-10-18','2024-10-18 12:00:00',125000.0,'36759dfd-b661-44b9-83ab-7cbeb42fec65','57544a2d-1156-43ae-ae7d-618a3ad626fa','c7fe7417-f7cf-4838-bfdf-0a7b25ac5994',2,'WAILMER202','e50c67c1-533a-4a2a-a04f-a74efa77aaeb'),
                ('6adccc5f-1f98-46ed-8ddd-7c3fd399da4d','2024-10-15','2024-10-16','2024-10-16 11:30:00',105000.0,'23e115b7-ebef-48a6-be35-725f3ad92744','c5504d97-40ac-4801-9c0f-9d5c90ffefec','3f9ac327-3627-4718-b7b6-a0a2db8866e8',1,NULL,'7d55fd2f-3d91-44f6-8770-46b66fad7671'),
                ('d35fa14d-da51-4ee6-841d-89c0b02f8f4a','2024-10-14','2024-10-14','2024-10-14 07:30:00',20000.0,'f20104d8-a4b8-47c2-b337-7d3c2b9c2a63','811eeec2-4f35-49f3-bcd5-a74522f3251f','9b449030-5748-46bb-b3bb-71979b6ffea5',1,'WAILMER110','d38a6298-ca8a-40df-baec-5c63aefc7d80'),
                ('60468f31-7751-4e76-a572-c0b89ef01c5d','2024-10-13','2024-10-14','2024-10-14 13:30:00',185000.0,'6dcee1e7-8e68-4b53-b300-171352434f92','57544a2d-1156-43ae-ae7d-618a3ad626fa','2d6831c2-5b46-46e3-958b-8e568c6762f2',1,NULL,'6a73f89c-58cd-4d8a-b251-c2f7e7d61671'),
                ('d862b12d-56a4-4efe-a4a4-7e317f6392b4','2024-10-12','2024-10-12','2024-10-12 11:00:00',135000.0,'23e115b7-ebef-48a6-be35-725f3ad92744','57544a2d-1156-43ae-ae7d-618a3ad626fa','86cf46cc-2e7c-49e9-9ad8-a7aff0f5274a',1,NULL,'7d55fd2f-3d91-44f6-8770-46b66fad7671'),
                ('db3fd92b-a67d-4716-8358-d84e5cb64e15','2024-10-11','2024-10-11','2024-10-11 14:30:00',65000.0,'f20104d8-a4b8-47c2-b337-7d3c2b9c2a63','3c0d1ed8-1339-4afa-b7c9-475cdd7c2ca9','03170d2f-8a86-4553-9983-9a2be1be9480',1,'WAILMER202','e50c67c1-533a-4a2a-a04f-a74efa77aaeb'),
                ('ac35773d-beff-4a6b-80ae-0b94569362fc','2024-10-10','2024-10-10','2024-10-10 14:30:00',75000.0,'23e115b7-ebef-48a6-be35-725f3ad92744','811eeec2-4f35-49f3-bcd5-a74522f3251f','b20135ee-92ee-4a62-ac5b-53c6b3423c3d',1,NULL,'3db174dc-b17d-41b2-b61c-743089f642f5'),
                ('a3b061c9-38ec-4c8a-afa5-b9a27cff060c','2024-10-09','2024-10-09','2024-10-09 12:00:00',175000.0,'36759dfd-b661-44b9-83ab-7cbeb42fec65','3c0d1ed8-1339-4afa-b7c9-475cdd7c2ca9','3d516838-2f20-4cdc-9a0e-0a70278102b3',5,NULL,'3db174dc-b17d-41b2-b61c-743089f642f5'),
                ('d64222a8-b3ad-4690-8088-6f7fd535c87e','2024-10-08','2024-10-08','2024-10-08 10:00:00',85000.0,'f20104d8-a4b8-47c2-b337-7d3c2b9c2a63','811eeec2-4f35-49f3-bcd5-a74522f3251f','2e6abf6d-7e03-4382-8264-f0e4689fbd39',1,'WAILMER202','3db174dc-b17d-41b2-b61c-743089f642f5'),
                ('41b084bf-685c-4e13-a046-079d2bbd2ac8','2024-10-07','2024-10-07','2024-10-07 08:30:00',185000.0,'6dcee1e7-8e68-4b53-b300-171352434f92','3c0d1ed8-1339-4afa-b7c9-475cdd7c2ca9','03170d2f-8a86-4553-9983-9a2be1be9480',6,NULL,'3db174dc-b17d-41b2-b61c-743089f642f5'),
                ('5e03227e-0a66-459d-9494-864f6d9647d0','2024-10-06','2024-10-06','2024-10-06 22:00:00',135000.0,'1fa544e3-ba14-4a28-a3cd-ba37eddb8279','57544a2d-1156-43ae-ae7d-618a3ad626fa','86cf46cc-2e7c-49e9-9ad8-a7aff0f5274a',1,NULL,'3db174dc-b17d-41b2-b61c-743089f642f5'),
                ('fac18c07-1db1-444c-8ae9-d8abab217d4c','2024-10-05','2024-10-05','2024-10-05 14:30:00',140000.0,'6dcee1e7-8e68-4b53-b300-171352434f92','c5504d97-40ac-4801-9c0f-9d5c90ffefec','3d516838-2f20-4cdc-9a0e-0a70278102b3',3,'WAILMER102','6a73f89c-58cd-4d8a-b251-c2f7e7d61671'),
                ('39612ca3-0ba4-43b8-a9ba-97a7f94b3538','2024-10-04','2024-10-04','2024-10-04 04:00:00',65000.0,'23e115b7-ebef-48a6-be35-725f3ad92744','b57a4f4b-c0c7-45a9-8a02-104f0d8880a0','9b449030-5748-46bb-b3bb-71979b6ffea5',1,NULL,'7d55fd2f-3d91-44f6-8770-46b66fad7671'),
                ('bf8b93d6-9931-4b69-84ee-96e7133e59c5','2024-10-03','2024-10-03','2024-10-03 10:30:00',45000.0,'f20104d8-a4b8-47c2-b337-7d3c2b9c2a63','811eeec2-4f35-49f3-bcd5-a74522f3251f','b20135ee-92ee-4a62-ac5b-53c6b3423c3d',1,'WAILMER202','d38a6298-ca8a-40df-baec-5c63aefc7d80'),
                ('7090bb4f-542e-4768-9fa5-c302545d0486','2024-10-02','2024-10-04','2024-10-04 11:20:00',185000.0,'36759dfd-b661-44b9-83ab-7cbeb42fec65','57544a2d-1156-43ae-ae7d-618a3ad626fa','c7fe7417-f7cf-4838-bfdf-0a7b25ac5994',5,NULL,'e50c67c1-533a-4a2a-a04f-a74efa77aaeb'),
                ('7960eedd-e554-41d4-99c5-e59f7ed267b8','2024-10-01','2024-10-01','2024-10-01 12:00:00',35000.0,'6dcee1e7-8e68-4b53-b300-171352434f92','b57a4f4b-c0c7-45a9-8a02-104f0d8880a0','9b449030-5748-46bb-b3bb-71979b6ffea5',1,'WAILMER202','6a73f89c-58cd-4d8a-b251-c2f7e7d61671'),
                ('5bb97ab0-4659-4267-8062-1677ddbd8e8a','2024-09-30','2024-09-30','2024-09-30 19:00:00',125000.0,'23e115b7-ebef-48a6-be35-725f3ad92744','3c0d1ed8-1339-4afa-b7c9-475cdd7c2ca9','03170d2f-8a86-4553-9983-9a2be1be9480',4,NULL,'7d55fd2f-3d91-44f6-8770-46b66fad7671'),
                ('2cf43490-e559-4cab-a6b6-0b4412f48093','2024-09-29','2024-09-29','2024-09-29 11:00:00',115000.0,'6dcee1e7-8e68-4b53-b300-171352434f92','811eeec2-4f35-49f3-bcd5-a74522f3251f','2e6abf6d-7e03-4382-8264-f0e4689fbd39',1,NULL,'6a73f89c-58cd-4d8a-b251-c2f7e7d61671'),
                ('e892c3cf-6c66-4ab1-83ff-20153ac3bb62','2024-09-28','2024-09-28','2024-09-28 15:00:00',67000.0,'23e115b7-ebef-48a6-be35-725f3ad92744','b57a4f4b-c0c7-45a9-8a02-104f0d8880a0','b20135ee-92ee-4a62-ac5b-53c6b3423c3d',1,'WAILMER101','7d55fd2f-3d91-44f6-8770-46b66fad7671'),
                ('fb507538-a75d-405a-93c9-691a285f7391','2024-09-27','2024-09-27','2024-09-27 11:15:00',135000.0,'f20104d8-a4b8-47c2-b337-7d3c2b9c2a63','811eeec2-4f35-49f3-bcd5-a74522f3251f','86cf46cc-2e7c-49e9-9ad8-a7aff0f5274a',1,NULL,'d38a6298-ca8a-40df-baec-5c63aefc7d80'),
                ('4ad98107-0798-491c-a778-c0b8fdfc2871','2024-09-26','2024-09-26','2024-09-26 20:00:00',170000.0,'36759dfd-b661-44b9-83ab-7cbeb42fec65','3c0d1ed8-1339-4afa-b7c9-475cdd7c2ca9','3d516838-2f20-4cdc-9a0e-0a70278102b3',6,'WAILMER102','e50c67c1-533a-4a2a-a04f-a74efa77aaeb'),
                ('ab586d8b-682d-4e6e-ba22-6bf56a86b08e','2024-09-25','2024-09-25','2024-09-25 14:00:00',115000.0,'f20104d8-a4b8-47c2-b337-7d3c2b9c2a63','57544a2d-1156-43ae-ae7d-618a3ad626fa','2e6abf6d-7e03-4382-8264-f0e4689fbd39',1,NULL,'d38a6298-ca8a-40df-baec-5c63aefc7d80'),
                ('ced9fada-b658-4970-9404-d335d2d58434','2024-09-24','2024-09-25','2024-09-25 17:00:00',160000.0,'f20104d8-a4b8-47c2-b337-7d3c2b9c2a63','c5504d97-40ac-4801-9c0f-9d5c90ffefec','5a0590d9-d1d0-404f-8203-6420ef57e542',1,'WAILMER110','d38a6298-ca8a-40df-baec-5c63aefc7d80'),
                ('3f484851-f2fd-4adc-b7c8-e795bfc855ca','2024-09-23','2024-09-23','2024-09-23 16:00:00',65000.0,'23e115b7-ebef-48a6-be35-725f3ad92744','811eeec2-4f35-49f3-bcd5-a74522f3251f','9b449030-5748-46bb-b3bb-71979b6ffea5',1,NULL,'7d55fd2f-3d91-44f6-8770-46b66fad7671'),
                ('ac8a16fe-85cd-4c69-9099-26de98ae3222','2024-09-22','2024-09-22','2024-09-22 23:57:00',180000.0,'36759dfd-b661-44b9-83ab-7cbeb42fec65','57544a2d-1156-43ae-ae7d-618a3ad626fa','2d6831c2-5b46-46e3-958b-8e568c6762f2',2,'WAILMER102','e50c67c1-533a-4a2a-a04f-a74efa77aaeb');
        `);
        console.log('Inserted initial TR_PEMESANAN_JASA data');

        await client.query(`
            INSERT INTO TR_PEMESANAN_STATUS VALUES
                ('6a81a88a-0d7a-49f6-9bf1-7cb0ad2eb64a','df71e37a-628e-4115-a294-9d5f683db116','2024-10-16 01:00:00'),
                ('6adccc5f-1f98-46ed-8ddd-7c3fd399da4d','df71e37a-628e-4115-a294-9d5f683db116','2024-10-15 02:00:00'),
                ('d35fa14d-da51-4ee6-841d-89c0b02f8f4a','df71e37a-628e-4115-a294-9d5f683db116','2024-10-14 03:00:00'),
                ('60468f31-7751-4e76-a572-c0b89ef01c5d','df71e37a-628e-4115-a294-9d5f683db116','2024-10-13 04:00:00'),
                ('d862b12d-56a4-4efe-a4a4-7e317f6392b4','df71e37a-628e-4115-a294-9d5f683db116','2024-10-12 05:00:00'),
                ('db3fd92b-a67d-4716-8358-d84e5cb64e15','df71e37a-628e-4115-a294-9d5f683db116','2024-10-11 06:00:00'),
                ('ac35773d-beff-4a6b-80ae-0b94569362fc','df71e37a-628e-4115-a294-9d5f683db116','2024-10-10 07:00:00'),
                ('a3b061c9-38ec-4c8a-afa5-b9a27cff060c','df71e37a-628e-4115-a294-9d5f683db116','2024-10-09 08:00:00'),
                ('d64222a8-b3ad-4690-8088-6f7fd535c87e','df71e37a-628e-4115-a294-9d5f683db116','2024-10-08 09:00:00'),
                ('41b084bf-685c-4e13-a046-079d2bbd2ac8','df71e37a-628e-4115-a294-9d5f683db116','2024-10-07 10:00:00'),
                ('5e03227e-0a66-459d-9494-864f6d9647d0','df71e37a-628e-4115-a294-9d5f683db116','2024-10-06 11:00:00'),
                ('fac18c07-1db1-444c-8ae9-d8abab217d4c','df71e37a-628e-4115-a294-9d5f683db116','2024-10-05 12:00:00'),
                ('39612ca3-0ba4-43b8-a9ba-97a7f94b3538','df71e37a-628e-4115-a294-9d5f683db116','2024-10-04 13:00:00'),
                ('bf8b93d6-9931-4b69-84ee-96e7133e59c5','df71e37a-628e-4115-a294-9d5f683db116','2024-10-03 14:00:00'),
                ('7090bb4f-542e-4768-9fa5-c302545d0486','df71e37a-628e-4115-a294-9d5f683db116','2024-10-02 15:00:00'),
                ('7960eedd-e554-41d4-99c5-e59f7ed267b8','df71e37a-628e-4115-a294-9d5f683db116','2024-10-01 16:00:00'),
                ('5bb97ab0-4659-4267-8062-1677ddbd8e8a','df71e37a-628e-4115-a294-9d5f683db116','2024-09-30 17:00:00'),
                ('2cf43490-e559-4cab-a6b6-0b4412f48093','df71e37a-628e-4115-a294-9d5f683db116','2024-09-29 18:00:00'),
                ('e892c3cf-6c66-4ab1-83ff-20153ac3bb62','df71e37a-628e-4115-a294-9d5f683db116','2024-09-28 19:00:00'),
                ('fb507538-a75d-405a-93c9-691a285f7391','df71e37a-628e-4115-a294-9d5f683db116','2024-09-27 20:00:00'),
                ('4ad98107-0798-491c-a778-c0b8fdfc2871','df71e37a-628e-4115-a294-9d5f683db116','2024-09-26 21:00:00'),
                ('ab586d8b-682d-4e6e-ba22-6bf56a86b08e','df71e37a-628e-4115-a294-9d5f683db116','2024-09-25 22:00:00'),
                ('ced9fada-b658-4970-9404-d335d2d58434','df71e37a-628e-4115-a294-9d5f683db116','2024-09-24 23:00:00'),
                ('3f484851-f2fd-4adc-b7c8-e795bfc855ca','df71e37a-628e-4115-a294-9d5f683db116','2024-09-23 24:00:00'),
                ('ac8a16fe-85cd-4c69-9099-26de98ae3222','df71e37a-628e-4115-a294-9d5f683db116','2024-09-22 01:00:00'),
                ('db3fd92b-a67d-4716-8358-d84e5cb64e15','942fc323-7400-41d1-b33f-3352ea500100','2024-10-11 07:00:00'),
                ('db3fd92b-a67d-4716-8358-d84e5cb64e15','0e95bab4-5f9b-4ad7-a6fc-091e72dcfeb6','2024-10-11 07:30:00'),
                ('db3fd92b-a67d-4716-8358-d84e5cb64e15','f92d7019-d815-47fd-95e4-c4a9b7f5c708','2024-10-11 08:00:00'),
                ('db3fd92b-a67d-4716-8358-d84e5cb64e15','d0f43dac-78ed-4af1-9c68-a0ae79afd067','2024-10-11 08:45:00'),
                ('db3fd92b-a67d-4716-8358-d84e5cb64e15','7ddd2e53-e1c8-474a-b23e-045aeef12fa4','2024-10-11 11:00:00'),
                ('ac35773d-beff-4a6b-80ae-0b94569362fc','93e9f4dc-2f3f-490b-b890-31067a8bab4e','2024-10-10 08:00:00'),
                ('a3b061c9-38ec-4c8a-afa5-b9a27cff060c','93e9f4dc-2f3f-490b-b890-31067a8bab4e','2024-10-09 09:00:00'),
                ('d64222a8-b3ad-4690-8088-6f7fd535c87e','93e9f4dc-2f3f-490b-b890-31067a8bab4e','2024-10-08 10:00:00'),
                ('41b084bf-685c-4e13-a046-079d2bbd2ac8','93e9f4dc-2f3f-490b-b890-31067a8bab4e','2024-10-07 11:00:00'),
                ('5e03227e-0a66-459d-9494-864f6d9647d0','93e9f4dc-2f3f-490b-b890-31067a8bab4e','2024-10-06 12:00:00');
        `);
        console.log('Inserted initial TR_PEMESANAN_STATUS data');

        await client.query(`
            INSERT INTO TESTIMONI VALUES 
                ('fac18c07-1db1-444c-8ae9-d8abab217d4c','2024-03-22','Layanan ini sungguh luar biasa! Sangat direkomendasikan.',4),
                ('39612ca3-0ba4-43b8-a9ba-97a7f94b3538','2025-07-15','Pengalaman belanja yang tak terlupakan, saya akan kembali lagi!',4),
                ('bf8b93d6-9931-4b69-84ee-96e7133e59c5','2026-11-08','Pelayanan pelanggan yang ramah dan efisien.',5),
                ('7090bb4f-542e-4768-9fa5-c302545d0486','2024-06-19','Produk berkualitas tinggi dengan harga yang terjangkau.',4),
                ('7960eedd-e554-41d4-99c5-e59f7ed267b8','2027-02-03','Saya sangat puas dengan hasil yang saya dapatkan.',5),
                ('5bb97ab0-4659-4267-8062-1677ddbd8e8a','2025-05-21','Layanan cepat dan responsif, benar-benar memuaskan.',5),
                ('2cf43490-e559-4cab-a6b6-0b4412f48093','2026-08-13','Tim ini benar-benar mengerti kebutuhan pelanggan.',4),
                ('e892c3cf-6c66-4ab1-83ff-20153ac3bb62','2024-10-07','Pengiriman tepat waktu dan barang sesuai harapan.',4),
                ('fb507538-a75d-405a-93c9-691a285f7391','2025-12-29','Tidak ada masalah sama sekali, sangat lancar.',4),
                ('4ad98107-0798-491c-a778-c0b8fdfc2871','2026-04-14','Aplikasi ini sangat membantu dalam kehidupan sehari-hari.',4),
                ('ab586d8b-682d-4e6e-ba22-6bf56a86b08e','2024-09-02','Desain yang indah dan sangat fungsional.',4),
                ('ced9fada-b658-4970-9404-d335d2d58434','2027-01-17','Saya sudah merekomendasikan layanan ini ke teman-teman saya.',4),
                ('3f484851-f2fd-4adc-b7c8-e795bfc855ca','2025-03-05','Pengalaman pengguna yang luar biasa!',4),
                ('ac8a16fe-85cd-4c69-9099-26de98ae3222','2026-07-26','Harga yang bersahabat untuk produk berkualitas.',5),
                ('6a81a88a-0d7a-49f6-9bf1-7cb0ad2eb64a','2024-12-11','Sangat mudah digunakan dan sangat berguna.',5),
                ('6adccc5f-1f98-46ed-8ddd-7c3fd399da4d','2027-05-20','Hasilnya melebihi ekspektasi saya.',5),
                ('d35fa14d-da51-4ee6-841d-89c0b02f8f4a','2025-09-30','Sangat mengesankan, saya pasti akan menggunakannya lagi.',4);
        `);
        console.log('Inserted initial TESTIMONI data');

        // Trigger & Stored Function

        await client.query(`
            -- Function untuk mengecek apakah nomor HP sudah terdaftar
            CREATE OR REPLACE FUNCTION check_no_hp_exists()
            RETURNS TRIGGER AS $$
            BEGIN
                -- Mengecek apakah no_hp yang akan dimasukkan sudah ada
                IF EXISTS (SELECT 1 FROM "user" WHERE no_hp = NEW.no_hp) THEN
                    RAISE EXCEPTION 'No HP sudah terdaftar: %', NEW.no_hp;
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            -- Trigger untuk mengecek no_hp saat insert ke tabel user
            CREATE TRIGGER no_hp_check
            BEFORE INSERT ON "user"
            FOR EACH ROW
            EXECUTE FUNCTION check_no_hp_exists();

            -- Function untuk mengecek apakah kombinasi nama_bank dan nomor_rekening sudah terdaftar
            CREATE OR REPLACE FUNCTION check_bank_account_exists()
            RETURNS TRIGGER AS $$
            BEGIN
                -- Mengecek apakah kombinasi nama_bank dan nomor_rekening sudah ada di tabel PEKERJA
                IF EXISTS (SELECT 1 FROM PEKERJA WHERE nama_bank = NEW.nama_bank AND nomor_rekening = NEW.nomor_rekening) THEN
                    RAISE EXCEPTION 'Kombinasi Nama Bank dan Nomor Rekening sudah terdaftar: % - %', NEW.nama_bank, NEW.nomor_rekening;
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            -- Trigger untuk mengecek pasangan nama_bank dan nomor_rekening saat insert ke tabel PEKERJA
            CREATE TRIGGER bank_account_check
            BEFORE INSERT ON PEKERJA
            FOR EACH ROW
            EXECUTE FUNCTION check_bank_account_exists();
        `);
        console.log('Trigger Kuning inserted');
        
        await client.query(`
            CREATE OR REPLACE FUNCTION refund_mypay_on_cancellation()
            RETURNS TRIGGER AS $$
            BEGIN
                IF EXISTS (
                    SELECT 1
                    FROM TR_PEMESANAN_STATUS tps
                    JOIN STATUS_PESANAN sp ON tps.id_status = sp.id
                    WHERE tps.id_tr_pemesanan = NEW.id_tr_pemesanan
                    AND sp.status = 'Mencari Pekerja Terdekat'
                ) THEN
                    UPDATE "user"
                    SET saldo_mypay = saldo_mypay + NEW.total_biaya
                    WHERE id = (SELECT id_pelanggan FROM TR_PEMESANAN_JASA WHERE id = NEW.id_tr_pemesanan
                );
                END IF;

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            CREATE TRIGGER trigger_refund_mypay
            AFTER UPDATE ON TR_PEMESANAN_STATUS
            FOR EACH ROW
            WHEN (NEW.id_status IS NOT NULL)
            EXECUTE FUNCTION refund_mypay_on_cancellation();
        `);
        console.log('Trigger Hijau inserted');

        await client.query(`
            CREATE OR REPLACE FUNCTION validasi_kuota_tanggal()
            RETURNS TRIGGER AS $$
            DECLARE
                kuota_penggunaan INT;
                telah_digunakan INT;
                tgl_akhir DATE;
            BEGIN
                IF NEW.id_diskon IS NOT NULL AND NEW.id_pelanggan IS NOT NULL THEN
                    SELECT v.kuota_penggunaan, p.telah_digunakan, p.tgl_akhir
                    INTO kuota_penggunaan, telah_digunakan, tgl_akhir
                    FROM VOUCHER v
                    JOIN TR_PEMBELIAN_VOUCHER p ON v.kode = p.id_voucher
                    WHERE p.id_voucher = NEW.id_diskon AND p.id_pelanggan = NEW.id_pelanggan;
                    IF NOT FOUND THEN
                        RAISE EXCEPTION 'id voucher atau id pelanggan tidak matching';
                    END IF;
                    IF telah_digunakan >= kuota_penggunaan THEN
                        RAISE EXCEPTION 'voucher sudah melebihi kuota penggunaan';
                    END IF;
                    IF NEW.tgl_pemesanan > tgl_akhir THEN
                        RAISE EXCEPTION 'voucher sudah kadaluarsa';
                    END IF;
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            CREATE TRIGGER sebelum_insert_pemesanan_jasa
            BEFORE INSERT OR UPDATE ON TR_PEMESANAN_JASA
            FOR EACH ROW
            EXECUTE FUNCTION validasi_kuota_tanggal();
        `);
        console.log('Trigger Biru inserted');

        await client.query(`
            -- Trigger Function
            CREATE or REPLACE FUNCTION menerima_honor()
            RETURNS TRIGGER AS $$
            DECLARE
                pesanan TR_PEMESANAN_JASA%ROWTYPE;
                status_selesai UUID;
                kategori_menerima_honor UUID;
            BEGIN
                -- Mengambil UUID dari data status = pesanan selesai
                SELECT Id FROM STATUS_PESANAN INTO status_selesai
                WHERE status = 'Pesanan selesai';

                -- Mengambil UUID dari data kategori transaksi MyPay = menerima honor
                SELECT Id FROM KATEGORI_TR_MYPAY INTO kategori_menerima_honor
                WHERE nama = 'Terima honor';

                -- Mengambil data pesanan yang baru saja di update statusnya
                SELECT * FROM TR_PEMESANAN_JASA INTO pesanan
                WHERE id = NEW.id_tr_pemesanan;

                -- Cek jika status pesanan selesai agar tidak asal transfer sebelum selesai
                IF NEW.id_status = status_selesai THEN
                    -- Masukkan transaksi baru
                    INSERT INTO TR_MYPAY (user_id, tgl, nominal, kategori_id)
                    VALUES (
                        pesanan.id_pekerja,
                        NEW.tgl_waktu, -- Asumsi: dikirim di hari yang sama saat waktu status menjadi selesai
                        pesanan.total_biaya,
                        kategori_menerima_honor
                    );

                    -- Update saldo MyPay pekerja yang baru saja menerima honornya
                    UPDATE "user"
                    SET saldo_mypay = saldo_mypay + pesanan.total_biaya 
                    WHERE Id = pesanan.id_pekerja;
                END IF;

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;


            -- Trigger Definition
            CREATE TRIGGER trigger_pekerja_menerima_honor
            AFTER INSERT ON TR_PEMESANAN_STATUS
            FOR EACH ROW EXECUTE FUNCTION menerima_honor();
        `);
        console.log('Trigger Merah inserted');

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


        // Drop Triggers

        await client.query(`DROP TRIGGER IF EXISTS no_hp_check ON "user";`);
        console.log('Dropped trigger no_hp_check on "user"...');

        await client.query(`DROP TRIGGER IF EXISTS bank_account_check ON PEKERJA;`);
        console.log('Dropped trigger bank_account_check on PEKERJA...');

        await client.query(`DROP TRIGGER IF EXISTS trigger_refund_mypay ON TR_PEMESANAN_STATUS;`);
        console.log('Dropped trigger trigger_refund_mypay on TR_PEMESANAN_STATUS...');

        await client.query(`DROP TRIGGER IF EXISTS sebelum_insert_pemesanan_jasa ON TR_PEMESANAN_JASA;`);
        console.log('Dropped trigger sebelum_insert_pemesanan_jasa on TR_PEMESANAN_JASA...');

        await client.query(`DROP TRIGGER IF EXISTS trigger_pekerja_menerima_honor ON TR_PEMESANAN_STATUS;`);
        console.log('Dropped trigger trigger_pekerja_menerima_honor on TR_PEMESANAN_STATUS...');


        // Drop Functions

        await client.query(`DROP FUNCTION IF EXISTS check_no_hp_exists() CASCADE;`);
        console.log('Dropped function check_no_hp_exists');

        await client.query(`DROP FUNCTION IF EXISTS check_bank_account_exists() CASCADE;`);
        console.log('Dropped function check_bank_account_exists');

        await client.query(`DROP FUNCTION IF EXISTS refund_mypay_on_cancellation() CASCADE;`);
        console.log('Dropped function refund_mypay_on_cancellation');

        await client.query(`DROP FUNCTION IF EXISTS validasi_kuota_tanggal() CASCADE;`);
        console.log('Dropped function validasi_kuota_tanggal');

        await client.query(`DROP FUNCTION IF EXISTS menerima_honor() CASCADE;`);
        console.log('Dropped function menerima_honor');


        // Drop Tables with CASCADE

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