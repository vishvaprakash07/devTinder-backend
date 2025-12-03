const mongoose = require("mongoose");

const connectDB = async () => {
    await  mongoose.connect(
        "mongodb+srv://vishvaprakash07_db_user:ACUDl4Q6YPDoqsNj@namaste-node.icjnafe.mongodb.net/devTinder"
    );
};

module.exports = connectDB;
