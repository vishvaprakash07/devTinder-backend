const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");

//profie API - GET /profile/view - get the profile of the logged in user
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch(err) {
        res.status(400).send("Error fetching profile " + err.message);
    }
});

//Update API - PATCH /profile/edit - Update data of the logged in user
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try{
        if(!validateProfileEditData(req)) {
            throw new Error("Invalid Edit request!");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((field) => {
            loggedInUser[field] = req.body[field];
        });
        await loggedInUser.save();
        res.send("Profile updated successfully");
        
    } catch(err) {
        res.status(400).send("Error updating profile " + err.message);
    }
});

//Update password API - PATCH /profile/password - Update password of the logged in user
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const user  = req.user;
        const isPasswordMatch = await user.passwordMatch(req.body.currentPassword);
        if(!isPasswordMatch) {
            throw new Error("Current password is incorrect");
        }
        if(req.body.currentPassword === req.body.newPassword) {
            throw new Error("New password cannot be same as current password");
        }
        if(req.body.newPassword !== req.body.confirmPassword) {
            throw new Error("New password and confirm password do not match");
        }
        user.password = await user.hashPassword(req.body.newPassword);
        await user.save();
        res.send("Password updated successfully");
    } catch (err) {
        res.status(400).send("Error updating password " + err.message);
    }
});


//Update API - PATCH /user - Update data of the user
// profileRouter.patch('/user/:userId', async (req, res) => {
//     const userId = req.params?.userId;
//     const data = req.body;
//     try {
//             const ALLOWED_UPDATES = ["photoUrl", "about", "skills", "age", "password"];
//             const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
//             if(!isUpdateAllowed) {
//                 throw new Error("Invalid updates!");
//             }
//             const user = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: 'before',
//                 runValidators: true
//             });
//             console.log(user);
//             res.send("User updated successfully");
//     } catch(err) {
//         res.status(400).send("Error fetching user" + err.message);
//     }
// });

module.exports = profileRouter;