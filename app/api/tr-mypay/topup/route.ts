import { KategoriTrMyPayModel } from '@/src/db/models/kategoriTrMypay';
import { TrMyPayModel } from '@/src/db/models/trMypay';
import { UserModel } from '@/src/db/models/user';
import { getUserFromToken } from '@/src/functions/getUser';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const authToken = request.cookies.get('auth-token')?.value;
    
    if (!authToken) {
        return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
    }

    // Decode or verify the token here if necessary
    const user = await getUserFromToken(authToken);

    try {
        if (!user) {
            return NextResponse.json({ error: 'Unknown user' }, { status: 400 });
        }
        const body = await request.json();

        const nominal = body.nominal;

        if (Number.isNaN(nominal) || nominal < 1 || nominal > 1000000000 || !Number.isInteger(nominal)) {
            return NextResponse.json({ error: 'Invalid nominal value' }, { status: 400 });
        }

        const idKategori = await new KategoriTrMyPayModel().getIdByName('TopUp MyPay');

        // Tambahin nominal ke MyPay dan update log transaksi
        await new TrMyPayModel().createNewTr(user.id, idKategori!, body.nominal, body.date);
        await new UserModel().updateSaldo(user.id, body.nominal);

        return NextResponse.json({ message: `Successfully added ${body.nominal} in the MyPay` }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error: ' + error }, { status: 500 });
    }
}