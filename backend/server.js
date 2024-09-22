const express = require("express");
const pool = require("./config/dbConnection");
const port = 3001;
require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/task", require("./routes/taskRoutes"));
// app.use("/api/customer", require("./routes/customerRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.use(errorHandler);

app.listen(port, () => console.log(`Server has started on port: ${port}`));