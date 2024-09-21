import { NextResponse } from 'next/server';
import { queryAllTasks } from '@/app/server_lib/task_queries';

export async function GET(request: Request, context: any) {
    const { user_id } = context.params;
  
    if (!user_id) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }
  
    try {
      const tasks = await queryAllTasks(user_id.toString());
  
      const response = NextResponse.json(tasks);
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      response.headers.set('Surrogate-Control', 'no-store');
  
      return response;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return NextResponse.json({ message: "Could not fetch tasks" }, { status: 500 });
    }
  }
