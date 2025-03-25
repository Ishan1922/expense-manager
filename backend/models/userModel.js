const pool = require("../config/db");

const createUser = async (username, password) => {
  const result = await pool.query(
    "INSERT INTO spaces (username, password, created_at) VALUES ($1, $2, now()) RETURNING *",
    [username, password]
  );
  return result.rows[0];
};

const getTransactionsQuery = async (id) => {
  const result = await pool.query(
    "select * from transactions where space_id = $1",
    [id]
  );
  return result.rows;
};

const deleteTransactionQuery = async (id) => {
  const result = await pool.query("DELETE FROM transactions WHERE id = $1", [
    id,
  ]);
  return result.rowCount;
};
const updateTransactionQuery = async (
  id,
  description,
  amount,
  transaction_type
) => {
  const result = pool.query(
    "UPDATE transactions SET description = $1, amount = $2, transaction_type = $3 WHERE id = $4 RETURNING *",
    [description, amount, transaction_type, id]
  );
  return result;
};
const addTransactionQuery = async (
      amount, description, transaction_type, space_id
) => {
  const result = pool.query(
      "INSERT INTO transactions (amount, description, transaction_type, space_id, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
      [amount, description, transaction_type, space_id]
    );
  return result;
};



module.exports = { createUser, getTransactionsQuery, deleteTransactionQuery, updateTransactionQuery, addTransactionQuery };
