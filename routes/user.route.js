import express from "express";
import { authenticateJWT } from "../middlewares/authmiddleware.js";
import { getUser, getAllUsers, getCurrentUser } from "../controllers/user.controller.js";
const router = express.Router();

router.get("/find/:user_id", authenticateJWT, getUser);
router.get("/", getAllUsers);
router.get("/me", authenticateJWT, getCurrentUser);

export default router;
