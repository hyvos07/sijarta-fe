import { NextResponse } from 'next/server';
import pool from '@/src/db/db';
import { UserModel } from '@/src/db/models/user';

export async function PUT(request: Request) {
    try {
        const { jumlahHari, idPelanggan, idVoucher, idMetodeBayar, hargaVoucher } = await request.json();

        // Validate input
        if (!idPelanggan || !hargaVoucher) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        try {
            await new UserModel().updateSaldo(idPelanggan, -hargaVoucher);

            return NextResponse.json({
                message: 'Saldo MyPay berhasil diperbarui',
                status: 200
            });

        } catch (dbError) {
            console.error('Database update error:', dbError);
            return NextResponse.json({ error: 'Gagal memperbarui saldo' }, { status: 500 });
        }

    } catch (error) {
        console.error('Error updating MyPay balance:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
    }
}