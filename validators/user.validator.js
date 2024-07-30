import { body, validationResult } from "express-validator";
import { statusCodes } from "../utils/statusCodes.js";

const signUpValidationRules = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

// Sign-in validation rules
const signInValidationRules = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const validate = (validationRules) => {
  return async (req, res, next) => {
    await Promise.all(validationRules.map((rule) => rule.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(statusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    next();
  };
};

export { signInValidationRules, signUpValidationRules, validate };
