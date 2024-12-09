// app/api/promos/route.ts
import { TrPemesananJasaModel } from '@/src/db/models/trPemesananJasa';
import { TrPemesananJasa } from '@/src/db/types/trPemesananJasa';
import { getUserFromToken } from '@/src/functions/getUser';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const authToken = request.cookies.get('auth-token')?.value;
    
    if (!authToken) {
        return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
    }

    // Decode or verify the token here if necessary
    const user = await getUserFromToken(authToken);

    try {
        if (!user) {
            return NextResponse.json({ error: 'Invalid Token' }, { status: 400 });
        }

        const pesanan = await new TrPemesananJasaModel().getTagihanMyPay(user.id);

        return NextResponse.json({ pesanan: pesanan }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error reading data: ' + error }, { status: 500 });
    }
}