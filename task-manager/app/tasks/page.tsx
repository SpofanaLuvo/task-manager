"use client";

import AddTask from "../components/AddTask";
import TodoList from "../components/TodoList";
import { getAllTasks } from "../client_lib/task_actions";
import { useState, useEffect } from "react";

import { useAuthStore } from "@/store/store";
import { stat } from "fs";

export default function Home() {
  const [tasks, setTasks] = useState([]);

  const user = useAuthStore((state: any) => state.user)
  console.log(user);
     
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getAllTasks();
        setTasks(data);

      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);
  return (
    <main className="max-w-4xl mx-auto mt-4">
      <div className="text-center my-5 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Todo List App</h1>
        <AddTask />
      </div>
      <TodoList tasks={tasks} />
    </main>
  );
}
