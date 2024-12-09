// path : sijarta-fe/app/api/pesanan/route.ts

import { TrPemesananJasaModel } from '@/src/db/models/trPemesananJasa';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const subKategoriId = searchParams.get('id');

    try {
        if (!subKategoriId) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        const res = await new TrPemesananJasaModel().getPesananWithDetails(subKategoriId);
        return NextResponse.json({ pesanan: res }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error reading data' }, { status: 500 });
    }
}