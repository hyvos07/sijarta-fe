import { NextResponse } from 'next/server'
import { encrypt } from '../../functions/cipher'
import { setAuthCookie } from '../../functions/auth/auth'
import { userService } from '@/app/db/services/user';

export async function POST(request: Request) {
  const body = await request.json();
  
  if (!/^\d+$/.test(body.phone)) { 
    return NextResponse.json({ success: false, error: 'Phone number is not a number' }, { status: 401 });
  }
  
  if (body.phone.length < 12 || body.phone.length > 13) {
    return NextResponse.json({ success: false, error: 'Phone number must be 12 to 13 digits long' }, { status: 401 });
  }
  
  // Validate if phone number exists in DB
  const user = await userService.getUserByPhone(body.phone);
  if (!user || user.pwd !== body.password) {
    return NextResponse.json({ success: false, error: 'Phone number or password is incorrect' }, { status: 401 });
  }
  
  // Pass all validation, generate auth token and authorize user

  const authToken = encrypt(body.phone + [...Array(36)].map(() => Math.random().toString(36)[2]).join(''));
  await setAuthCookie(authToken);

  return NextResponse.json({ success: true, error: null }, { status: 200 });
}