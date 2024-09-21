"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddTask from '../components/AddTask';
import TodoList from '../components/TodoList';
import useAuthStore from '@/store/authStore';
import apiClient from '@/apiClient';

const Tasks = () => {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken); 
  const refreshAccessToken = useAuthStore((state) => state.refreshAccessToken);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      // Ensure that we have the necessary information before fetching tasks
      if (!user || !accessToken) {
        console.log("JJDBUSDUSHDUIHSGU");
        return; 
      } 

      if (!accessToken && refreshAccessToken) {
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          alert("Logged out, logging you back in");
          router.push('/');
          return;
        }
      }

      try {
        const res = await apiClient.get(`/api/user_tasks/${user.id}`, {
          withCredentials: true,
        });

        console.log("fetchingggg")

        if (res.status === 200) {
          setTasks(res.data);
          console.log(res.data);
        } else {
          console.error("Error fetching tasks:", res.statusText);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user, accessToken, refreshAccessToken, router]);

  if (!user) {
    return <div>Loading...</div>;  // Optionally, you can add a more user-friendly loading screen
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
};

export default Tasks;
