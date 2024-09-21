const asyncHandler = require("express-async-handler");
const { insertInto, selectFrom } = require("../helpers/helperData");
const pool = require("../config/dbConnection");

//@desc = Get all tasks
//@route = GET /api/tasks/
//@access = Public
const getAllTasks = asyncHandler(async (req, res) => {
    let allTasks;

    try {
        allTasks = await pool.query(selectFrom.tasks);
    } catch (error) {
        console.log(error);
    }

    allTasks.rows.length > 0
        ? res.status(200).json(allTasks.rows)
        : res.status(200).json("There are currently no tasks");
});

//@desc = Get pending tasks
//@route = GET /api/tasks/pending
//@access = Private
const getPendingTasks = asyncHandler(async (req, res) => {
    let pendingTasks;

    try {
        tasks = await pool.query(selectFrom.tasks);
        pendingTasks = tasks.rows.filter(
            (task) =>
                task.status === "pending" &&
                task.assigned_to === req.user.user_id
        );
    } catch (error) {
        console.log(error);
    }

    pendingTasks.length > 0
        ? res.status(200).json(pendingTasks)
        : res
              .status(200)
              .json("There are no tasks assigned to the current user");
});

//@desc = Get completed tasks
//@route = GET /api/tasks/completed
//@access = Private
const getCompletedTasks = asyncHandler(async (req, res) => {
    let completedTasks;

    try {
        tasks = await pool.query(selectFrom.tasks);
        completedTasks = tasks.rows.filter(
            (task) =>
                task.status === "completed" &&
                task.assigned_to === req.user.user_id
        );
    } catch (error) {
        console.log(error);
    }

    completedTasks.length > 0
        ? res.status(200).json(completedTasks)
        : res
              .status(200)
              .json("There are no completed tasks under the current user");
});

//@desc = Get total Income
//@route = GET /api/totals/
//@access = Private
const getTotals = asyncHandler(async (req, res) => {
    const { cleaner_id, date, aggregationType } = req.body;

    if (!cleaner_id || !date || !aggregationType) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    let query, totalIncome;

    if (aggregationType !== "month") {
        query = selectFrom.paymentsForDay(cleaner_id, date);
    } else {
        query = selectFrom.paymentsForMonth(cleaner_id, date);
    }

    try {
        totalIncome = await pool.query(query);
    } catch (error) {
        console.log(error);
    }

    res.status(200).json(totalIncome.rows[0]);
});

module.exports = {
    getPendingTasks,
    getCompletedTasks,
    getTotals,
    getAllTasks,
};