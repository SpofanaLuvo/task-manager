const pool = require("../config/dbConnection");


const insert = {
  kanban_users: (user) => {
    const { username, email, password, membership_plan } = user;

    const currentDateTime = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    let membership_code = generateMembershipCode(username);

    return `INSERT INTO kanban_users (username, email, password, membership_code, membership_plan, created_at)
           VALUES ('${username}', '${email}', '${password}', '${membership_code}', '${membership_plan}', '${currentDateTime}')
           ON CONFLICT (user_id) DO NOTHING;
           `;
  },
  task: (task) => {
    const { user_email, title, description, status, due_date } = task;
    const currentDateTime = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    return `
      INSERT INTO tasks (created_by, title, description, task_status, due_date, created_at, updated_at)
      VALUES ('${user_email}', '${title}', '${description}', '${status}', '${due_date}', '${currentDateTime}', '${currentDateTime}')
      ON CONFLICT (task_id) DO NOTHING;
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
  tasksByUserEmail: (user_email) => {
    return `SELECT * FROM tasks WHERE created_by = '${user_email}';`;
  },
};

const queryUpdateTask = (updatedTaskData) => {
  const { task_id, title, description, status, due_date } = updatedTaskData;
  const now = new Date();
  const currentDateTime = now.toISOString().slice(0, 19).replace("T", " ");

  return `UPDATE tasks
              SET title = '${title}', description = '${description}', task_status = '${status}', due_date = '${due_date}', updated_at = '${currentDateTime}'
              WHERE task_id = ${task_id}
              RETURNING *
          `;
};

const queryDeleteTask = (task_id) => {
  return `DELETE FROM tasks WHERE task_id = ${task_id};`;
};

function generateMembershipCode(username) {
  const namePart = username
    .slice(0, 6)
    .padEnd(6, Math.floor(Math.random() * 10).toString());

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
