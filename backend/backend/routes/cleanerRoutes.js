const express = require("express");
const router = express.Router();
const {
    getPendingTasks,
    getCompletedTasks,
    getTotals,
    getAllTasks,
} = require("../controllers/cleanersController");

const { protect } = require("../middleware/authMiddleware");

router.get("/tasks", getAllTasks);
router.get("/tasks/pending", protect, getPendingTasks);
router.get("/tasks/completed", protect, getCompletedTasks);
router.get("/totals", protect, getTotals);

module.exports = router;