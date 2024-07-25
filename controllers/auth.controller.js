import bcrypt from "bcryptjs";
import db from "../models/index.js";

import { generateToken } from "../utils/jwt.js";

const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required (name, email, password).",
      });
    }
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.User.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = generateToken(user);
    return res.status(201).json({ token });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required (email, password).",
      });
    }
    const user = await db.User.findOne({ where: { email } });
    const isPasswordValid =
      user !== null ? await bcrypt.compare(password, user.password) : null;
    if (!user || !isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password.",
      });
    }
    const token = generateToken(user);
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { signUp, signIn };
