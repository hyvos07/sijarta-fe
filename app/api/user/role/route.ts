import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // Mengambil cookies dari next/headers
import { getUserFromToken } from '@/src/functions/getUser';
import { PelangganModel } from '@/src/db/models/pelanggan';
import { PekerjaModel } from '@/src/db/models/pekerja';

export async function GET() {
  const cookieStore = cookies();
  console.log(await cookieStore); // Log the entire cookies object to inspect
  const token = (await cookieStore).get('auth-token')?.value;
  console.log('Token:', token);
  if (token==null) {
    return NextResponse.json({ role: '', error: 'Unauthorized' }, { status: 401 });
    
  }

  const user = await getUserFromToken(token);
  if (!user) {
    return NextResponse.json({ role: null, error: 'Invalid token' }, { status: 401 });
  }

  const pelanggan = await new PelangganModel().getById(user.id);
  if (pelanggan) {
    return NextResponse.json({ role: 'Pelanggan', error: null }, { status: 200 });
  }

  const pekerja = await new PekerjaModel().getById(user.id);
  if (pekerja) {
    return NextResponse.json({ role: 'Pekerja', error: null }, { status: 200 });
  }

  return NextResponse.json({ role: 'Unknown', error: null }, { status: 200 });
}
