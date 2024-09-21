const { Pool } = require("pg");
require("dotenv").config();


const pool = new Pool({
    port: process.env.DB_PORT || "5432",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD,
    connectionString: process.env.D
});

module.exports = pool;