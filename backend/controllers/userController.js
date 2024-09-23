const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { select, insert, generateMembershipCode } = require("../helpers/helperData");
const pool = require("../config/dbConnection");

//@desc = Register users
//@route = POST /api/users
//@access = Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, membership_plan } =
        req.body;
    if (
        !username ||
        !email ||
        !password ||
        !membership_plan
    ) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    console.log("Into the create user function")

    const userExists = await pool.query(select.userWithEmail(email));
    if (userExists.rows.length > 0) {
        res.status(400);
        throw new Error("User already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("Attempt to create the user")
    console.log("This is the query")
    console.log(insert.kanban_users({
        username: username,
        email: email,
        password: hashedPassword,
        membership_plan: membership_plan,
    }))
    console.log("This is the query")

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

        console.log("User recently registered")
        console.log(registeredUser)
        console.log("User recently registered")
    } catch(error) {
        console.log(error)
    }
    // Create user
    
    if (registeredUser) {
        user = await pool.query(select.userWithEmail(email));
        user = user.rows[0];
        console.log("THIS IS THE USER WE ARE TALKING ABOUT ")
        console.log()
        console.log("THIS IS THE USER WE ARE TALKING ABOUT ")
        const token = generateToken(res, user.email); // Capture the generated token
        res.status(201).json({
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            token: token, // Include the token in the response
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
  
    // Check for user email
    let userResult = await pool.query(select.userWithEmail(email));
    let user = userResult.rows[0];
  
    if (user && await bcrypt.compare(password, user.password)) {
      // Generate tokens
      const accessToken = generateToken({ email: user.email }, '15m'); // Assuming generateToken function accepts payload and expiry
      const refreshToken = generateToken({ email: user.email }, '30d'); // Adjust the payload and expiry as needed
  
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
  
      // Respond with user details and access token
      res.status(200).json({
        id: user.user_id,
        username: user.username,
        email: user.email,
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
    const result = await pool.query(selectFrom.usersIfExists(email));

    console.log(result);

    const { _id, name, email } = result.rows[0];
    res.status(200).json({
        id: _id,
        name,
        email,
    });
});

//@desc = Refresh access token
//@route = POST /refresh-token
//@access = Private
const refreshAccessToken = asyncHandler (async (req, res)=> {
    const cookies = req.cookies;
    const refreshToken = cookies['refresh-token'];
  
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not provided' });
    }
  
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET);
      const accessToken = generateAccessToken(decoded.email);
  
      res.setHeader('Set-Cookie', serialize('access-token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 15 * 60, // 15 minutes
        path: '/',
      }));
  
      return res.status(200).json({ accessToken });
    } catch (error) {
      console.log('Invalid refresh token');
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
}) 


//generate JWT

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        samSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return token; // Return the generated token
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    refreshAccessToken
};
