const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');

const app = express();

app.post('/signup', async (req, res) => {
    const userObj = {
        firstName: "Sachin",
        lastName: "Tendulkar",
        email: "sachin.tendulkar@gmail.com",
        password: "abcd1234",
    }

    // Create a new user instance
    const user = new User(userObj);

    // Save the user to the database
    try {
        await user.save();
        res.send("User added successfully");
    } catch(err) {
        res.status(400).send("Error adding user" + err.message);
    }
});

connectDB()
.then(() => {
    console.log("Connected to MongoDB successfully");
    app.listen(7777, () => {
        console.log('Server is running on port 7777');
    });
})
.catch((err) => {
    console.error("Error connecting to MongoDB");
});




