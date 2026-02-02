const express = require("express");
const { userAuth } = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const User = require('../models/user');
const { validateSignUpData } = require("../utils/validation");

const authRouter = express.Router();

//signup user API - POST /signup
authRouter.post('/signup', async (req, res) => {
    try {
        //Validate the signup data
        validateSignUpData(req);

        const { firstName, lastName, email, password, age, gender, about, skills } = req.body;

        //encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            age,
            gender,
            about,
            skills
        });

        // Save the user to the database
        const savedUser = await user.save();
        const token = await savedUser.getJWT();

        //Add the token to cookie
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
        });
        res.json({message: "User added successfully", data: savedUser});
    } catch(err) {
        res.status(400).send("Error adding user" + err.message);
    }
});

//login user API - POST /login
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordMatch = await user.passwordMatch(password);
    if (isPasswordMatch) {
      //Create a JWT token
      const token = await user.getJWT();
      //Add the token to cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
      });
      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error logging in " + err.message);
  }
});

//logout user API - POST /logout
authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout successful");
});

module.exports = authRouter;