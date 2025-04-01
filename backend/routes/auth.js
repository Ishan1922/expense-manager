const express = require("express");
const router = express.Router();
const { getCategories,registerUser, getTransactions, deleteTransaction, updateTransaction, addTransaction, getTransactionsOfLast30Days, getTransactionsOfLast7Days,userCheck, getFilteredTransactions } = require("../controllers/authController");

// Route for registering a user
router.post("/register", registerUser);
router.post("/userCheck", userCheck);
// router.get("/transactions/:id", getTransactions);
router.get("/transactions/:id", getFilteredTransactions);
router.get("/transactions/past-month/:id", getTransactionsOfLast30Days);
router.get("/transactions/past-week/:id", getTransactionsOfLast7Days);
router.delete("/transactions/delete/:id", deleteTransaction);
router.put("/transactions/update/:id", updateTransaction);
router.post("/transactions/add", addTransaction);
router.get("/getCategories",getCategories);

module.exports = router;
