const adminAuth = (req, res, next) => {
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized) {
        res.status(401).send("Unauthorized Admin Request");
    }
    else {
        next();
    }
};

const userAuth = (req, res, next) => {
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized) {
        res.status(401).send("Unauthorized Admin Request");
    }
    else {
        next();
    }
}

module.exports = { adminAuth, userAuth };