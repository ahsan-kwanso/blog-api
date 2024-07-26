import express from "express";
import authRoutes from "./auth.route.js";
import postRoutes from "./post.route.js";
import commentRoutes from "./comment.route.js";
import postCommentRoutes from "./post.comment.route.js";

const router = express.Router();
router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);
router.use("/post/comments", postCommentRoutes);

export default router;
