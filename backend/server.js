const express = require("express");
const pool = require("./config/dbConnection");
const port = 3001;
require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const cors = require('cors');



const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
    }
    next();
  });

app.use("/api/task", require("./routes/taskRoutes"));
// app.use("/api/customer", require("./routes/customerRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.use(errorHandler);
app.use(cors({
    origin: '*' // You can also use '*' to allow all origins
  }));

app.listen(port, () => console.log(`Server has started on port: ${port}`));