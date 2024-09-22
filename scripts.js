const createUsersTable = async () => {
    return `
        CREATE TABLE IF NOT EXISTS kanban_users (
            user_id SERIAL PRIMARY KEY,  -- Auto-incremented unique identifier for each user
            username VARCHAR(255) NOT NULL,  -- Username, required
            email VARCHAR(255) NOT NULL UNIQUE,  -- Email, required and unique
            password VARCHAR(255) NOT NULL,  -- Password, required (hashed)
            phone VARCHAR(20),  -- Phone number (optional)
            address TEXT,  -- Address (optional)
            membership_code VARCHAR(100),  -- Membership number (optional)
            membership_plan VARCHAR(100),  -- Membership plan (optional)
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Timestamp for user creation
            UNIQUE(email)  -- Ensure email uniqueness
        );
    `;
};

// Function to create the `tasks` table
const createTasksTable = async () => {
    return `
        CREATE TABLE IF NOT EXISTS tasks (
            task_id SERIAL PRIMARY KEY,  -- Auto-incremented unique identifier for each task
            user_id INT NOT NULL,  -- Foreign key reference to the user creating the task
            title VARCHAR(255) NOT NULL,  -- Task title
            description TEXT,  -- Task description
            task_status VARCHAR(50) NOT NULL,  -- Task status (e.g., pending, completed)
            due_date TIMESTAMP,  -- Deadline for the task
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Timestamp for task creation
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Timestamp for task update
            CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES kanban_users(user_id) ON DELETE CASCADE  -- Foreign key relationship with user table
        );
    `;
};









