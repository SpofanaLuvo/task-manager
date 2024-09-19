import { NextResponse } from "next/server";
import {
  queryCreateTask,
  queryAllTasks,
} from "@/app/server_lib/task_queries";

// TASKS Handlers
export async function GET() {
  const tasks = await queryAllTasks();

  return tasks ? NextResponse.json(tasks) : NextResponse.json(
    { message: "Could not fetch tasks" },
    { status: 500 }
  );
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const task = await queryCreateTask(data);

    if (task) {
      return NextResponse.json({ task });
    } else {
      return NextResponse.json(
        { message: "Task creation failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the task" },
      { status: 500 }
    );
  }
}

