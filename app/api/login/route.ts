// path : sijarta-fe/app/api/login/route.ts
import { NextResponse } from 'next/server'
import { encrypt } from '../../../src/functions/cipher'
import { setAuthCookie, setTypeCookie } from '../../../src/functions/cookies'
import { UserModel } from '@/src/db/models/user'
import { PelangganModel } from '@/src/db/models/pelanggan';

export async function POST(request: Request) {
  const body = await request.json();
  
  if (!/^\d+$/.test(body.phone)) { 
    return NextResponse.json({ success: false, error: 'Phone number is not a number' }, { status: 401 });
  }
  
  if (body.phone.length < 12 || body.phone.length > 13) {
    return NextResponse.json({ success: false, error: 'Phone number must be 12 to 13 digits long' }, { status: 401 });
  }

  console.log(body);
  
  // Validate if phone number exists in DB
  const user = await new UserModel().getUserByPhone(body.phone);
  if (!user || user.pwd !== body.password) {
    return NextResponse.json({ success: false, error: 'Phone number or password is incorrect' }, { status: 401 });
  }
  
  // Pass all validation, generate auth token and authorize user

  const authToken = encrypt(body.phone + user.id);
  await setAuthCookie(authToken);

  const userType = await new PelangganModel().getById(user.id) !== null ? 'pelanggan' : 'pekerja';
  await setTypeCookie(userType);

  return NextResponse.json({ success: true, error: null }, { status: 200 });
}