const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { select, insert, generateMembershipCode } = require("../helpers/helperData");
const pool = require("../config/dbConnection");
const { serialize } = require('cookie'); // Import the serialize function

//@desc = Register users
//@route = POST /api/users
//@access = Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, membership_plan } = req.body;
    if (!username || !email || !password || !membership_plan) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    const userExists = await pool.query(select.userWithEmail(email));
    if (userExists.rows.length > 0) {
        res.status(400);
        throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let registeredUser = false;

    try {
        registeredUser = await pool.query(
            insert.kanban_users({
                username: username,
                email: email,
                password: hashedPassword,
                membership_plan: membership_plan,
            })
        );
    } catch (error) {
        console.log(error);
    }
    
    if (registeredUser) {
        let user = await pool.query(select.userWithEmail(email));
        user = user.rows[0];
        const token = generateToken(user.email);
        res.setHeader('Set-Cookie', serialize('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            path: '/',
        }));
        res.status(201).json({
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            token: token,
            membership_code: user.membership_code,
            membership_plan: user.membership_plan
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

//@desc = Authenticate a user
//@route = POST /api/users/login
//@access = Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      res.status(400);
      throw new Error('Please add all fields');
    }
  
    let userResult = await pool.query(select.userWithEmail(email));
    let user = userResult.rows[0];
  
    if (user && await bcrypt.compare(password, user.password)) {
      const accessToken = generateToken(user.email);
      const refreshToken = generateToken(user.email);
  
      // Set cookies
      res.setHeader('Set-Cookie', [
        serialize('access-token', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: 'strict',
          maxAge: 15 * 60, // 15 minutes
          path: '/',
        }),
        serialize('refresh-token', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: 'strict',
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
        }),
      ]);
  
      res.status(200).json({
        user_id: user.user_id,
        username: user.username,
        user_email: user.email,
        token: accessToken,
        membership_code: user.membership_code,
        membership_plan: user.membership_plan
      });
    } else {
      res.status(401);
      throw new Error('Invalid credentials');
    }
});

//@desc = Get user data
//@route = POST /api/users/me
//@access = Private
const getMe = asyncHandler(async (req, res) => {
    const result = await pool.query(select.userWithEmail(req.user.email));

    if (result.rows.length === 0) {
        res.status(404);
        throw new Error("User not found");
    }

    const { user_id, username, email } = result.rows[0];
    res.status(200).json({
        id: user_id,
        username,
        email,
    });
});

//@desc = Refresh access token
//@route = POST /refresh-token
//@access = Private
// Refresh Access Token Endpoint
const refreshAccessToken = asyncHandler(async (req, res) => {
  const { cookies } = req;
  const refreshToken = cookies['refresh-token'];

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not provided' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const accessToken = generateToken(decoded.user_email, '15m'); // 15 minutes

    res.setHeader('Set-Cookie', serialize('access-token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    }));

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Invalid refresh token', error);
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// Generate JWT
const generateToken = (user_email) => {
    const token = jwt.sign({ user_email }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });

    return token; // Return the generated token
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    refreshAccessToken
};
