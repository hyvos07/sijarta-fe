// path : sijarta-fe/app/api/status-pesanan/route.ts

import { TrPemesananJasaModel } from '@/src/db/models/trPemesananJasa';
import { TrPemesananStatusModel } from '@/src/db/models/trPemesananStatus';
import { getUserFromToken } from '@/src/functions/getUser';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idPekerja = searchParams.get('idPekerja');
    const query = searchParams.get('query');
    const filter = searchParams.get('filter');

    try {
        if (!idPekerja) return NextResponse.json({ error: 'Missing id pekerja' }, { status: 400 });
        const res = await new TrPemesananJasaModel().getPesananPekerja(idPekerja!, query || '', filter || 'none');
        return NextResponse.json({ pesanan: res }, { status: 200 });
    } catch (error) {
        console.error('Error reading data:', error);
        return NextResponse.json({ error: 'Error reading data' }, { status: 500 });
    }
}

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

        const transaksi = await new TrPemesananJasaModel().getById(body.idPesanan);
        const statusPesanan = await new TrPemesananStatusModel().getNamaStatusById(body.idPesanan);
        
        if (!transaksi || !transaksi.idPekerja || statusPesanan === 'Pesanan dibatalkan' || statusPesanan === 'Menunggu Pembayaran') {
            console.log('Transaksi:', transaksi);
            console.log('Status:', statusPesanan);
            return NextResponse.json({ error: 'Transaksi tidak didukung' }, { status: 400 });
        }
        
        // Update status pesanan
        await new TrPemesananStatusModel().createNewStatus(transaksi.id, body.status, body.date);
        
        console.log(await new TrPemesananStatusModel().getNamaStatusById(body.idPesanan) + ' ' + body.date);
        console.log('Status:', statusPesanan);
        
        return NextResponse.json({ message: `Successfully update status` }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error reading data' }, { status: 500 });
    }
}