const jwt = require("jsonwebtoken");
const errorHandler = require("../utils/error.js");

const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return next(errorHandler(401, "Access Denied! You are not authenticated"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    return next(errorHandler(403, "Token is not valid"));
  }
};

module.exports = { authenticateJWT };
