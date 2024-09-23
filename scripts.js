// Importing database connection pool module
const pool = require("./backend/config/dbConnection");

// Create tables in the database
async function createTables() {
    try {
        for (const table of Object.values(createTableScripts)) {
            await pool.query(table);
        }
        console.log("Tables created!");
    } catch (error) {
        console.log(error);
    }
}

async function dropTables() {
    try {
        for (const table of Object.values(dropTableScripts)) {
            await pool.query(table);
        }
        console.log(`Tables dropped, database is clean!`);
    } catch (error) {
        console.log(error);
    }
}

const dropTableScripts = {
    users: "DROP TABLE IF EXISTS users;",
    tasks: "DROP TABLE IF EXISTS tasks;",
};

const createTableScripts = {
    users:  `CREATE TABLE IF NOT EXISTS kanban_users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        membership_code VARCHAR(100),
        membership_plan VARCHAR(100),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
        UNIQUE(email)
    );`,
    tasks: `CREATE TABLE IF NOT EXISTS tasks (
        task_id SERIAL PRIMARY KEY,
        created_by VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        task_status VARCHAR(50) NOT NULL,  -- Task status (e.g., pending, completed)
        due_date TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_user FOREIGN KEY (created_by) REFERENCES kanban_users(email) ON DELETE CASCADE
    );`,
};

module.exports = { createTables, dropTables };