const db = require("../models/sequelize");
const errorHandler = require("../utils/error.js");
const {
  validatePagination,
  generateNextPageUrl,
} = require("../utils/pagination.js");
const paginationConfig = require("../config/pagination.config.js");

// Create a new post
const createPost = async (req, res, next) => {
  const { title, content } = req.body;
  const { user_id } = req.user; // Extract user_id from authenticated user
  try {
    if (!title || !content) {
      return next(errorHandler(400, "Title and content are required"));
    }
    const post = await db.Post.create({
      title,
      content,
      user_id,
    });
    return res.status(201).json(post);
  } catch (error) {
    return next(errorHandler(500, "Internal server error"));
  }
};

// Get all posts with pagination
const getPosts = async (req, res, next) => {
  const {
    page = paginationConfig.defaultPage,
    limit = paginationConfig.defaultLimit,
  } = req.query;

  try {
    // Validate pagination parameters
    const pagination = validatePagination(page, limit);
    if (pagination.error) {
      return next(errorHandler(400, pagination.error));
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
      total: count,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      nextPage: nextPageUrl,
      posts: rows,
    });
  } catch (error) {
    return next(errorHandler(500, "Internal server error"));
  }
};

// Get a single post by ID
const getPostById = async (req, res, next) => {
  const { post_id } = req.params;

  try {
    const post = await db.Post.findByPk(post_id);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }
    return res.status(200).json(post);
  } catch (error) {
    return next(errorHandler(500, "Internal server error"));
  }
};

// Update a post
const updatePost = async (req, res, next) => {
  const { post_id } = req.params;
  const { title, content } = req.body;
  const { user_id } = req.user;
  try {
    const post = await db.Post.findByPk(post_id);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }
    if (post.user_id !== user_id) {
      return next(errorHandler(403, "ForBidden"));
    }

    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();

    return res.status(200).json(post);
  } catch (error) {
    return next(errorHandler(500, "Internal server error"));
  }
};

// Delete a post
const deletePost = async (req, res, next) => {
  const { post_id } = req.params;
  const { user_id } = req.user;
  try {
    const post = await db.Post.findByPk(post_id);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }
    if (post.user_id !== user_id) {
      return next(errorHandler(403, "ForBidden"));
    }
    //await db.Comment.destroy({ where: { post_id: post } });
    await post.destroy();
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    return next(errorHandler(500, "Internal server error"));
  }
};

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost };
