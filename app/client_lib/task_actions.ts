
import apiClient from "@/apiClient"; // Ensure this path is correct for your setup

export const getAllTasks = async (user_id: any) => {
  try {
    const res = await apiClient.get(`/api/user_tasks/${user_id}`, {
      withCredentials: true,
    });

    if (res.status !== 200) {
      throw new Error(`An error occurred: ${res.statusText}`);
    }
    console.log("Attempt to get tasks")

    return res.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const addTask = async (task : any) => {
  console.log("CALLIGN THE API TO CREATE TASK")
  try {
    const res = await apiClient.post("/api/task", task, {
      withCredentials: true,
    });
  

    return res.data;
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};

export const editTask = async (task_id: string, updated_task: any) => {
  try {
    const res = await apiClient.put(`/api/task/${task_id}`, updated_task, {
      withCredentials: true,
    });

    if (res.status !== 200) {
      throw new Error(`An error occurred: ${res.statusText}`);
    }

    return res.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (id : string) => {
  try {
    const res = await apiClient.delete(`/api/task/${id}`);

    if (res.status !== 200) {
      throw new Error(`An error occurred: ${res.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};