// path : sijarta-fe/app/api/pesanan/route.ts

import { TrPemesananJasaModel } from '@/src/db/models/trPemesananJasa';
import { TrPemesananStatusModel } from '@/src/db/models/trPemesananStatus';
import { UserModel } from '@/src/db/models/user';
import { getUserFromToken } from '@/src/functions/getUser';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const subKategoriId = searchParams.get('id');

    try {
        if (!subKategoriId) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        const res = await new TrPemesananJasaModel().getPesananWithDetails(subKategoriId);
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

        if (!transaksi || transaksi.idPekerja || statusPesanan !== 'Mencari Pekerja Terdekat') {
            console.log('Transaksi:', transaksi);
            console.log('Status:', statusPesanan);
            return NextResponse.json({ error: 'Transaksi tidak tersedia' }, { status: 400 });
        }

        // Update idPekerja di transaksi dan update status pesanan == 'Menunggu Pekerja Berangkat'
        await new TrPemesananJasaModel().assignPekerja(transaksi.id, userId.id, body.date);

        console.log(body.date);

        return NextResponse.json({ message: `Successfully took the job` }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error reading data' }, { status: 500 });
    }
}