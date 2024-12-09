// path : sijarta-fe/src/functions/cookies.ts

import { cookies } from 'next/headers'

export const setAuthCookie = async (token: string) => {
  (await cookies()).set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  })
}

export const removeAuthCookie = async () => {
  (await cookies()).delete('auth-token')
}

export const getAuthCookie = async () => {
  return (await cookies()).get('auth-token')
}

export const setTypeCookie = async (type: 'pelanggan' | 'pekerja') => {
  (await cookies()).set('type', type, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  })
}

export const removeTypeCookie = async () => {
  (await cookies()).delete('type')
}

export const getTypeCookie = async () => {
  return (await cookies()).get('type')
}