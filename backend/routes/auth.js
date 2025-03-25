const express = require("express");
const router = express.Router();
const { registerUser, getTransactions, deleteTransaction, updateTransaction, addTransaction } = require("../controllers/authController");

// Route for registering a user
router.post("/register", registerUser);
router.get("/transactions/:id", getTransactions);
router.delete("/transactions/delete/:id", deleteTransaction);
router.put("/transactions/update/:id", updateTransaction);
router.post("/transactions/add", addTransaction);

module.exports = router;
