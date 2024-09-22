const pool = require("../config/dbConnection");

const insert = {
    kanban_users: async (user) => {
        const { username, email, password, phone, address, membershipPlan } =
            user;

        let membershipCode = generateMembershipCode(username);

        const now = new Date();
        const currentDateTime = now
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

        return `INSERT INTO kanban_users (username, email, password, phone, address, membership_number, membership_plan, created_at)
           VALUES (${username}, ${email}, ${password}, ${phone}, ${address} ${membershipCode}, ${membershipPlan} ${currentDateTime})
           ON CONFLICT (id) DO NOTHING;
           `;
    },
    task: (task) => {
        const { user_id, title, description, taskStatus, due_date } = task;

        return `
      INSERT INTO tasks (user_id, title, description, task_status, due_date, created_at, updated_at)
      VALUES (${user_id}, ${title}, ${description}, ${taskStatus},${due_date},${created_at}, ${updated_at})
      ON CONFLICT (id) DO NOTHING;
      `;
    },
};

const select = {
    userWithEmail: (email) => {
        return `SELECT * FROM kanban_users WHERE email ='${email}';`;
    },
    userWithId: (user_id) => {
        return `SELECT * FROM kanban_users WHERE user_id ='${user_id}';`;
    },
    users: "SELECT * FROM kanban_users;",
    tasksByUserId: (user_id) => {
        return `SELECT * FROM tasks WHERE user_id = '${user_id}';`;
    },
};

const queryUpdateTask = (updatedTaskData) => {
    const { task_id, title, description, status, due_date } = updatedTaskData;
    const now = new Date();
    const currentDateTime = now.toISOString().slice(0, 19).replace("T", " ");

    return `UPDATE kanban_tasks
              SET title = ${title}, description = ${description}, status = ${status}, due_date = ${due_date}, updated_at = ${currentDateTime}
              WHERE id = ${task_id}
              RETURNING *
          `;
};

const queryDeleteTask = (task_id) => {
    return `DELETE FROM kanban_tasks WHERE id = ${task_id};`;
};

function generateMembershipCode(username) {
    // Ensure username is at least 6 characters long
    const namePart = username
        .slice(0, 6)
        .padEnd(6, Math.floor(Math.random() * 10).toString());

    // Generate a random numeric part to make the code 13 characters long
    const randomPartLength = 13 - namePart.length;
    const randomPart = Math.random()
        .toString()
        .slice(2, 2 + randomPartLength);

    return namePart + randomPart;
}
module.exports = {
    insert,
    select,
    queryDeleteTask,
    queryUpdateTask,
    generateMembershipCode,
};
