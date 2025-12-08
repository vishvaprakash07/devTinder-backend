const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if(!allowedStatus.includes(status)) {
            return res.status(400).send("Invalid status value");
        }

        const toUser = await User.findById(toUserId);
        if(!toUser) {
            return res.status(400).send("To User not found");
        }
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if(existingConnectionRequest) {
            return res.status(400).send("Connection request already exists between these users");
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        const data = await connectionRequest.save();
        res.json({
            message: req.user.firstName + " is " + status + " to connect with " + toUser.firstName,
            data  
        });

    } catch (err) {
        res.status(400).send("Error sending connection request " + err.message);
    }
});

module.exports = requestRouter;