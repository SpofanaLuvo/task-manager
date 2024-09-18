import { NextResponse } from "next/server";
import {createUser, getUser } from '../../lib/actions'

// USERS Handlers

export async function GET(request : Request) {
    const data = await request.json()
    const user = await getUser(data);
    if (user) {
        return NextResponse.json({ user });
    } else {
        return NextResponse.json({ message: "Could not fetch users" }, { status: 500 });
    }
}

export async function POST(request : Request) {
    const data = await request.json();
    const user = await createUser(data);
    if (user) {
        return NextResponse.json({ user });
    } else {
        return NextResponse.json({ message: "User creation failed" }, { status: 500 });
    }
}
