import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { deleteTask, editTask } from '../features/task_actions/task_service';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const Task = ({ task }) => {
  const navigate = useNavigate();
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState({
    title: task.title,
    description: task.description,
    status: task.task_status,
    due_date: task.due_date,
  });

  const handleSubmitEditTask = async (e) => {
    e.preventDefault();

    const updatedTask = {
      task_id: task.task_id,
      ...taskToEdit
    };

    console.log("UPDATED TASK FROM EDIT")
    console.log(updatedTask)

    console.log("UPDATED TASK FROM EDIT")


    await editTask(updatedTask);
    setOpenModalEdit(false);
    navigate(0); // Refresh the page after editing the task
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskToEdit((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDeleteTask = async (id) => {
    console.log("ATEMPTING TO DELETE TASK WITH ID", id)
    await deleteTask(id);
    setOpenModalDelete(false);
    navigate(0); // Refresh the page after deleting the task
  };

  return (
    <tr key={task.task_id}>
      <td>{task.task_id}</td>
      <td className='w-full'>{task.title}</td>
      <td className='w-full'>{task.description}</td>
      <td className='w-full'>{task.task_status}</td>
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
              <label className='block'>
                <span className='text-gray-700'>Title:</span>
                <input
                  name='title'
                  value={taskToEdit.title ?? ''}
                  onChange={handleInputChange}
                  type='text'
                  placeholder='Title'
                  className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none'
                />
              </label>
              <label className='block'>
                <span className='text-gray-700'>Description:</span>
                <textarea
                  name='description'
                  value={taskToEdit.description ?? ''}
                  onChange={handleInputChange}
                  placeholder='Description'
                  className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none'
                />
              </label>
              <label className='block'>
                <span className='text-gray-700'>Status:</span>
                <select
                  name='status'
                  value={taskToEdit.status ?? ''}
                  onChange={handleInputChange}
                  className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none'
                >
                  <option value='Pending'>Pending</option>
                  <option value='In Progress'>In Progress</option>
                  <option value='Completed'>Completed</option>
                </select>
              </label>
              <label className='block'>
                <span className='text-gray-700'>Due Date:</span>
                <input
                  name='due_date'
                  value={taskToEdit.due_date ?? ''}
                  onChange={handleInputChange}
                  type='date'
                  placeholder='Due Date'
                  className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none'
                />
              </label>
              <button
                type='submit'
                className='w-full bg-gray-900 text-gray-100 hover:text-gray-900 hover:bg-gray-100 py-2 rounded-md'
              >
                Submit
              </button>
            </div>
          </form>
        </Modal>
        <FiTrash2
          onClick={() => setOpenModalDelete(true)}
          cursor='pointer'
          className='text-red-500'
          size={25}
        />
        <Modal modalOpen={openModalDelete} setModalOpen={setOpenModalDelete}>
          <h3 className='text-lg'>Are you sure you want to delete this task?</h3>
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
