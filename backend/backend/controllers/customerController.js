const asyncHandler = require("express-async-handler");
const { insertInto, selectFrom } = require("../helpers/helperData");
const pool = require("../config/dbConnection");

//@desc = Get Available cleaners
//@route = GET /api/cleaners
//@access = Public
const getAvailableCleaners = asyncHandler(async (req, res) => {
    try {
        cleaners = await pool.query(selectFrom.cleaners);
    } catch (error) {
        console.log(error);
    }

    res.status(200).json(cleaners.rows);
});

//@desc Make payment
//@route = POST /api/payment/:id
//@access = Public
const makePayment = asyncHandler(async (req, res) => {
    const { cleaner_id, task_id, amount } = req.body;
    const cleaner = await pool.query(selectFrom.cleanerWithId(cleaner_id));
    if (!cleaner) {
        throw new Error("User does not exist");
    }
    new Date().toDateString();
    console.log(new Date().toDateString());
    const payment_date = new Date().toDateString();
    try {
        await pool.query(
            insertInto.payments(cleaner_id, task_id, amount, payment_date)
        );
        res.json({ message: `Payment made to cleaner ${cleaner_id}` });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "An error occurred while making the payment.",
        });
    }
});

//@desc Rate a cleaner
//@route = POST /api/ratings/
//@access = Public
const rateCleaner = asyncHandler(async (req, res) => {
    const { cleaner_id, rating } = req.body;

    try {
        await pool.query(insertInto.ratings(cleaner_id, rating));
        res.json({ message: `Rating made to cleaner ${cleaner_id}` });
    } catch (error) {
        console.log(error);
        res.status(500).json(error.error);
    }
});

//@desc View Ratings
//@route = GET /api/ratings/
//@access = Public
const viewAllRatings = asyncHandler(async (req, res) => {
    try {
        ratings = await pool.query(selectFrom.ratings);
        res.status(200).json(ratings.rows);
    } catch (error) {
        console.log(error.error);
    }

    
});

const viewCleanerRatings = asyncHandler(async (req, res) => {
    try {
        ratings = await pool.query(selectFrom.ratingWithId(req.params.id));
    } catch (error) {
        console.log(error);
    }

    res.status(200).json(ratings.rows);
});

module.exports = {
    getAvailableCleaners,
    makePayment,
    rateCleaner,
    viewAllRatings,
    viewCleanerRatings,
};