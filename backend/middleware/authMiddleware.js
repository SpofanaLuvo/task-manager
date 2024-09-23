const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const pool = require('../config/dbConnection');
const { select } = require('../helpers/helperData');
const cookieParser = require('cookie-parser'); // Ensure cookie-parser is used in your main app file

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
   
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token && req.cookies) {
    token = req.cookies['access-token'];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userResult = await pool.query(select.userWithEmail(decoded.user_email));
    const user = userResult.rows[0];
    if (!user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }

    delete user.password;
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

module.exports = { protect };
