import React from "react";
import Task from "./Task";

const TaskList = ({ tasks }) => {
  if (!Array.isArray(tasks)) {
    return <div>No tasks available.</div>;
  }

  return (
    <div className='overflow-x-auto'>
      <table className='table w-full'>
        <thead>
          <tr>
            <th>Task ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Task Status</th>
            <th>Due Date</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <Task key={task.task_id} task={task} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;