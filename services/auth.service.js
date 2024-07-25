import bcrypt from "bcryptjs";
import { User } from "../models/index.js";
import { generateToken } from "../utils/jwt.js";

const signUpUser = async (name, email, password) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("User already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user);
  return token;
};

const signInUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  const isPasswordValid =
    user !== null ? await bcrypt.compare(password, user.password) : null;

  if (!user || !isPasswordValid) {
    throw new Error("Invalid email or password.");
  }

  const token = generateToken(user);
  return token;
};

export { signInUser, signUpUser };
