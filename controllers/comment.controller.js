import db from "../models/index.js";
import {
  validatePagination,
  generateNextPageUrl,
} from "../utils/pagination.js";
import paginationConfig from "../config/pagination.config.js";

// Create a new comment
const createComment = async (req, res) => {
  const { title, content, PostId, ParentId } = req.body;
  const { id } = req.user; // Extract UserId from authenticated user
  try {
    if (!title || !content || !PostId) {
      return res.status(400).json({
        message: "Title, content, and PostId are required!",
      });
    }
    const post = await db.Post.findByPk(PostId);
    if (!post) {
      return res.status(404).json({
        message: "Post not Found",
      });
    }
    if (ParentId) {
      const parentComment = await db.Comment.findByPk(ParentId);
      if (!parentComment) {
        return res.status(404).json({
          message: "You can't reply to a non-existing comment",
        });
      }
    }
    const comment = await db.Comment.create({
      title,
      content,
      UserId: id,
      PostId,
      ParentId,
    });
    return res.status(201).json(comment);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const buildCommentTree = (comments) => {
  const commentMap = {};
  const rootComments = [];

  comments.forEach((comment) => {
    commentMap[comment.id] = { ...comment.dataValues, subComments: [] };
  });
  comments.forEach((comment) => {
    if (comment.dataValues.ParentId) {
      const parentComment = commentMap[comment.ParentId];
      if (parentComment) {
        parentComment.subComments.push(commentMap[comment.id]);
      }
    } else {
      rootComments.push(commentMap[comment.id]);
    }
  });
  return rootComments;
};

// Get comments by post ID with optional pagination
const getCommentsByPostId = async (req, res) => {
  const { post_id } = req.params;
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

    // Check if the post exists
    const post = await db.Post.findByPk(post_id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Fetch comments for the post with pagination
    const { count, rows } = await db.Comment.findAndCountAll({
      where: { PostId: post_id },
      limit: pagination.pageSize,
      offset: (pagination.pageNumber - 1) * pagination.pageSize,
    });
    const commentsWithSubComments = buildCommentTree(rows);
    // Calculate pagination details
    const totalPages = Math.ceil(count / pagination.pageSize);
    const nextPage =
      pagination.pageNumber < totalPages ? pagination.pageNumber + 1 : null;
    const nextPageUrl = generateNextPageUrl(nextPage, pagination.pageSize, req);

    return res.status(200).json({
      success: true,
      total: count,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      nextPage: nextPageUrl,
      comments: commentsWithSubComments,
    });
  } catch (error) {
    console.error(error.message); // Optional: log the error message
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Utility function to get comments by post ID for use in post.comment.controller.js
const getCommentsByPostIdData = async (PostId) => {
  try {
    const comments = await db.Comment.findAll({ where: { PostId } });
    const rootComments = buildCommentTree(comments);
    return rootComments;
  } catch (error) {
    throw new Error("Internal server error");
  }
};

// Get a single comment by ID
const getCommentById = async (req, res) => {
  const { comment_id } = req.params;

  try {
    const comment = await db.Comment.findByPk(comment_id);
    if (!comment) {
      return res.status(404).json({
        message: "Comment not Found",
      });
    }
    return res.status(200).json(comment);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  const { comment_id } = req.params;
  const { title, content } = req.body;
  const { id } = req.user;

  try {
    const comment = await db.Comment.findByPk(comment_id);
    if (!comment) {
      return res.status(404).json({
        message: "Comment not Found",
      });
    }
    if (comment.UserId !== id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    comment.title = title || comment.title;
    comment.content = content || comment.content;
    await comment.save();

    return res.status(200).json(comment);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  const { comment_id } = req.params;
  const { id } = req.user;

  try {
    const comment = await db.Comment.findByPk(comment_id);
    if (!comment) {
      return res.status(404).json({
        message: "Comment not Found",
      });
    }
    if (comment.UserId !== id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    await comment.destroy();
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Search comments by title or content
const searchCommentsByTitleOrContent = async (req, res) => {
  const {
    title = "",
    content = "",
    page = paginationConfig.defaultPage,
    limit = paginationConfig.defaultLimit,
  } = req.query;

  try {
    if (!title && !content) {
      return res.status(400).json({
        message: "Title or content query parameter is required",
      });
    }

    // Validate pagination
    const pagination = validatePagination(page, limit);
    if (pagination.error) {
      return res.status(400).json({
        message: pagination.error,
      });
    }

    // Fetch comments with pagination
    const comments = await db.Comment.findAndCountAll({
      where: {
        [db.Sequelize.Op.or]: [
          { title: { [db.Sequelize.Op.iLike]: `%${title}%` } },
          { content: { [db.Sequelize.Op.iLike]: `%${content}%` } },
        ],
      },
      limit: pagination.pageSize,
      offset: (pagination.pageNumber - 1) * pagination.pageSize,
    });
    // Calculate nextPage and generate URL
    const totalPages = Math.ceil(comments.count / pagination.pageSize);
    const nextPage =
      pagination.pageNumber < totalPages ? pagination.pageNumber + 1 : null;
    const nextPageUrl = generateNextPageUrl(nextPage, pagination.pageSize, req);
    console.log(nextPageUrl);
    return res.status(200).json({
      total: comments.count,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      nextPage: nextPageUrl,
      comments: comments.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export {
  createComment,
  getCommentsByPostId,
  getCommentById,
  updateComment,
  deleteComment,
  searchCommentsByTitleOrContent,
  getCommentsByPostIdData,
};
