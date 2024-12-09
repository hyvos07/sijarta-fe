// app/api/promos/route.ts
import { TrMyPayModel } from '@/src/db/models/trMypay';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('id');

  try {
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    const allTransaksi = await new TrMyPayModel().getTransaksiByUserID(userId);

    return NextResponse.json({ transaksi: allTransaksi }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error reading data: ' + error }, { status: 500 });
  }
}