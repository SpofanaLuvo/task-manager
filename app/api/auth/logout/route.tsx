import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  return NextResponse.json(
    { message: "Logout successful" },
    {
      status: 200,
      headers: {
        'Set-Cookie': [
          serialize('access-token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: -1, // Invalidate cookie by setting max-age to -1
            path: '/',
          }),
          serialize('refresh-token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: -1, // Invalidate cookie by setting max-age to -1
            path: '/',
          }),
        ],
      },
    }
  );
}
