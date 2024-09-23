import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useSelector } from 'react-redux'; 
import { AiOutlinePlus } from 'react-icons/ai';
import Modal from './Modal';
import { addTask } from '../features/task_actions/task_service';

const AddTask = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    console.log("USER FROM ADD TASK pulled from State");
    console.log(user);
  }, [user]);

  const [task, setTask] = useState({
    user_email: user?.user_email ?? '',
    title: "",
    description: "",
    status: "Pending",
    due_date: "",
  });

  useEffect(() => {
    setTask(prevTask => ({
      ...prevTask,
      user_email: user?.user_email ?? ''
    }));
  }, [user]);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmitNewTask = async (e) => {
    e.preventDefault();

    const now = new Date();
    const currentDateTime = now.toISOString().slice(0, 19).replace("T", " ");

    try {
      const taskCreate = await addTask(task);
      if (taskCreate) {
        alert("Task added successfully");
      }
      setModalOpen(false);
      navigate(0);
    } catch (error) {
      console.error("Failed to add task:", error);
      alert("An error occurred while adding the task. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div>
      <button
        onClick={() => setModalOpen(true)}
        className="btn bg-gray-900 text-gray-100 hover:text-gray-900 hover:bg-gray-100 w-full"
      >
        Add new task <AiOutlinePlus className="ml-2" size={18} />
      </button>

      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <form onSubmit={handleSubmitNewTask}>
          <h3 className="font-bold text-lg mb-4">Add New Task</h3>
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700">Title:</span>
              <input
                name="title"
                value={task.title}
                onChange={handleInputChange}
                type="text"
                placeholder="Title"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none p-4"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Description:</span>
              <textarea
                name="description"
                value={task.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none p-4"
              />
            </label>
            
            <label className="block">
              <span className="text-gray-700">Status:</span>
              <select
                name="status"
                value={task.status}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none p-4"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </label>
            <label className="block">
              <span className="text-gray-700">Due Date:</span>
              <input
                name="due_date"
                value={task.due_date}
                onChange={handleInputChange}
                type="date"
                min={getTodayDate()}
                placeholder="Due Date"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none p-4"
              />
            </label>
            <button
              type="submit"
              className="w-full bg-gray-900 text-gray-100 hover:text-gray-900 hover:bg-gray-100 py-2 rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddTask;
