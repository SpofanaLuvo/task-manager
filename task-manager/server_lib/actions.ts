"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { TaskCreate, User } from "../app/lib/definitions";
import { getCurrentDateTimeFormatted } from "@/app/lib/actions";

const bcrypt = require("bcrypt");

export async function queryAllTasks() {
  console.log("SERVER: attempt to GET all tasks");
  try {
    const tasks = await sql`
              SELECT * FROM kanban_tasks
          `;
    return tasks.rows;
  } catch (error) {
    console.error("Database Error: Failed to Read Tasks:", error);
    throw error;
  }
}

export async function queryCreateUser(data: User) {
  console.log("SERVER: attempt to Create a user");
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const user = data;

    // Insert data into the "users" and "tasks" table
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const insertedUser = await sql`
          INSERT INTO kanban_users (username, email, password, created_at)
          VALUES (${user.username}, ${user.email}, ${hashedPassword}, ${user.created_at})
          ON CONFLICT (id) DO NOTHING;
          `;

    return {
      insertedUser,
    };
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

export async function queryCreateTask(newTask: TaskCreate) {
  console.log("SERVER: attempt to CREATE a task");

  try {
    await sql`
      INSERT INTO kanban_tasks (user_id, title, description, status, created_at, updated_at)
      VALUES (${newTask.user_id}, ${newTask.title}, ${newTask.description}, ${newTask.status}, ${newTask.created_at}, ${newTask.updated_at})
      ON CONFLICT (id) DO NOTHING;
      `;
      return "task created successfully"
  } catch (error) {
    return {
      message: error,
    };
  }
}

export async function queryUpdateTask(taskId, updatedData) {
  console.log("SERVER: attempt to Update a task");
  try {
    const { title, description, status } = updatedData;
    let updated_at = getCurrentDateTimeFormatted();

    const result = await sql`
              UPDATE kanban_tasks
              SET title = ${title}, description = ${description}, status = ${status}, updated_at = ${updated_at}
              WHERE id = ${taskId}
              RETURNING *
          `;
    return result[0] || null;
  } catch (error) {
    console.error("Database Error: Failed to Update Task:", error);
    throw error;
  }
}

export async function queryDeleteTask(taskId) {
  console.log("SERVER: attempt to DELETE a task");
  try {
    await sql`
              DELETE FROM kanban_tasks WHERE id = ${taskId}
          `;
    return { message: "Task deleted successfully" };
  } catch (error) {
    console.error("Database Error: Failed to Delete Task:", error);
    throw error;
  }
}

export async function queryGetTaskById(taskId: string) {
  try {
    const task = await sql`
              SELECT * FROM kanban_tasks WHERE id = ${taskId}
          `;
    return task[0] || null;
  } catch (error) {
    console.error("Database Error: Failed to Read Task:", error);
    throw error;
  }
}

export async function queryGetUser(email: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}
