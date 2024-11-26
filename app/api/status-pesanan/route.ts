import { trPemesananJasaService } from '@/src/db/models/trPemesananJasa';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idPekerja = searchParams.get('idPekerja');
    const query = searchParams.get('query');
    const filter = searchParams.get('filter');

    try {
        if (!idPekerja) return NextResponse.json({ error: 'Missing id pekerja' }, { status: 400 });
        const res = await trPemesananJasaService.getPesananPekerja(idPekerja!, query || '', filter || 'none');
        return NextResponse.json({ pesanan: res }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error reading data' }, { status: 500 });
    }
}