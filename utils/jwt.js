import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./settings.js";

export const generateToken = (user) => {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};
