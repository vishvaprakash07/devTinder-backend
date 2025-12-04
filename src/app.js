const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');

const app = express();

app.use(express.json());

app.post('/signup', async (req, res) => {

    // Create a new user instance
    const user = new User(req.body);

    // Save the user to the database
    try {
        await user.save();
        res.send("User added successfully");
    } catch(err) {
        res.status(400).send("Error adding user" + err.message);
    }
});


//Get a single user by email
app.get('/user', async (req, res) => {
    const userEmail = req.body.email;
    const user = await User.findOne({ email: userEmail });
    try {
        if(!user) {
        return res.status(404).send("User not found");
        }
        else {
            res.send(user);
        }
    } catch(err) {
        res.status(400).send("Error fetching user" + err.message);
    }
});

//Feed API - GET /feed - get all the users fromn the database
app.get('/feed', async (req, res) => {
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

//Delete API - DELETE /user - delete a user by id
app.delete('/user', async (req, res) => {
    const userId = req.body.userId;
    try {
        await User.findByIdAndDelete({ _id: userId });
        res.send("User deleted successfully");
    } catch(err) {
        res.status(400).send("Error fetching user" + err.message);
    }
});

//Update API - PATCH /user - Update data of the user
app.patch('/user/:userId', async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try {
            const ALLOWED_UPDATES = ["photoUrl", "about", "skills", "age", "password"];
            const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
            if(!isUpdateAllowed) {
                throw new Error("Invalid updates!");
            }
            const user = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: 'before',
                runValidators: true
            });
            console.log(user);
            res.send("User updated successfully");
    } catch(err) {
        res.status(400).send("Error fetching user" + err.message);
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




