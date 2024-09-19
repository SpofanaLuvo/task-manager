"use server";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Task, User } from "./definitions";

const bcrypt = require("bcrypt");

export const getCurrentDateTimeFormatted = () => {
  const now = new Date();
  
  return now.toISOString().slice(0, 19).replace('T', ' ');
}

const baseUrl = 'http://localhost:3000';

export const getAllTasks = async (user: any): Promise<any> => {
  console.log("-----------------------")
  console.log(user)
  const res = await fetch(`${baseUrl}/api/task`, { 
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Authorization': `Bearer ${user.accessToken}`,
    }
  });

  console.log("-----------------------")


  // console.log(res.json())
  console.log("-----------------------")
  

  if (!res.ok) {
    throw new Error(`An error occurred: ${res.statusText}`);
  }

  const tasks = await res.json();
  return tasks;
}

export const addTask = async (user: any, task: any): Promise<any> => {
  console.log("Endpoint Attempt to ADD TASK");

  const taskWithUserId = { ...task, user_id: user.user_id };

  const res = await fetch(`${baseUrl}/api/task`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    },
    body: JSON.stringify(taskWithUserId)
  });

  if (!res.ok) {
    throw new Error(`An error occurred: ${res.statusText}`);
  }

  const newTask = await res.json();
  return newTask;
}

export const editTask = async (user: any, task_id: string, updated_task: any): Promise<any> => {
  console.log("Task update fetch");

  const updatedTaskWithUserId = { ...updated_task, user_id: user.user_id };

  console.log(task_id, updatedTaskWithUserId);
  const res = await fetch(`${baseUrl}/api/task/${task_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    },
    body: JSON.stringify(updatedTaskWithUserId)
  });

  if (!res.ok) {
    throw new Error(`An error occurred: ${res.statusText}`);
  }

  const updatedTask = await res.json();
  return updatedTask;
}

export const deleteTask = async (user: any, id: string): Promise<void> => {
  console.log("Attempting to delete task");

  const res = await fetch(`${baseUrl}/api/task/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${user.token}`
    }
  });

  if (!res.ok) {
    throw new Error(`An error occurred: ${res.statusText}`);
  }
}