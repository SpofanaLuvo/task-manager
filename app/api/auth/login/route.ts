import { sign as jwtSign } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { queryGetUser } from "@/app/server_lib/user_queries";
import bcrypt from "bcrypt";
import { serialize } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET!;
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes for access token
const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60; // 30 days for refresh token

const generateAccessToken = (email: string) => {
  return jwtSign({ email }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

const generateRefreshToken = (email: string) => {
  return jwtSign({ email }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
};

export async function POST(request: Request) {
  console.log("LOGIN ENDPOINT")
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "User login failed. All fields are required" },
        { status: 401 }
      );
    }

    const userResult = await queryGetUser(email);

    if (!userResult) {
      return NextResponse.json(
        { message: "User login failed. Invalid user data" },
        { status: 400 }
      );
    }

    const user = userResult;

    if (await bcrypt.compare(password, user.password)) {
      const accessToken = generateAccessToken(email);
      const refreshToken = generateRefreshToken(email);
      
      return NextResponse.json(
        {
          message: {
            id: user.id,
            name: user.username,
            email: user.email,
          },
        },
        {
          status: 200,
          headers: {
            'Set-Cookie': [
              serialize('access-token', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                maxAge: 15 * 60, // 15 minutes
                path: '/',
              }),
              serialize('refresh-token', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                maxAge: REFRESH_TOKEN_EXPIRY, // 30 days
                path: '/',
              }),
            ],
          },
        }
      );
    }

    return NextResponse.json(
      { message: "User login failed. Invalid user credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: "Error processing login request." },
      { status: 500 }
    );
  }
}
