import { sign as jwtSign } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { queryGetUser } from "@/app/server_lib/user_queries"; // Assuming queryRegisterUser is not needed here
import bcrypt from "bcrypt";

const MAX_AGE = 60 * 60 * 24 * 30; // 30 days in seconds

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { message: "User login failed. All fields are required" },
      { status: 401 }
    );
  }

  const userResult = await queryGetUser(email);

  if (userResult) {
    const user = userResult;

    if (await bcrypt.compare(password, user.password)) {
      const token = generateToken(user.id);

      return NextResponse.json(
        {
          message: {
            id: user.id,
            name: user.username,
            email: user.email,
            token,
          },
        },
        { status: 200 }
      );
    }
  }

  return NextResponse.json(
    { message: "User login failed. Invalid user data" },
    { status: 400 }
  );
}

const generateToken = (userId:any) => {
  const secret = process.env.JWT_SECRET || "";
  return jwtSign({ userId }, secret, { expiresIn: MAX_AGE });
};
