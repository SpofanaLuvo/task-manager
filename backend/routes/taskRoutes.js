const express = require("express");
const router = express.Router();
const {
    getTasksByUser,
    createTask,
    updateTask,
    deleteTask
} = require("../controllers/tasksController");

const { protect } = require("../middleware/authMiddleware");

// router.get("/", getAvailableCleaners);
router.get("/task/:user_id", protect, getTasksByUser);
router.route("/task").post(protect, createTask).put(protect, updateTask);
router.delete("/task/:task_id", protect, deleteTask);

module.exports = router;
