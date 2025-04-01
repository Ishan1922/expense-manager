const pool = require("../config/db");

const createUser = async (username, password) => {
  const result = await pool.query(
    "INSERT INTO spaces (username, password, created_at) VALUES ($1, $2, now()) RETURNING *",
    [username, password]
  );
  return result.rows[0];
};
const userCheckQuery = async (username, password) => {
      const result = await pool.query(
        "select * from spaces where username = $1 and password = $2",
        [username, password]
      );
      return result.rows;
    };

const getTransactionsQuery = async (id) => {
  const result = await pool.query(
    "select * from transactions where space_id = $1",
    [id]
  );
  return result.rows;
};

const getCategoriesQuery = async (id) => {
  const result = await pool.query(
    "select * from categories where type_id = $1",
    [id]
  );
  return result.rows;
};

const getFilteredTransactionsQuery = async (id, selectedDate, isDateEnabled, transactionType) => {
  let tType = 0;
  if(transactionType == "1")tType = 1;
  else if (transactionType == "2")tType = 2;

  const result = await pool.query(
    "SELECT * FROM transactions WHERE ( $2 = false OR DATE(created_at) = $1) AND ($3 = 0 OR transaction_type = $3) order by id desc",
    [selectedDate, isDateEnabled, tType]
  );
  return result.rows;
};

const getTransactionsOfLast30DaysQuery = async (id) => {
      const result = await pool.query(
        "select * from transactions where space_id = $1 and created_at > now() + '-30 days'",
        [id]
      );
      return result.rows;
    };

    const getTransactionsOfLast7DaysQuery = async (id) => {
      const result = await pool.query(
        "select * from transactions where space_id = $1 and created_at > now() + '-7 days'",
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
  transaction_type, category_id
) => {
  const result = pool.query(
    "UPDATE transactions SET description = $1, amount = $2, transaction_type = $3, category_id = $5 WHERE id = $4 RETURNING *",
    [description, amount, transaction_type, id, category_id]
  );
  return result;
};
const addTransactionQuery = async (
      amount, description, transaction_type, space_id, category_id
) => {
  const result = pool.query(
      "INSERT INTO transactions (amount, description, transaction_type, space_id, created_at, category_id) VALUES ($1, $2, $3, $4, NOW(), $5) RETURNING *",
      [amount, description, transaction_type, space_id, category_id]
    );
  return result;
};



module.exports = { createUser, getTransactionsQuery, deleteTransactionQuery, updateTransactionQuery, addTransactionQuery, getTransactionsOfLast30DaysQuery, getTransactionsOfLast7DaysQuery, userCheckQuery, getFilteredTransactionsQuery, getCategoriesQuery };
