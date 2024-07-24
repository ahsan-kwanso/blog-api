const express = require("express");
const { authenticateJWT } = require("../middlewares/authmiddleware.js");
const {
  getPostsWithComments,
  getPostsByUserWithComments,
  searchPostsByTitleOrContent,
} = require("../controllers/post.comment.controller.js");

const router = express.Router();

// Route to get all posts with nested comments
router.get("/", authenticateJWT, getPostsWithComments);

// Route to get posts by user with nested comments
router.get("/user/:user_id", authenticateJWT, getPostsByUserWithComments);
router.get("/search", authenticateJWT, searchPostsByTitleOrContent);

module.exports = router;
