const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
        },
        default: "https://img.freepik.com/premium-vector/stylish-default-user-profile-photo-avatar-vector-illustration_664995-353.jpg"
    },
    about: {
        type: String,
        default: "This is the default description about the user."
    },
    skills: {
        type: [String],
    }
}, { timestamps: true });

userSchema.methods.passwordMatch = async function(inputPassword) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(inputPassword, user.password);
    return isPasswordValid;
}

userSchema.methods.hashPassword = async function(inputPassword) {
    const hashedPassword = await bcrypt.hash(inputPassword, 10);
    return hashedPassword;
}

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", { expiresIn: "7d" });
    return token;
}

const User = mongoose.model("User", userSchema);

module.exports = User;