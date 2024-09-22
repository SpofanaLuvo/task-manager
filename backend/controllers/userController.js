const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { select, insert, generateMembershipCode } = require("../helpers/helperData");
const pool = require("../config/dbConnection");

//@desc = Register users
//@route = POST /api/users
//@access = Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, phone, address, membership_plan } =
        req.body;
    if (
        !username ||
        !email ||
        !password ||
        !phone ||
        !address ||
        !membership_plan
    ) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    const userExists = await pool.query(select.userWithEmail(email));
    if (userExists.rows.length > 0) {
        res.status(400);
        throw new Error("User already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    let user = await pool.query(
        insert.kanban_users({
            username: username,
            email: email,
            password: hashedPassword,
            phone: phone,
            address: address,
            membership_plan: membership_plan,
            created_at: new Date(),
        })
    );

    if (user) {
        user = await pool.query(select.userWithEmail(email));
        user = user.rows[0];
        const token = generateToken(res, user.user_id); // Capture the generated token
        res.status(201).json({
            id: user.user_id,
            username: user.username,
            email: user.email,
            token: token, // Include the token in the response
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
        throw new Error("Please add all fields");
    }

    // check for user email
    let user = await pool.query(select.userWithEmail(email));
    user = user.rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
        const token = generateToken(res, user.user_id);

        res.status(201).json({
            id: user.user_id,
            name: user.name,
            email: user.email,
            token: token,
        });
    } else {
        res.status(400);
        throw new Error("Invalid credentials");
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
};
