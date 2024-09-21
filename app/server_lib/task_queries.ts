"use server";

import { sql } from "@vercel/postgres";
import { TaskCreate, User } from "../client_lib/definitions";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function queryAllTasks(user_id: string) {
  try {
    const tasks = await sql`
      SELECT * FROM tasks
      WHERE user_id = ${user_id}
    `;
    console.log("QUERY EXECUTED HERE --------------------")
    // console.log(tasks.rows)
    console.log("------------------------------")

    if (tasks.rowCount > 0) {
      console.log("Tasks retrieved:", tasks);
    } else {
      console.log("No tasks found for user id:", user_id);
    }

    revalidatePath('/tasks');
    // redirect('/dashboard/invoices');

    return tasks.rows;
  } catch (error) {
    console.error("Database Error: Failed to Read Tasks:", error);
    throw error;
  }  
}

export async function queryCreateTask(newTask: TaskCreate) {
  try {
    await sql`
      INSERT INTO tasks (user_id, title, description, status, due_date, created_at, updated_at)
      VALUES (${newTask.user_id}, ${newTask.title}, ${newTask.description}, ${newTask.status},${newTask.due_date},${newTask.created_at}, ${newTask.updated_at})
      ON CONFLICT (id) DO NOTHING;
      `;
      console.log("TASK HAS BEEN CREATE")
    return "task created successfully";
  } catch (error) {
    return {
      message: error,
    };
  }
}

export async function queryUpdateTask(taskId: any, updatedData: any) {
  try {
    const { title, description, status, due_date } = updatedData;

    const now = new Date();
    const currentDateTime = now.toISOString().slice(0, 19).replace("T", " ");

    const result = await sql`
              UPDATE kanban_tasks
              SET title = ${title}, description = ${description}, status = ${status}, due_date = ${due_date}, updated_at = ${currentDateTime}
              WHERE id = ${taskId}
              RETURNING *
          `;
    return result || null;
  } catch (error) {
    console.error("Database Error: Failed to Update Task:", error);
    throw error;
  }
}

export async function queryDeleteTask(taskId: any) {
  try {
    await sql`
              DELETE FROM tasks WHERE task_id = ${taskId}
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
    return task || null;
  } catch (error) {
    console.error("Database Error: Failed to Read Task:", error);
    throw error;
  }
}
