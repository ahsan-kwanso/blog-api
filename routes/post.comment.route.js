import express from "express";
import { authenticateJWT } from "../middlewares/authmiddleware.js";
import {
  getPostsWithComments,
  getPostsByUserWithComments,
  searchPostsByTitleOrContent,
  getPostWithCommentsById,
} from "../controllers/post.comment.controller.js";
import { getPostsByUserWithCommentsValidator, searchByTitleOrContentValidator } from "../validators/post.validator.js";
import { validate } from "../validators/validate.js";

const router = express.Router();

// Route to get all posts with nested comments
router.get("/", authenticateJWT, getPostsWithComments);

// Route to get posts by user with nested comments
router.get("/user/:user_id", authenticateJWT, validate(getPostsByUserWithCommentsValidator), getPostsByUserWithComments);
router.get("/", authenticateJWT, validate(searchByTitleOrContentValidator), searchPostsByTitleOrContent);
router.get("/:id", authenticateJWT, getPostWithCommentsById);

export default router;
