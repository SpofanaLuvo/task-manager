const asyncHandler = require("express-async-handler");
const { insertInto, selectFrom, queryDeleteTask, queryUpdateTask } = require("../helpers/helperData");
const pool = require("../config/dbConnection");

//@desc = Get all tasks from user
//@route = GET /api/tasks/
//@access = Public
const getTasksByUser = asyncHandler(async (req, res) => {
    const { user_id } = req.params; // Extract user_id from request parameters

    try {
        allTasks = await pool.query(select.tasksByUserId(user_id));
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
    const task = req.body; // Destructure task data from request body

    try {
        // Insert the new task into the database with the data from the request body
        const newTask = await pool.query(
            insert.task(task)
        );

        // Respond with the newly created task
        newTask.rows.length > 0
            ? res.status(201).json(newTask.rows[0]) // Return the created task
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
    const updatedTaskData = req.body;  // Destructure task details from the request body

    try {
        // Update the task with new values provided in the request body
        const updatedTask = await pool.query(queryUpdateTask(updatedTaskData));

        // Respond with the updated task or handle failure
        updatedTask.rows.length > 0
            ? res.status(200).json(updatedTask.rows[0])  // Return the updated task
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
    const { task_id } = req.params;  // Get task_id from the URL parameters

    try {
        // Delete the task from the database
        const result = await pool.query(queryDeleteTask(task_id)
        );

        // Respond with success or failure message
        result.rows.length > 0
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