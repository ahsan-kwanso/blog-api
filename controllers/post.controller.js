import {
  createPost as createPostService,
  getPosts as getPostsService,
  getPostById as getPostByIdService,
  updatePost as updatePostService,
  deletePost as deletePostService,
} from "../services/post.service.js";
import { CREATED, INTERNAL_SERVER_ERROR, UNAUTHORIZED, OK, NOT_FOUND } from "http-status-codes";

const createPost = async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.user; // Extract user_id from authenticated user

  try {
    const post = await createPostService(title, content, id);
    return res.status(CREATED).json({ post });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const getPosts = async (req, res) => {
  try {
    const data = await getPostsService(req);
    res.status(OK).json({
      total: data.total,
      page: data.page,
      pageSize: data.pageSize,
      nextPage: data.nextPage,
      posts: data.posts,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const getPostById = async (req, res) => {
  const { post_id } = req.params;

  try {
    const result = await getPostByIdService(post_id);
    if (!result.success) return res.status(NOT_FOUND).json({ message: result.message });
    return res.status(OK).json(result.post);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const updatePost = async (req, res) => {
  const { post_id } = req.params;
  const { title, content } = req.body;
  const { id } = req.user;

  try {
    const result = await updatePostService(post_id, title, content, id);
    if (!result.success) {
      if (result.message === "ForBidden") return res.status(UNAUTHORIZED).json({ message: result.message });
      return res.status(NOT_FOUND).json({ message: result.message });
    }
    return res.status(OK).json(result.post);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const deletePost = async (req, res) => {
  const { post_id } = req.params;
  const { id } = req.user;

  try {
    const result = await deletePostService(post_id, id);
    if (!result.success) {
      if (result.message === "ForBidden") return res.status(UNAUTHORIZED).json({ message: result.message });
      return res.status(NOT_FOUND).json({ message: result.message });
    }
    return res.status(OK).json({ message: result.message });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export { createPost, getPosts, getPostById, updatePost, deletePost };
