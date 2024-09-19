"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const bcrypt = require("bcrypt");

export async function queryGetUser(email: string) {
  try {
    const result = await sql`SELECT * FROM kanban_users WHERE email=${email}`;

    if (result.rowCount > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to check if user exists:", error);
    throw new Error("Failed to check if user exists.");
  }
}

export async function queryRegisterUser(user: any) {
  try {
    const { username, email, password } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date();
    const currentDateTime = now.toISOString().slice(0, 19).replace("T", " ");

    const insertedUser = await sql`
           INSERT INTO kanban_users (username, email, password, created_at)
           VALUES (${username}, ${email}, ${hashedPassword}, ${currentDateTime})
           ON CONFLICT (id) DO NOTHING;
           `;
          console.log("INSERTED USER----------------")
           console.log(insertedUser.rows)
           console.log("INSERTED USER----------------")

    if (insertedUser.rowCount > 0) {
      return insertedUser.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to register User:", error);
    throw new Error("Failed to check if user exists.");
  }
}
