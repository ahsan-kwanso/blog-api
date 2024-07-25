import { signUpUser, signInUser } from "../services/auth.service.js";

const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const token = await signUpUser(name, email, password);
    return res.status(201).json({ token });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Internal server error",
    });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await signInUser(email, password);
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Internal server error",
    });
  }
};

export { signIn, signUp };
