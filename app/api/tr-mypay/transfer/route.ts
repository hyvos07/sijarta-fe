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

        const pengirim = await new UserModel().getById(userId.id);
        const body = await request.json();

        if (body.noHP.length < 12 || body.noHP.length > 13 || Number.isNaN(body.nominal) || body.nominal < 1 || body.nominal > 1000000000 || !Number.isInteger(body.nominal)) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        if (pengirim!.saldoMyPay < body.nominal) {
            return NextResponse.json({ error: 'Saldo anda tidak cukup' }, { status: 400 });
        }

        if (pengirim!.noHP === body.noHP) {
            return NextResponse.json({ error: 'Nomor Penerima tidak boleh sama dengan Nomor Pengirim' }, { status: 400 });
        }

        const penerima = await new UserModel().getUserByPhone(body.noHP);

        if (!penerima) {
            return NextResponse.json({ error: 'Nomor Penerima tidak ditemukan' }, { status: 400 });
        }

        const idKategori = await new KategoriTrMyPayModel().getIdByName('Transfer MyPay');

        // Tambahin transaksi
        await new TrMyPayModel().createNewTr(pengirim!.id, idKategori!, -body.nominal, body.date); // negative untuk pengirim
        await new TrMyPayModel().createNewTr(penerima!.id, idKategori!, body.nominal, body.date);

        // Kurangin mypay user, tambahin target transfer
        await new UserModel().updateSaldo(pengirim!.id, -body.nominal);
        await new UserModel().updateSaldo(penerima.id, body.nominal);

        return NextResponse.json({ message: `Successfully added ${body.nominal} in the MyPay` }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error: ' + error }, { status: 500 });
    }
}