import { NextResponse } from "next/server";
import {
  queryDeleteTask,
  queryUpdateTask
} from "@/app/server_lib/task_queries";

export async function DELETE(request: Request, context: any) {
    const { params } = context;
    const task_id = params.task_id.toString();

    const success = await queryDeleteTask(task_id);
    if (success) {
      return NextResponse.json({ message: "Task deleted successfully" });
    } else {
      return NextResponse.json(
        { message: "Task deletion failed" },
        { status: 500 }
      );
    }
  }

  export async function PUT(request: Request, context: any) {
    const { params } = context;

    const task_id = params.task_id.toString();
    const updatedTask = await request.json();

    const task = await queryUpdateTask(task_id, updatedTask);

    if (task) {
      return NextResponse.json({ task });
    } else {
      return NextResponse.json(
        { message: "Task update failed" },
        { status: 500 }
      );
    }
  }
  