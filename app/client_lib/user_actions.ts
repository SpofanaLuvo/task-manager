"use server";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Task, User } from "./definitions";
import { ITask } from "../../interfaces/tasks";

const baseUrl = "http://localhost:3000";

export const getCurrentDateTimeFormatted = () => {
  const now = new Date();
  return now.toISOString().slice(0, 19).replace("T", " ");
};

export const loginUser = async (user: any): Promise<any> => {
  console.log("LOGIN ACTION TRIGGERED");
  console.log(user);
  console.log("LOGIN ACTION TRIGGERED");
  
  try {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
      cache: "no-store",
    });

    if (response.status !== 200) {
      return {error:"Incorrect email or Password"}
    }

    const loggedInUser = await response.json();
    console.log("LOGGED IN USER");
    console.log(loggedInUser);
    console.log("LOGGED IN USER");

    return {user: loggedInUser.message};
  } catch (error) {
    console.error("Error logging in user:", (error as Error).message);
    throw error; // Re-throw the error after logging it
  }
};

export const registerUser = async (user: any): Promise<any> => {
  try {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
      cache: "no-store",
    });

    if (res.status !== 200) {
        return {error:"Error registration failed"}
      }

    const newUser = await res.json();

    console.log("REGISTERED USER");
    console.log(newUser);
    console.log("REGISTERED USER");
    return {user: newUser.message};
  } catch (error) {
    console.error("Error registering user:", (error as Error).message);
    throw error; // Re-throw the error after logging it
  }
};
