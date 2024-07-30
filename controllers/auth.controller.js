import { signUpUser, signInUser } from "../services/auth.service.js";
import { statusCodes } from "../utils/statusCodes.js";

const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const result = await signUpUser(name, email, password);
    if (!result.success) {
      return res.status(statusCodes.BAD_REQUEST).json({ message: result.message });
    }
    return res.status(statusCodes.CREATED).json({ token: result.token });
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await signInUser(email, password);
    if (!result.success)
      return res.status(statusCodes.UNAUTHORIZED).json({ message: result.message });
    return res.status(statusCodes.OK).json({ token: result.token });
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export { signIn, signUp };
