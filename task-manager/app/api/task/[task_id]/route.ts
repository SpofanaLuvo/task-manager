import { NextResponse } from "next/server";
import {
  queryCreateTask,
  queryGetTaskById,
  queryDeleteTask,
  queryAllTasks,
  queryGetUser,
  queryUpdateTask
} from "@/server_lib/actions";

export async function DELETE(request: Request, context: any) {
    console.log("Enpoint: attempt to DELETE a task")
    const { params } = context;

    console.log(context)
    const task_id = params.task_id.toString();

    console.log(`Deleting task with id: ${task_id}`);
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

  export async function PUT(request: Request) {
    console.log("Endpoint: attempt to UPDATE a task")
    const { id, ...data } = await request.json();
    const task = await queryUpdateTask(id, data);
    if (task) {
      return NextResponse.json({ task });
    } else {
      return NextResponse.json(
        { message: "Task update failed" },
        { status: 500 }
      );
    }
  }
  