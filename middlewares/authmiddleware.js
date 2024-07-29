import jwt from "jsonwebtoken";
import { statusCodes } from "../utils/statusCodes.js";
export const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(statusCodes.UNAUTHORIZED).json({
      message: "Access Denied! You are not authenticated",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    return res.status(statusCodes.FORBIDDEN).json({
      message: "Token is not valid",
    });
  }
};
