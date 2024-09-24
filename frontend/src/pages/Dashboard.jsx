import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddTask from "../components/AddTask";
import TaskList from "../components/TaskList";
import { getAllTasks } from "../features/task_actions/task_service";
import { refreshAccessToken } from "../features/auth/authSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const accessToken = useSelector((state) => state.auth.user?.token);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const returnedData = await getAllTasks(user.user_email);
        setTasks(returnedData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user, accessToken, navigate, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="max-w-6xl mx-auto mt-4">
      <div className="text-center my-5 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Task Manager Hub</h1>
        {user && <AddTask />}
      </div>
      <TaskList tasks={tasks} />
    </main>
  );
};

export default Dashboard;
