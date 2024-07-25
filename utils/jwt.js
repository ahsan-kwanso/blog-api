import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  console.log(user);
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};
