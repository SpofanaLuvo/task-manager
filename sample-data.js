// Importing database connection pool module
const pool = require("./backend/config/dbConnection");

// Create tables in the database
async function createTables() {
    try {
        // Loop through each table creation script and execute it
        for (const table of Object.values(createTableScripts)) {
            await pool.query(table);
        }
        console.log("Tables created!");
    } catch (error) {
        // Log any errors that occur during table creation
        console.log(error);
    }
}

// Populate tables with initial data
async function populateTables() {
    try {
        // Loop through each data insertion script and execute it
        for (const table of Object.values(insertInto)) {
            await pool.query(table);
        }
        console.log(`Tables populated`);
    } catch (error) {
        console.log(error);
    }
}

async function dropTables() {
    try {
        // Loop through each data insertion script and execute it
        for (const table of Object.values(dropTableScripts)) {
            await pool.query(table);
        }
        console.log(`Tables dropped!`);
    } catch (error) {
        console.log(error);
    }
}

const dropTableScripts = {
    payments: "DROP TABLE IF EXISTS payments;",
    ratings: "DROP TABLE IF EXISTS ratings;",
    tasks: "DROP TABLE IF EXISTS tasks;",
    cleaners: "DROP TABLE IF EXISTS cleaners;",
    users: "DROP TABLE IF EXISTS users;",
};

// Object containing SQL scripts for creating tables
const createTableScripts = {
    users: "CREATE TABLE IF NOT EXISTS users (user_id SERIAL PRIMARY KEY,name VARCHAR(255) NOT NULL,email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, role VARCHAR(20) DEFAULT 'customer' NOT NULL)",
    cleaners:
        "CREATE TABLE IF NOT EXISTS cleaners (cleaner_id SERIAL PRIMARY KEY,name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL)",
    tasks: "CREATE TABLE IF NOT EXISTS tasks (task_id SERIAL PRIMARY KEY,description TEXT NOT NULL, status VARCHAR(20) DEFAULT 'pending' NOT NULL)",
    ratings:
        "CREATE TABLE IF NOT EXISTS ratings (rating_id SERIAL PRIMARY KEY ,cleaner_id INT  REFERENCES cleaners(cleaner_id), rating INT NOT NULL);",
    payments:
        "CREATE TABLE IF NOT EXISTS payments (payment_id SERIAL PRIMARY KEY ,cleaner_id INT,task_id INT REFERENCES tasks(task_id), amount DECIMAL(10, 2) NOT NULL, payment_date DATE NOT NULL);",
};

// Object containing SQL scripts for inserting data into tables
const insertInto = {
    users: "INSERT INTO users (name, email, password, role) VALUES ('user1', 'user1@example.com', 'password1', 'customer'), ('user2', 'user2@example.com', 'password2', 'customer'), ('user3', 'user3@example.com', 'password3', 'customer'), ('user4', 'user4@example.com', 'password4', 'customer'), ('cleaner1', 'cleaner1@example.com', 'password1', 'cleaner'), ('cleaner2', 'cleaner2@example.com', 'password2', 'cleaner'), ('cleaner3', 'cleaner3@example.com', 'password3', 'cleaner'), ('cleaner4', 'cleaner4@example.com', 'password4', 'cleaner'), ('cleaner5', 'cleaner5@example.com', 'password5', 'cleaner'), ('cleaner6', 'cleaner6@example.com', 'password6', 'cleaner');",
    cleaners:
        "INSERT INTO cleaners (name, email) SELECT name, email FROM users WHERE role = 'cleaner';",

    tasks: "INSERT INTO tasks (description) VALUES ('Clean kitchen'), ('Mop floors'), ('Dust furniture'), ('Vacuum carpets'), ('Clean bathrooms'),   ('Wash windows');",

    ratings:
        "INSERT INTO ratings (cleaner_id, rating) VALUES (1, 4), (2, 5), (3, 3), (4, 4), (5, 4), (6, 5);",
    payments:
        "INSERT INTO payments (cleaner_id, task_id, amount, payment_date) VALUES (1, 1, 50.00, '2024-03-18'), (2, 2, 60.00, '2024-03-18'), (3, 3, 70.00, '2024-03-18'), (4, 4, 80.00, '2024-03-18'), (5, 5, 90.00, '2024-03-18'), (6, 6, 100.00, '2024-03-18');",
};

// Calling functions to create tables and populate data into them
module.exports = { createTables, populateTables, dropTables };