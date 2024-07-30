import express from "express";
import { signUp, signIn } from "../controllers/auth.controller.js";
import { signInValidationRules, signUpValidationRules, validate } from "../validators/user.validator.js";

const router = express.Router();

router.post("/signup", validate(signUpValidationRules), signUp);
router.post("/signin", validate(signInValidationRules), signIn);

export default router;
