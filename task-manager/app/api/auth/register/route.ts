import { sign as jwtSign } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { queryGetUser, queryRegisterUser } from "@/app/server_lib/user_queries";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    const body = await request.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
        return NextResponse.json(
            { message: "User registration failed. All fields are required" },
            { status: 401 }
        );
    }

    const existingUser = await queryGetUser(email);

    if (existingUser) {
        return NextResponse.json(
            { message: "User already exists" },
            { status: 400 }
        );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Register user
    const userResult = await queryRegisterUser({
        username, email, password: hashedPassword
    });

    if (userResult) {
        const user = userResult.rows[0];
        
        const token = generateToken(user.id);

        return NextResponse.json(
            {
                message: {
                    id: user.id,
                    name: user.username,
                    email: user.email,
                    token: token
                }
            },
            { status: 200 }
        );
    } else {
        return NextResponse.json(
            { message: "User registration failed. Invalid user data" },
            { status: 400 }
        );
    }
}

const generateToken = (userId:any) => {
    const secret = process.env.JWT_SECRET || "";
    return jwtSign({ userId }, secret, { expiresIn: "30d" });
};
