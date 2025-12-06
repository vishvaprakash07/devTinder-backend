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

module.exports = { validateSignUpData };