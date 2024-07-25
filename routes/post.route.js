import express from "express";
import { authenticateJWT } from "../middlewares/authmiddleware.js";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/", authenticateJWT, createPost);
router.get("/", authenticateJWT, getPosts);
router.get("/:post_id", authenticateJWT, getPostById);
router.put("/:post_id", authenticateJWT, updatePost);
router.delete("/:post_id", authenticateJWT, deletePost);

export default router;
