const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const pool = require("../config/dbConnection");
const { insertInto, selectFrom } = require("../helpers/helperData");

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        try {
            // get token from header
            token = req.headers.authorization.split(" ")[1];
            //verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //get users from the token

            const user = await pool.query(
                selectFrom.userWithId(decoded.userId)
            );

            

            delete user.rows[0].password;
            req.user = user.rows[0];

            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error("Not authorized");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

module.exports = { protect };