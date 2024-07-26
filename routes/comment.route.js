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
} from "../validators/comment.validator.js";

const router = express.Router();

router.post(
  "/",
  authenticateJWT,
  createCommentValidationRules,
  validate,
  createComment
);
router.get("/post/:post_id", authenticateJWT, getCommentsByPostId);
router.get("/:comment_id", authenticateJWT, getCommentById);
router.put(
  "/:comment_id",
  authenticateJWT,
  updateCommentValidationRules,
  validate,
  updateComment
);
router.delete(
  "/:comment_id",
  authenticateJWT,
  deleteCommentValidationRules,
  validate,
  deleteComment
);
router.get("/", authenticateJWT, searchCommentsByTitleOrContent);

export default router;
