
import apiClient from "../../apiClient"; // Ensure this path is correct for your setup

export const getAllTasks = async (user_email) => {
  try {

    console.log("CALLING TASKS")
    const res = await apiClient.get(`/api/task/${user_email}`, {
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

export const addTask = async (task) => {
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

export const editTask = async (updated_task) => {

  console.log("UPDATED TASK")
  console.log(updated_task)
  console.log("UPDATED TASK")
  try {
    const res = await apiClient.put(`/api/task/`, updated_task, {
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

export const deleteTask = async (task_id) => {
  try {
    const res = await apiClient.delete(`/api/task/${task_id}`);

    if (res.status !== 200) {
      throw new Error(`An error occurred: ${res.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
