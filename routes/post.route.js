const express = require("express");
const { authenticateJWT } = require("../middlewares/authmiddleware.js");
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/post.controller.js");

const router = express.Router();

router.post("/", authenticateJWT, createPost);
router.get("/", authenticateJWT, getPosts);
router.get("/:post_id", authenticateJWT, getPostById);
router.put("/:post_id", authenticateJWT, updatePost);
router.delete("/:post_id", authenticateJWT, deletePost);

module.exports = router;
