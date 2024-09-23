const express = require("express");
const router = express.Router();
const {
    getTasksByUser,
    createTask,
    updateTask,
    deleteTask
} = require("../controllers/tasksController");

const { protect } = require("../middleware/authMiddleware");

router.get("/:user_email", protect, getTasksByUser);
router.route("/").post(protect, createTask).put(protect, updateTask);
router.delete("/:task_id", protect, deleteTask);

module.exports = router;
