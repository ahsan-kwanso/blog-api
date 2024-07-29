import { signUpUser, signInUser } from "../services/auth.service.js";

const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const result = await signUpUser(name, email, password);
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    return res.status(201).json({ token: result.token });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await signInUser(email, password);
    if (!result.success)
      return res.status(400).json({ message: result.message });
    return res.status(201).json({ token: result.token });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { signIn, signUp };
