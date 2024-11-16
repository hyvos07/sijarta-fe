import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const body = await request.json()
  
  // Replace this with your actual authentication logic
  if (body.phone.startsWith('08') && body.password === 'password') {
    // Set cookie on successful login
    (await
          // Set cookie on successful login
          cookies()).set('auth-token', 'your-auth-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })
    
    return NextResponse.json({ success: true })
  }
  
  return NextResponse.json({ success: false }, { status: 401 })
}