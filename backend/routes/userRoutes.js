const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    refreshAccessToken,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
router.post("/refresh-token",refreshAccessToken)
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

module.exports = router;