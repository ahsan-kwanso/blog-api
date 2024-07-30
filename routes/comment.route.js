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
  getCommentByIdValidationRules,
  getCommentByPostIdValidationRules,
  searchByTitleOrContentValidator,
} from "../validators/comment.validator.js";
import { validate } from "../validators/validate.js";

const router = express.Router();

router.post("/", authenticateJWT, validate(createCommentValidationRules), createComment);
router.get("/post/:post_id", authenticateJWT, validate(getCommentByPostIdValidationRules), getCommentsByPostId);
router.get("/:comment_id", authenticateJWT, validate(getCommentByIdValidationRules), getCommentById);
router.put("/:comment_id", authenticateJWT, validate(updateCommentValidationRules), updateComment);

router.delete("/:comment_id", authenticateJWT, validate(deleteCommentValidationRules), deleteComment);

router.get("/", authenticateJWT, validate(searchByTitleOrContentValidator), searchCommentsByTitleOrContent);

export default router;
