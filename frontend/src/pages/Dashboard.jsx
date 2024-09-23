import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddTask from '../components/AddTask';
import TaskList from '../components/TaskList';
import { getAllTasks } from '../features/task_actions/task_service';
import { refreshAccessToken } from '../features/auth/authSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Selectors for Redux state
  const user = useSelector((state) => state.auth.user);
  const accessToken = useSelector((state) => state.auth.user?.accessToken);
  
  // Local state for tasks and loading
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user || !accessToken) {
        // Optionally, we can dispatch a refresh token action if it's needed
        const resultAction = await dispatch(refreshAccessToken());
      
        if (refreshAccessToken.fulfilled.match(resultAction)) {
          // Token refresh was successful
          console.log("refresh token still valid")
        } else {
          // Token refresh failed, navigate to login
          navigate('/login');
          return;
        }
      }

      // Fetch tasks
      try {
        const returnedData = await getAllTasks(user.user_id);
        setTasks(returnedData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false); // Ensure loading state is cleared
      }
    };

    fetchTasks();
  }, [user, accessToken, navigate, dispatch]);

  if (loading) {
    return <div>Loading...</div>; // Optionally, you can add a more user-friendly loading screen
  }

  return (
    <main className="max-w-6xl mx-auto mt-4">
      <div className="text-center my-5 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Task Manager Hub</h1>
        <AddTask />
      </div>
      <TaskList tasks={tasks} />
    </main>
  )
}

export default Dashboard;
