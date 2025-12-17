const express = require("express");
const userRouter = express.Router();
const User = require('../models/user');
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");

const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "age", "gender", "skills", "about"];

//Requests API - GET /requests - get all the connection requests for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);

        res.json({
            message: "Connection requests fetched successfully",
            data: connectionRequests
        });
    } catch (err) {
        res.status(400).send("Error fetching connection requests " + err.message);
    }
});

//Connections API - GET /connections - get all the connections for the logged in user
userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        const data = connections.map(connection => {
            if(connection.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return connection.toUserId;
            } else {
                return connection.fromUserId;
            }
        });

        res.json({
            message: "Connections fetched successfully",
            data: data
        });

    } catch (err) {
        res.status(400).send("Error fetching connections " + err.message);
    }
});

//Feed API - GET /feed - get all the users fromn the database
userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed  = new Set();
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ],
        })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);
        
        res.json({
            message: "Users fetched successfully",
            data: users
        });
    } catch(err) {
        res.status(400).send("Error fetching users" + err.message);
    }
});

module.exports = userRouter;