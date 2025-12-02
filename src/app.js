const express = require('express');

const app = express();



app.use("/test", (req, res) => {
    res.send("Test endpoint reached on the server!, Namaste");
});

app.get('/user', (req, res) => {
    res.send({ firstName: "Vishva", age: 28 });
});

app.post('/user', (req, res) => {
    res.send("Created user successfully");
});

app.put('/user', (req, res) => {
    res.send("Updated user successfully");
});

app.delete('/user', (req, res) => {
    res.send("Deleted user successfully");
});

app.use("/hello/123", (req, res) => {
    res.send("Hello, World! 123");
});

app.use("/hello", (req, res) => {
    res.send("Hello, World!");
});

app.use("/", (req, res) => {
    res.send("Welcome to DevTinder Backend!");
});

app.listen(7777, () => {
    console.log('Server is running on port 7777');
});

