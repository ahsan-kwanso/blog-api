import express from "express";
import { authenticateJWT } from "../middlewares/authmiddleware.js";
import { createPost, getPosts, getPostById, updatePost, deletePost } from "../controllers/post.controller.js";

import {
  createPostValidationRules,
  updatePostValidationRules,
  deletePostValidationRules,
  validate,
  getPostByIdValidationRules,
} from "../validators/post.validator.js";

const router = express.Router();

router.post("/", authenticateJWT, createPostValidationRules, validate, createPost);
router.get("/", authenticateJWT, getPosts);
router.get("/:post_id", getPostByIdValidationRules, validate, authenticateJWT, getPostById);
router.put("/:post_id", authenticateJWT, updatePostValidationRules, validate, updatePost);
router.delete("/:post_id", authenticateJWT, deletePostValidationRules, validate, deletePost);

export default router;
