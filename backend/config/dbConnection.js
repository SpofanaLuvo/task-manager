const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: process.env.PG_USER || 'postgres_user',
    database: process.env.DB_NAME || 'task_manager',
    password: process.env.DB_PASSWORD,
    port: process.env.PG_PORT || "5432"
  });

module.exports = pool;