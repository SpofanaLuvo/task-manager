"use client";

import { ITask } from "@/interfaces/tasks";
import { FormEventHandler, useState } from "react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { deleteTask, editTask } from "../client_lib/task_actions";
import { AiOutlinePlus } from "react-icons/ai";
import { FiEdit, FiTrash2 } from "react-icons/fi";


const Task: React.FC<any> = ({ task }) => {
  const router = useRouter();
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDeleted, setOpenModalDeleted] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    due_date: task.due_date,
    created_at: task.created_at,
    updated_at: task.updated_at
  });

  const handleSubmitEditTask: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const updatedTask = {
      ...taskToEdit,
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    await editTask(task.id, updatedTask);
    setOpenModalEdit(false);
    router.refresh();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTaskToEdit((prevState) => ({
      ...prevState,
      [name]: name === "user_id" ? Number(value) : value,
    }));
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    setOpenModalDeleted(false);
    router.refresh();
  };

  return (
    <tr key={task.task_id}>
      <td >{task.task_id}</td>
      <td className='w-full'>{task.title}</td>
      <td className='w-full'>{task.description}</td>
      <td className='w-full'>{task.status}</td>
      <td className='w-full'>{task.due_date}</td>
      <td className='w-full'>{task.created_at}</td>
      <td className='w-full'>{task.updated_at}</td>
      <td className='flex gap-5'>
        <FiEdit
          onClick={() => setOpenModalEdit(true)}
          cursor='pointer'
          className='text-blue-500'
          size={25}
        />
        <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
          <form onSubmit={handleSubmitEditTask}>
            <h3 className='font-bold text-lg mb-4'>Edit task</h3>
            <div className='space-y-4'>
              <label className="block">
                <span className="text-gray-700">Title:</span>
                <input
                  name="title"
                  value={taskToEdit.title ?? ''}
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
                  value={taskToEdit.description ?? ''}
                  onChange={handleInputChange}
                  placeholder="Description"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Status:</span>
                <select
                  name="status"
                  value={taskToEdit.status}
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
                  value={taskToEdit.due_date  ?? ''}
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
        <FiTrash2
          onClick={() => setOpenModalDeleted(true)}
          cursor='pointer'
          className='text-red-500'
          size={25}
        />
        <Modal modalOpen={openModalDeleted} setModalOpen={setOpenModalDeleted}>
          <h3 className='text-lg'>
            Are you sure you want to delete this task?
          </h3>
          <div className='modal-action'>
            <button onClick={() => handleDeleteTask(task.task_id)} className='btn'>
              Yes
            </button>
          </div>
        </Modal>
      </td>
    </tr>
  );
};

export default Task;
