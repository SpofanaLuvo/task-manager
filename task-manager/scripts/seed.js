const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

function getCurrentDateTimeFormatted() {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed, hence the +1.
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createUsersTable = await client.sql`
        CREATE TABLE IF NOT EXISTS kanban_users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    console.log(`Created "Kanban Users" table`);
// Create the "tasks" table if it doesn't exist
    const createTasksTable = await client.sql`
        CREATE TABLE IF NOT EXISTS kanban_tasks (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES kanban_users(id) ON DELETE CASCADE,
            title VARCHAR(100) NOT NULL,
            description TEXT,
            status VARCHAR(20) DEFAULT 'pending',
            due_date TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    console.log(`Created "Tasks" table`);

    const user = {
        username: "Admin",
        email: "admin@123",
        password: "admin123",
        created_at: getCurrentDateTimeFormatted()
    }

    const task = {
        user_id: user.id,
        title: "Initial Task",
        description: "This is the first task",
        status: 'pending',
        due_date: new Date('2024-09-30'),
        created_at: getCurrentDateTimeFormatted(),
        updated_at: getCurrentDateTimeFormatted()
    };

    // Insert data into the "users" and "tasks" table
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const insertedUser = await client.sql`
        INSERT INTO kanban_users (username, email, password, created_at)
        VALUES (${user.username}, ${user.email}, ${hashedPassword}, ${user.created_at})
        ON CONFLICT (id) DO NOTHING;
        `;

    const insertedTask = await client.sql`
        INSERT INTO kanban_tasks (user_id, title, description, status, created_at, updated_at)
        VALUES (${user.id}, ${task.title}, ${task.description}, ${task.status},${task.created_at}, ${task.updated_at})
        ON CONFLICT (id) DO NOTHING;
        `;

    console.log(`Created Amin User users`);

    return {
      createUsersTable,
      createTasksTable,
      insertedUser,
      insertedTask
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedUsers(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});