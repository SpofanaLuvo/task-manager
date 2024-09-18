"use server";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Task, User } from "./definitions";

const { db } = require("@vercel/postgres");
const bcrypt = require("bcrypt");

export const getCurrentDateTimeFormatted = () => {
  const now = new Date();
  
  return now.toISOString().slice(0, 19).replace('T', ' ');
}

import { ITask } from "../../interfaces/tasks";

const baseUrl = 'http://localhost:3002';

export const getAllTasks = async (): Promise<ITask[]> => {
  const res = await fetch(`${baseUrl}/api/task`, { cache: 'no-store' });
  const tasks = await res.json();
  return tasks;
}

export const addTask = async (task: ITask): Promise<ITask> => {
  console.log("Endpoint Attemp to ADD TASK 1")

  console.log(task)
  const res = await fetch(`${baseUrl}/api/task`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  })

  const newTodo = await res.json();
  console.log(newTodo)
  return newTodo;
}

export const editTask = async (task: ITask): Promise<ITask> => {
  const res = await fetch(`${baseUrl}/tasks/${task.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  })
  const updatedTodo = await res.json();
  return updatedTodo;
}

export const deleteTask = async (id: string): Promise<void> => {
  await fetch(`${baseUrl}/api/task/${id}`, {
    method: 'DELETE',
  })
}
