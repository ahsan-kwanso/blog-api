import express from "express";
import { authenticateJWT } from "../middlewares/authmiddleware.js";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getMyPosts,
  getPostsByTitle,
  searchUserPostsByTitle,
} from "../controllers/post.controller.js";

import {
  createPostValidationRules,
  updatePostValidationRules,
  deletePostValidationRules,
  getPostByIdValidationRules,
} from "../validators/post.validator.js";

import { validate } from "../validators/validate.js";

const router = express.Router();

router.post("/", authenticateJWT, validate(createPostValidationRules), createPost);
router.get("/", getPosts); //removed jwt authentication
router.get("/search", authenticateJWT, getPostsByTitle);
router.get("/me/search", authenticateJWT, searchUserPostsByTitle);
router.get("/me", authenticateJWT, getMyPosts);
router.get("/:post_id", validate(getPostByIdValidationRules), authenticateJWT, getPostById);
router.put("/:post_id", authenticateJWT, validate(updatePostValidationRules), updatePost);
router.delete("/:post_id", authenticateJWT, validate(deletePostValidationRules), deletePost);

export default router;
