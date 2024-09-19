"use client";

import { AiOutlinePlus } from "react-icons/ai";
import Modal from "./Modal";
import { FormEventHandler, useState } from "react";
import { getCurrentDateTimeFormatted, addTask } from "../client_lib/task_actions";
import { useRouter } from "next/navigation";

const AddTask = () => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [task, setTask] = useState({
    user_id: 4,
    title: "",
    description: "",
    status: "Pending",
    due_date: "",
    created_at: "",
    updated_at: ""
  });

  const handleSubmitNewTask: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const now = new Date();
    const currentDateTime = now.toISOString().slice(0, 19).replace('T', ' ')
    
    const newTask = {
      ...task,
      created_at: currentDateTime,
      updated_at: currentDateTime
    };

    console.log("Attempt to ADD TASK 1");
    console.log(newTask);

    await addTask(newTask);
    setModalOpen(false);
    router.refresh();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTask((prevState) => ({
      ...prevState,
      [name]: name === "user_id" ? Number(value) : value,
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
              <span className="text-gray-700">User ID:</span>
              <input
                name="user_id"
                value={task.user_id}
                onChange={handleInputChange}
                type="number"
                placeholder="User ID"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Title:</span>
              <input
                name="title"
                value={task.title}
                onChange={handleInputChange}
                type="text"
                placeholder="Title"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Description:</span>
              <textarea
                name="description"
                value={task.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Status:</span>
              <select
                name="status"
                value={task.status}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
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
                placeholder="Due Date"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
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
