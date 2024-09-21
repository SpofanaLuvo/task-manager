const pool = require("../config/dbConnection");

const insertInto = {
    users: (name, email, password, role) => {
        return `INSERT INTO users (name, email, password, role) VALUES ('${name}','${email}', '${password}', '${role}')`;
    },
    cleaners: (name, email) => {
        return `INSERT INTO cleaners (name, email) VALUES ('${name}','${email}') `;
    },
    tasks: (description, status) => {
        return `INSERT INTO tasks (description, status) VALUES ('${description}', '${status}');`;
    },
    ratings: (cleaner_id, rating) => {
        return `INSERT INTO ratings (cleaner_id, rating) VALUES ('${cleaner_id}', '${rating}');`;
    },
    payments: (cleaner_id, task_id, amount, payment_date) => {
        return `INSERT INTO payments (cleaner_id,task_id, amount, payment_date) VALUES ('${cleaner_id}','${task_id}','${amount}','${payment_date}');`;
    },
};

const selectFrom = {
    userWithEmail: (email) => {
        return `SELECT * FROM users WHERE email ='${email}';`;
    },
    userWithId: (user_id) => {
        return `SELECT * FROM users WHERE user_id ='${user_id}';`;
    },
    users: "SELECT * FROM users;",
    cleaners: "SELECT * FROM cleaners;",
    cleanerWithId: (cleaner_id) => {
        return `SELECT * FROM users WHERE user_id ='${cleaner_id}';`;
    },
    tasks: "SELECT * FROM tasks;",
    ratingWithId: (cleaner_id) => {
        return `SELECT * FROM ratings WHERE cleaner_id='${cleaner_id}';`;
    },
    ratings: "SELECT * FROM ratings;",
    paymentsForDay: (cleaner_id, day) => {
        return `SELECT SUM(amount) AS total_amount
                FROM Payments
                WHERE cleaner_id = ${cleaner_id} AND payment_date = '${day}';`;
    },
    paymentsForMonth: (cleaner_id, month) => {
        return `SELECT SUM(amount) AS total_amount
            FROM payments
            WHERE cleaner_id = ${cleaner_id} 
            AND EXTRACT(MONTH FROM payment_date) = EXTRACT(MONTH FROM '${month}'::DATE);`;
    },
    payments: "SELECT * FROM payments;",
};

module.exports = { insertInto, selectFrom };