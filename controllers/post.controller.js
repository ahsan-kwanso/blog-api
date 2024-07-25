import db from "../models/index.js";
import paginationConfig from "../config/pagination.config.js";
import {
  validatePagination,
  generateNextPageUrl,
} from "../utils/pagination.js";

// Create a new post
const createPost = async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.user; // Extract user_id from authenticated user

  try {
    if (!title || !content) {
      return res
        .status(400)
        .json({ success: false, message: "Title and content are required" });
    }
    const post = await db.Post.create({
      title,
      content,
      UserId: id,
    });
    return res.status(201).json({ success: true, post });
  } catch (error) {
    console.error(error.message); // Optional: log the error message
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Get all posts with pagination
const getPosts = async (req, res) => {
  const {
    page = paginationConfig.defaultPage,
    limit = paginationConfig.defaultLimit,
  } = req.query;

  try {
    // Validate pagination parameters
    const pagination = validatePagination(page, limit);
    if (pagination.error) {
      return res
        .status(400)
        .json({ success: false, message: pagination.error });
    }

    // Fetch posts with pagination
    const { count, rows } = await db.Post.findAndCountAll({
      limit: pagination.pageSize,
      offset: (pagination.pageNumber - 1) * pagination.pageSize,
    });

    // Calculate pagination details
    const totalPages = Math.ceil(count / pagination.pageSize);
    const nextPage =
      pagination.pageNumber < totalPages ? pagination.pageNumber + 1 : null;
    const nextPageUrl = generateNextPageUrl(nextPage, pagination.pageSize, req);

    res.status(200).json({
      success: true,
      total: count,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      nextPage: nextPageUrl,
      posts: rows,
    });
  } catch (error) {
    console.error(error.message); // Optional: log the error message
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Get a single post by ID
const getPostById = async (req, res) => {
  const { post_id } = req.params;

  try {
    const post = await db.Post.findByPk(post_id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    return res.status(200).json({ success: true, post });
  } catch (error) {
    console.error(error.message); // Optional: log the error message
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Update a post
const updatePost = async (req, res) => {
  const { post_id } = req.params;
  const { title, content } = req.body;
  const { id } = req.user;

  try {
    const post = await db.Post.findByPk(post_id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    if (post.UserId !== id) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();

    return res.status(200).json({ success: true, post });
  } catch (error) {
    console.error(error.message); // Optional: log the error message
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  const { post_id } = req.params;
  const { id } = req.user;

  try {
    const post = await db.Post.findByPk(post_id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    if (post.UserId !== id) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await post.destroy();
    return res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error(error.message); // Optional: log the error message
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { createPost, getPosts, getPostById, updatePost, deletePost };
