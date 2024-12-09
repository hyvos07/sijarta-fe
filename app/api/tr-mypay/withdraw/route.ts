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
    const userId = await getUserFromToken(authToken);
    
    try {
        if (!userId) {
            return NextResponse.json({ error: 'Unknown user' }, { status: 400 });
        }

        const user = await new UserModel().getById(userId.id);
        
        const body = await request.json();
        const { nominal, bank, noRek } = body;

        if (Number.isNaN(nominal) || nominal < 1 || nominal > 1000000000 || !Number.isInteger(nominal)) {
            return NextResponse.json({ error: 'Invalid nominal value' }, { status: 400 });
        }

        if (bank === 'none' || noRek.length < 10 || noRek.length > 20) {
            return NextResponse.json({ error: 'Invalid bank or account number' }, { status: 400 });
        }

        if (user!.saldoMyPay < body.nominal) {
            return NextResponse.json({ error: 'Saldo anda tidak cukup' }, { status: 400 });
        }

        const idKategori = await new KategoriTrMyPayModel().getIdByName('Withdraw MyPay ke rekening Bank');

        // Tambahin transaksi
        await new TrMyPayModel().createNewTr(user!.id, idKategori!, body.nominal, body.date);

        // Kurangin mypay user
        await new UserModel().updateSaldo(user!.id, -body.nominal);

        return NextResponse.json({ message: `Successfully added ${body.nominal} in the MyPay` }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error: ' + error }, { status: 500 });
    }
}