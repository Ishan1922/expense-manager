const express = require("express");
const router = express.Router();
const { registerUser, getTransactions, deleteTransaction } = require("../controllers/authController");

// Route for registering a user
router.post("/register", registerUser);
router.get("/transactions/:id", getTransactions);
router.delete("/transactions/delete/:id", deleteTransaction);

module.exports = router;
