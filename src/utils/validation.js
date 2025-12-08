const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, email, password } = req.body;
    if(!firstName || !lastName) {
        throw new Error("Name fields cannot be empty");
    } else if (!validator.isEmail(email)) {
        throw new Error("Invalid email format");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Enter a strong password");
    }
};

const validateProfileEditData = (req) => {
    const ALLOWED_UPDATES = ["photoUrl", "about", "skills", "age"];
    const isProfileEditAllowed = Object.keys(req.body).every((field) => ALLOWED_UPDATES.includes(field));
    return isProfileEditAllowed;
}

module.exports = { validateSignUpData, validateProfileEditData };