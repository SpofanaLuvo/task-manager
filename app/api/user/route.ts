import { NextResponse } from "next/server";
import {
queryGetUser,
} from "@/app/server_lib/user_queries";

// USERS Handlers

export async function GET(request : Request) {
    const data = await request.json()
    const user = await queryGetUser(data);
    if (user) {
        return NextResponse.json({ user });
    } else {
        return NextResponse.json({ message: "Could not fetch users" }, { status: 500 });
    }
}

