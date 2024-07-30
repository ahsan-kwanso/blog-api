import {
  createPostService,
  getPostsService,
  getPostByIdService,
  updatePostService,
  deletePostService,
} from "../services/post.service.js";
import { statusCodes } from "../utils/statusCodes.js";

const createPost = async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.user; // Extract user_id from authenticated user

  try {
    const post = await createPostService(title, content, id);
    return res.status(statusCodes.CREATED).json({ post });
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const getPosts = async (req, res) => {
  try {
    const data = await getPostsService(req);
    res.status(statusCodes.OK).json({
      total: data.total,
      page: data.page,
      pageSize: data.pageSize,
      nextPage: data.nextPage,
      posts: data.posts,
    });
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const getPostById = async (req, res) => {
  const { post_id } = req.params;

  try {
    const result = await getPostByIdService(post_id);
    if (!result.success) return res.status(statusCodes.NOT_FOUND).json({ message: result.message });
    return res.status(statusCodes.OK).json(result.post);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const updatePost = async (req, res) => {
  const { post_id } = req.params;
  const { title, content } = req.body;
  const { id } = req.user;

  try {
    const result = await updatePostService(post_id, title, content, id);
    if (!result.success) {
      if (result.message === "ForBidden")
        return res.status(statusCodes.UNAUTHORIZED).json({ message: result.message });
      return res.status(statusCodes.NOT_FOUND).json({ message: result.message });
    }
    return res.status(statusCodes.OK).json(result.post);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const deletePost = async (req, res) => {
  const { post_id } = req.params;
  const { id } = req.user;

  try {
    const result = await deletePostService(post_id, id);
    if (!result.success) {
      if (result.message === "ForBidden")
        return res.status(statusCodes.UNAUTHORIZED).json({ message: result.message });
      return res.status(statusCodes.NOT_FOUND).json({ message: result.message });
    }
    return res.status(statusCodes.OK).json({ message: result.message });
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export { createPost, getPosts, getPostById, updatePost, deletePost };
