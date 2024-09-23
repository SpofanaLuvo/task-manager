const express = require('express');
const pool = require('./config/dbConnection');
const dotenv = require('dotenv');
const { errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

const port = process.env.PORT || 3001;
const app = express();

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3000', 
  credentials: true, // Allow credentials (cookies, authorization headers)
};

app.use(cors(corsOptions));

// Routes
app.use('/api/task', require('./routes/taskRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.use(errorHandler);

app.listen(port, () => console.log(`Server has started on port: ${port}`));
