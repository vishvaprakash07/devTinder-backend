const express = require('express');

const app = express();

app.use("/test", (req, res) => {
    res.send("Test endpoint reached on the server!, Namaste");
});

app.use("/hello", (req, res) => {
    res.send("Hello, World!");
});

app.listen(7777, () => {
    console.log('Server is running on port 7777');
});

