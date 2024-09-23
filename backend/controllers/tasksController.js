const asyncHandler = require("express-async-handler");
const { insert, select, queryDeleteTask, queryUpdateTask } = require("../helpers/helperData");
const pool = require("../config/dbConnection");

//@desc = Get all tasks from user
//@route = GET /api/tasks/
//@access = Public
const getTasksByUser = asyncHandler(async (req, res) => {
    const { user_email } = req.params;

    try {
        allTasks = await pool.query(select.tasksByUserEmail(user_email));
    } catch (error) {
        console.log(error);
    }

    allTasks.rows.length > 0
        ? res.status(200).json(allTasks.rows)
        : res.status(200).json("There are currently no tasks");
});

//@desc = Create a task
//@route = POST /api/tasks/
//@access = Public
const createTask = asyncHandler(async (req, res) => {
    const task = req.body;
    try {
        
        const newTask = await pool.query(
            insert.task(task)
        );

        newTask.rowCount > 0
            ? res.status(201).json(newTask.rows[0]) 
            : res.status(400).json("Failed to create task.");
    } catch (error) {
        console.error(error);
        res.status(500).json("Server error while creating task.");
    }
});

//@desc = Update a task
//@route = PUT /api/tasks/:task_id
//@access = Public
const updateTask = asyncHandler(async (req, res) => {
    const updatedTaskData = req.body;
   
    try {
        const updatedTask = await pool.query(queryUpdateTask(updatedTaskData));

        updatedTask.rowCount > 0
            ? res.status(200).json(updatedTask.rows[0])
            : res.status(404).json("Task not found or failed to update.");
    } catch (error) {
        console.error(error);
        res.status(500).json("Server error while updating task.");
    }
});


//@desc = Delete a task
//@route = DELETE /api/tasks/:task_id
//@access = Public
const deleteTask = asyncHandler(async (req, res) => {
    const { task_id } = req.params;

    try {
        const result = await pool.query(queryDeleteTask(task_id)
        );

        result.rowCount > 0
            ? res.status(200).json({ message: "Task deleted successfully." })
            : res.status(404).json("Task not found or failed to delete.");
    } catch (error) {
        console.error(error);
        res.status(500).json("Server error while deleting task.");
    }
});


module.exports = {
    getTasksByUser,
    createTask,
    updateTask,
    deleteTask
};