import express from "express";
import { signUp, signIn } from "../controllers/auth.controller.js";
import {
  signInValidationRules,
  signUpValidationRules,
  validate,
} from "../validators/user.validator.js";

const router = express.Router();

router.post("/signup", signUpValidationRules, validate, signUp);
router.post("/signin", signInValidationRules, validate, signIn);

export default router;
