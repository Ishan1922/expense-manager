const { createUser, getTransactionsQuery } = require("../models/userModel");

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

const getTransactions = async (req, res) => {
      console.log("req params ---",req.params);
      const { id } = req.params;
      try {
        const allTransactions = await getTransactionsQuery(id);
        res.status(201).json(allTransactions);
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
    };

const deleteTransaction = async (req, res) => {
      const { id } = req.params;
      try {
        const result = await pool.query("DELETE FROM transactions WHERE id = $1", [id]);
        if (result.rowCount === 0) {
          return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json({ message: "Transaction deleted successfully" });
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
    }
module.exports = { registerUser, getTransactions, deleteTransaction };
