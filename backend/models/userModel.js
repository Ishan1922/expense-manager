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

module.exports = { createUser, getTransactionsQuery };
