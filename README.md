# Setup Instructions.

## 1 - First things first, run "git pull" to ensure that you have the latest version of the code base.

## 2 - Add your environmental variables to the .env file.

## 3 - Ensure your docker-daemon is running, then on the root of the project, run the following command: "docker-compose up" to start up your docker container and create a potgress database image.

## 4 - In the Root directroty of th eproject, run "npm install";

## 5 - cd into the "frontend" directory, and run npm install;

## 5 - seed the database with the relevant tables by running "npm run seed";

## 6 - finally, run "npm run dev" to start up your development server.

# Project Overview

# API Documentation

## Configuration and Database Connection

### `dbConnection.js`
**Explanation:**
- The `Pool` class from the `pg` module is used to create a pool of PostgreSQL connections.
- Environment variables (.env file) are loaded using `dotenv`.
- The `Pool` configuration includes parameters for user, database name, password, and port.
- The `pool` instance is exported for use in querying the database.

## Common Middleware and Utilities

### `errorMiddleware.js`
**Explanation:**
- This middleware handles errors globally.
- It sets the HTTP status code (defaulting to 500 if not set) and returns a JSON response with the error message.
- Stack traces are included in the response unless the environment is production.

### `authMiddleware.js`
**Explanation:**
- Auth middleware to protect routes by verifying JWT tokens in the request headers or cookies.
- If no token is provided, returns a 401 error.
- If a valid token is found, it decodes the token to retrieve the user information and attaches it to the `req` object.

## API Endpoints

### Task Endpoints (`tasksController.js`)

#### Get Tasks By User
**Explanation:**
- **Route**: GET `/api/tasks/:user_email`
- **Access**: Private
- Fetches all tasks for a given user email.
- Returns the tasks if found; otherwise, informs that no tasks are available.

#### Create Task
**Explanation:**
- **Route**: POST `/api/tasks/`
- **Access**: Private
- Creates a new task with details from the request body.
- Returns the created task if successful; otherwise, indicates failure to create the task.

#### Update Task
**Explanation:**
- **Route**: PUT `/api/tasks/:task_id`
- **Access**: Private
- Updates an existing task with the provided task ID using data from the request body.
- Returns the updated task if successful; otherwise, indicates failure to update the task.

#### Delete Task
**Explanation:**
- **Route**: DELETE `/api/tasks/:task_id`
- **Access**: Private
- Deletes a task with the provided task ID.
- Returns a success message if the task is deleted; otherwise, indicates failure to delete the task.

### User Endpoints (`userController.js`)

#### Register User
**Explanation:**
- **Route**: POST `/api/users/register`
- **Access**: Public
- Registers a new user with the given data (username, email, password, and membership plan).
- Hashes the password before storing it in the database.
- Generates a JWT token upon successful registration and sets it in a cookie.
- Returns the registered user data along with the token.

#### Login User
**Explanation:**
- **Route**: POST `/api/users/login`
- **Access**: Public
- Authenticates a user by comparing the provided password with the stored hashed password.
- If authentication is successful, generates access and refresh tokens and sets them as cookies.
- Returns the authenticated user data along with the token.

#### Get User Data
**Explanation:**
- **Route**: GET `/api/users/me`
- **Access**: Private
- Retrieves the authenticated user's data (id, username, and email) based on the JWT token.

#### Refresh Access Token
**Explanation:**
- **Route**: POST `/refresh-token`
- **Access**: Private
- Refreshes the access token using a valid refresh token present in cookies.
- Sets a new access token in the cookies upon successful verification of the refresh token.
- Returns the new access token.

### Helper Functions (`helperData.js`)
**Insert Object**: Functions returning SQL queries for inserting users and tasks.  
**Select Object**: Functions returning SQL queries to fetch user and task data.  
**Query Update Task**: Function returning SQL query to update a task.  
**Query Delete Task**: Function returning SQL query to delete a task.  
**Generate Membership Code**: Function to generate a unique membership code.

## Server Setup (`server.js`)
**Explanation:**
- **Express App Setup**: Initializes an Express app with necessary middleware (cookie parser, JSON body parser, URL encoder).
- **CORS Configuration**: Allows requests from specified origins, enabling credentials (cookies, headers).
- **Routes**: Registers route handlers for tasks and users.
- **Error Handling**: Adds global error handling middleware.
- **Server Start**: Begins listening on the specified port.

### Task Routes (`taskRoutes.js`)
**Explanation:**
- Defines routes for task-related operations, protected by the authentication middleware `protect`.
- **GET `/api/tasks/:user_email`**: Fetches tasks for a specific user.
- **POST `/api/tasks/`**: Creates a new task.
- **PUT `/api/tasks/:task_id`**: Updates an existing task.
- **DELETE `/api/tasks/:task_id`**: Deletes a task.

### User Routes (`userRoutes.js`)
**Explanation:**
- Defines routes for user-related operations.
- **POST `/api/users/register`**: Registers a new user.
- **POST `/api/users/login`**: Authenticates a user.
- **GET `/api/users/me`**: Retrieves the authenticated user's data.
- **POST `/refresh-token`**: Refreshes the access token.


# Design Decisions and Thoughts

# Why This Approach is Effective

## Configuration and Database Connection

### Environment Variable Configuration (dotenv):
**Reason:** Using environment variables ensures that sensitive information such as database credentials and configuration parameters are not hard-coded into the application but are instead kept secure and configurable across different environments (development, staging, production).  
**Benefit:** Enhances security and makes it easier to manage different configurations for various deployment environments.

### Database Connection Pooling (pg Pool):
**Reason:** Using a connection pool allows for efficient resource management by reusing database connections instead of creating and destroying them on each request.  
**Benefit:** Improves performance and scalability by reducing the overhead of frequent database connections.

## Common Middleware and Utilities

### Global Error Handler (errorMiddleware.js):
**Reason:** Having a centralized error handling middleware ensures consistent error responses and reduces repetitive error handling code within each endpoint.  
**Benefit:** Simplifies debugging and improves the user experience by providing consistent and meaningful error messages.

### Authentication Middleware (authMiddleware.js):
**Reason:** Protecting routes with authentication middleware ensures that only authorized users can access certain endpoints by verifying JWT tokens.  
**Benefit:** Enhances security by enforcing authentication checks, protecting sensitive endpoints from unauthorized access.

## API Endpoints

### Consistent Endpoint Design:
**Reason:** Structuring endpoints in a RESTful manner, using clear and descriptive routes, makes the API intuitive and easy to use.  
**Benefit:** Facilitates integration with other services and provides a standardized way for clients to interact with the API.

### Endpoint-Specific Error Handling:
**Reason:** Including try-catch blocks within endpoints to handle specific errors ensures that detailed and relevant error messages are provided.  
**Benefit:** Improves the robustness of the API by gracefully handling exceptions and providing informative responses to the client.

## User Endpoints

### JWT Token-Based Authentication:
**Reason:** Using JWT tokens for authentication provides a stateless and secure method of verifying users, which is appropriate for modern web applications.  
**Benefit:** Enhances scalability and security by allowing token verification without maintaining session state on the server side.

### Password Hashing (bcrypt):
**Reason:** Hashing passwords before storing them in the database is a crucial security measure to protect user credentials.  
**Benefit:** Protects user data in the event of a database breach by ensuring that plaintext passwords are not exposed.

## Helper Functions and Data Access

### Helper Functions for SQL Queries (helperData.js):
**Reason:** Centralizing SQL query generation functions promotes reusability and maintainability by avoiding query duplication across different parts of the codebase.  
**Benefit:** Simplifies future modifications and reduces the likelihood of errors by having a single source of truth for SQL queries.

## Server Setup

### Middleware Setup (Express):
**Reason:** Setting up middleware like cookie-parser, CORS, and body parsers at the start ensures that all incoming requests are appropriately processed before reaching route handlers.  
**Benefit:** Provides a consistent request processing pipeline and supports various client requests, including those with credentials and cross-origin requests.

### Route Handlers:
**Reason:** Organizing routes into separate modules for tasks and users promotes modularity and separation of concerns.  
**Benefit:** Enhances code readability and maintainability by logically grouping related endpoints.

## Why This Approach was Chosen

### Security:
- Ensuring all sensitive data is managed securely through environment variables and hashing techniques.

### Scalability:
- Using a connection pool and JWT tokens to support a growing number of requests and users without overburdening the server.

### Maintainability:
- Structuring the code with clear separation of concerns, making it easier to manage, extend, and modify.
- Using helper functions to centralize SQL queries and reduce redundancy.

### Performance:
- Efficient resource management through connection pooling.
- Stateless authentication allows for less server-side processing.

### Developer Experience:
- Making use of middleware and structured error handling to create a clean and consistent developer experience.
- Providing clear and descriptive route documentation to make integration easier for clients.

By following these principles and structures, this approach ensures that the API is robust, secure, and maintainable, thereby providing a solid foundation for current and future development needs.
