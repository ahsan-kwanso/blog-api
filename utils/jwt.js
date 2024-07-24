const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const payload = {
    user_id: user.user_id,
    user_name: user.user_name,
    email: user.email,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = { generateToken };
