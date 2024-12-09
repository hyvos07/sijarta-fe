// path : sijarta-fe/app/api/logout/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  (await cookies()).delete('auth-token');
  (await cookies()).delete('type');
  return NextResponse.json({ success: true });
}