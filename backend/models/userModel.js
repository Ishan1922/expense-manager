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

const getTransactionsPaginationQuery = async (id, page, limit) => {
  try {
    const offset = (page - 1) * limit;
    const result = await pool.query(
      "SELECT * FROM transactions WHERE space_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
      [id, limit, offset]
    );

    return {
      transactions: result.rows,
      hasMore: result.rows.length === limit, 
    };
  } catch (err) {
    console.log("errr ",err);
    return null;
  }
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



module.exports = { getTransactionsPaginationQuery,createUser, getTransactionsQuery, deleteTransactionQuery, updateTransactionQuery, addTransactionQuery, getTransactionsOfLast30DaysQuery, getTransactionsOfLast7DaysQuery, userCheckQuery };
