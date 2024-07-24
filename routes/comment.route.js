const express = require("express");
const { authenticateJWT } = require("../middlewares/authmiddleware.js");
const {
  createComment,
  getCommentsByPostId,
  getCommentById,
  updateComment,
  deleteComment,
  searchCommentsByTitleOrContent,
} = require("../controllers/comment.controller.js");

const router = express.Router();

router.post("/", authenticateJWT, createComment);
router.get("/post/:post_id", authenticateJWT, getCommentsByPostId);
router.get("/:comment_id", authenticateJWT, getCommentById);
router.put("/:comment_id", authenticateJWT, updateComment);
router.delete("/:comment_id", authenticateJWT, deleteComment);
router.get("", authenticateJWT, searchCommentsByTitleOrContent);
module.exports = router;
