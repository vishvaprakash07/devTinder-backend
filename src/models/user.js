const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email format");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong password");
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if(!["male", "female", "others"].includes(value.toLowerCase())) {
                throw new Error("Invalid gender value");
            }
        }
    },
    photoUrl: {
        type: String,
        validate(value) {
            if(!validator.isURL(value)){
                throw new Error("Invalid URL format");
            }
        }
    },
    about: {
        type: String,
        default: "This is the default description about the user."
    },
    skills: {
        type: [String],
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;