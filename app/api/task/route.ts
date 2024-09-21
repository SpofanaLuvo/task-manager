import { NextResponse } from "next/server";
import {
  queryCreateTask,
} from "@/app/server_lib/task_queries";

// TASKS Handlers


export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("DATA FROM THE REQUEST")
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

