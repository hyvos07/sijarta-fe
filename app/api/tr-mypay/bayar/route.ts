import { KategoriTrMyPayModel } from '@/src/db/models/kategoriTrMypay';
import { TrMyPayModel } from '@/src/db/models/trMypay';
import { TrPemesananJasaModel } from '@/src/db/models/trPemesananJasa';
import { TrPemesananStatusModel } from '@/src/db/models/trPemesananStatus';
import { UserModel } from '@/src/db/models/user';
import { getUserFromToken } from '@/src/functions/getUser';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const authToken = request.cookies.get('auth-token')?.value;
    
    if (!authToken) {
        return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
    }

    // Decode or verify the token here if necessary
    const userId = await getUserFromToken(authToken);
    
    try {
        if (!userId) {
            return NextResponse.json({ error: 'Unknown user' }, { status: 400 });
        }

        const body = await request.json();
        const user = await new UserModel().getById(userId.id);
        const transaksi = await new TrPemesananJasaModel().getById(body.idPesanan);
        const statusPesanan = await new TrPemesananStatusModel().getNamaStatusById(body.idPesanan);

        if (!transaksi || transaksi.idPelanggan !== user!.id || statusPesanan !== 'Menunggu Pembayaran') {
            return NextResponse.json({ error: 'Transaksi tidak tersedia' }, { status: 400 });
        }

        if (user!.saldoMyPay < transaksi.totalBiaya) {
            return NextResponse.json({ error: 'Saldo anda tidak cukup' }, { status: 400 });
        }

        const idKategori = await new KategoriTrMyPayModel().getIdByName('Bayar transaksi jasa');

        // Tambahin transaksi
        await new TrMyPayModel().createNewTr(user!.id, idKategori!, transaksi.totalBiaya, body.date);

        // Update status pesanan
        await new TrPemesananStatusModel().createNewStatus(transaksi.id, 'Mencari Pekerja Terdekat', body.date);

        // Kurangin mypay user
        await new UserModel().updateSaldo(user!.id, -transaksi.totalBiaya);

        return NextResponse.json({ message: `Successfully added ${body.nominal} in the MyPay` }, { status: 200 });
    } catch (error) {
        console.log(error); 
        return NextResponse.json({ error: 'Error: ' + error }, { status: 500 });
    }
}