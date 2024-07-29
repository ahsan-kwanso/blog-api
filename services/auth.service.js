import bcrypt from "bcryptjs";
//import { User } from "../sequelize/models/index.js";
import User from "../sequelize/models/user.model.js";
import { generateToken } from "../utils/jwt.js";

const signUpUser = async (name, email, password) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return { success: false, message: "User already exists." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user);
  return { success: true, token: token };
};

const signInUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return { success: false, message: "Invalid email or password. " };
  }
  const isPasswordValid =
    user !== null ? await bcrypt.compare(password, user.password) : null;
  if (!isPasswordValid) {
    return { success: false, message: "Wrong password. " };
  }

  const token = generateToken(user);
  return { success: true, token: token };
};

export { signInUser, signUpUser };
