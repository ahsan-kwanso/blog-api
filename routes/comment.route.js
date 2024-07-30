import express from "express";
import { authenticateJWT } from "../middlewares/authmiddleware.js";
import {
  createComment,
  getCommentsByPostId,
  getCommentById,
  updateComment,
  deleteComment,
  searchCommentsByTitleOrContent,
} from "../controllers/comment.controller.js";

import {
  createCommentValidationRules,
  updateCommentValidationRules,
  deleteCommentValidationRules,
  validate,
  getCommentByIdValidationRules,
  getCommentByPostIdValidationRules,
  searchByTitleOrContentValidator,
} from "../validators/comment.validator.js";

const router = express.Router();

router.post("/", authenticateJWT, createCommentValidationRules, validate, createComment);
router.get("/post/:post_id", authenticateJWT, getCommentByPostIdValidationRules, validate, getCommentsByPostId);
router.get("/:comment_id", authenticateJWT, getCommentByIdValidationRules, validate, getCommentById);
router.put("/:comment_id", authenticateJWT, updateCommentValidationRules, validate, updateComment);

router.delete("/:comment_id", authenticateJWT, deleteCommentValidationRules, validate, deleteComment);

router.get("/", authenticateJWT, searchByTitleOrContentValidator, validate, searchCommentsByTitleOrContent);

export default router;
