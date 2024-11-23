// app/api/promos/route.ts
import { trMyPayService } from '@/src/db/services/trMypay';
import { Convert } from '@/src/db/types/trMypay';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('id');

  try {
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    const allTransaksi = await trMyPayService.getAllTransaksi(userId);

    return NextResponse.json({ transaksi: Convert.trMyPayToJson(allTransaksi) }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error reading data' }, { status: 500 });
  }
}