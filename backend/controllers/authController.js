const { getTransactionsPaginationQuery,createUser, getTransactionsQuery, deleteTransactionQuery, updateTransactionQuery, addTransactionQuery, getTransactionsOfLast30DaysQuery, getTransactionsOfLast7DaysQuery, userCheckQuery } = require("../models/userModel");

const registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = await createUser(username, password);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error"); 
  }
};

const userCheck = async (req, res) => {
      const { username, password } = req.body;
      try {
        const userInfo = await userCheckQuery(username,password);
        res.status(201).json(userInfo);
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
    };
const getTransactions = async (req, res) => {
      const { id } = req.params;
      try {
        const allTransactions = await getTransactionsQuery(id);
        res.status(201).json(allTransactions);
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
    };

const getTransactionsPagination = async (req, res) => {
      const { id } = req.params;
      const page = parseInt(req.query.page) || 1; // Default to 1
      const limit = 10;
      try {
        const allTransactions = await getTransactionsPaginationQuery(id,page,limit);
        res.status(201).json(allTransactions);
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
    };
const getTransactionsOfLast30Days = async (req, res) => {
      const { id } = req.params;
      try {
        const allTransactions = await getTransactionsOfLast30DaysQuery(id);
        res.status(201).json(allTransactions);
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
    };

const getTransactionsOfLast7Days = async (req, res) => {
      const { id } = req.params;
      try {
        const allTransactions = await getTransactionsOfLast7DaysQuery(id);
        res.status(201).json(allTransactions);
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
    };

const deleteTransaction = async (req, res) => {
      const { id } = req.params;
      try {
        const result = await deleteTransactionQuery(id);
        if (result === 0) {
          return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json({ message: "Transaction deleted successfully" });
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
    };

const updateTransaction = async (req, res) => {
      const { id } = req.params;
      const { description, amount, transaction_type } = req.body;
    
      try {
        const result = await updateTransactionQuery(id,  description, amount, transaction_type);
    
        if (result.rowCount === 0) {
          return res.status(404).json({ message: "Transaction not found" });
        }
    
        res.status(200).json(result.rows);
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
    }


const addTransaction = async (req, res) => {
      const { amount, description, transaction_type, space_id } = req.body;
      try {
        const newTransaction = await addTransactionQuery(amount, description, transaction_type, space_id)
        res.status(201).json(newTransaction.rows[0]);
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
    };
    
module.exports = { getTransactionsPagination,registerUser, getTransactions, deleteTransaction, updateTransaction, addTransaction, getTransactionsOfLast30Days, getTransactionsOfLast7Days, userCheck };
