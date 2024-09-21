// pages/api/refresh.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRY = '15m'; // 15 minutes for access token
const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60; // 30 days for refresh token

const generateAccessToken = (email: string) => {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

export async function POST(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => c.split('=')));
  const refreshToken = cookies['refresh-token'];

  if (!refreshToken) {
    return NextResponse.json({ message: 'Refresh token not provided' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as jwt.JwtPayload;
    const accessToken = generateAccessToken(decoded.email);

    return NextResponse.json(
        { accessToken },
        {
          status: 200,
          headers: {
            'Set-Cookie': serialize('access-token', accessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV !== 'development',
              sameSite: 'strict',
              maxAge: 15 * 60, // 15 minutes
              path: '/',
            }),
          },
        }
      );
  } catch (error) {
    console.log("invalid refresh token")
    return NextResponse.json({ message: 'Invalid refresh token' }, { status: 401 });
  }
};
