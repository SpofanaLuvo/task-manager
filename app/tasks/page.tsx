"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import AddTask from "../components/AddTask";
import TodoList from "../components/TodoList";
import { getAllTasks } from "../client_lib/task_actions";
import useAuthStore from '@/store/authStore';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const accessToken = useAuthStore((state) => state.accessToken); 
  const refreshAccessToken = useAuthStore((state) => state.refreshAccessToken);

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) {
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          router.push('/'); 
          return;
        }
      }

      try {
        const data = await getAllTasks();
        setTasks(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken, refreshAccessToken, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="max-w-6xl mx-auto mt-4">
      <div className="text-center my-5 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Task Manager Hub</h1>
        <AddTask />
      </div>
      <TodoList tasks={tasks} />
    </main>
  );
}
