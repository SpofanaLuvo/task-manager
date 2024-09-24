import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useSelector } from 'react-redux'; 
import { AiOutlinePlus } from 'react-icons/ai';
import Modal from './Modal';
import { addTask } from '../features/task_actions/task_service';
import { toast } from 'react-toastify';

const AddTask = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [task, setTask] = useState({
    user_email: user?.user_email || '',
    title: "",
    description: "",
    status: "Pending",
    due_date: "",
  });

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const handleSubmitNewTask = async (e) => {
    e.preventDefault();    

    try {
      await addTask(task);
      
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
              <div className="relative">
                <select
                  name="status"
                  value={task.status}
                  onChange={handleInputChange}
                  className="appearance-none mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none p-4"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M5.516 7.548l4.484 4.484 4.484-4.484h-8.968z"/>
                  </svg>
                </div>
              </div>
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
