import { NextResponse } from 'next/server';
import { queryAllTasks } from '@/app/server_lib/task_queries';

export async function GET(request: Request, context: any) {
  const { user_id } = context.params;

  if (!user_id) {
    return NextResponse.json({ message: "User ID is required" }, { status: 400 });
  }

  try {
    const tasks = await queryAllTasks(user_id);

    console.log(tasks)
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ message: "Could not fetch tasks" }, { status: 500 });
  }
}
