import { NextResponse } from "next/server";
import {
  queryCreateTask,
  queryGetTaskById,
  queryDeleteTask,
  queryAllTasks,
  queryGetUser,
  queryUpdateTask
} from "@/server_lib/actions";

// TASKS Handlers
export async function GET() {
  const tasks = await queryAllTasks();
  
  console.log(NextResponse.json(tasks))

  return tasks ? NextResponse.json(tasks) : NextResponse.json(
    { message: "Could not fetch tasks" },
    { status: 500 }
  );
}

export async function POST(request: Request) {
  try {
    console.log("Endpoint: Attempt to create a task");
    const data = await request.json();
    console.log(data)
    const task = await queryCreateTask(data);

    console.log(task)
    
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

