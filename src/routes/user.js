const express = require("express");
const userRouter = express.Router();
const User = require('../models/user');

//Feed API - GET /feed - get all the users fromn the database
userRouter.get('/feed', async (req, res) => {
    const users = await User.find();
    try {
        if(users.length === 0) {
        return res.status(404).send("Users not found");
        }
        else {
            res.send(users);
        }
    } catch(err) {
        res.status(400).send("Error fetching user" + err.message);
    }
});

module.exports = userRouter;