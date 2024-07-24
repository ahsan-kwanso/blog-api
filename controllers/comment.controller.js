const db = require("../models/sequelize.js");
const errorHandler = require("../utils/error.js");
const {
  validatePagination,
  generateNextPageUrl,
} = require("../utils/pagination.js");
const paginationConfig = require("../config/pagination.config.js");

// Create a new comment
const createComment = async (req, res, next) => {
  const { title, content, post_id, parent_comment_id } = req.body;
  const { user_id } = req.user; // Extract user_id from authenticated user

  try {
    if (!title || !content || !post_id) {
      return next(
        errorHandler(400, "Title, content, and post_id are required!")
      );
    }
    const post = await db.Post.findByPk(post_id);
    if (!post) {
      return next(errorHandler(404, "Post not Found"));
    }
    if (parent_comment_id) {
      const parentComment = await db.Comment.findByPk(parent_comment_id);
      if (!parentComment) {
        return next(errorHandler(404, "This comment is deleted"));
      }
    }
    const comment = await db.Comment.create({
      title,
      content,
      user_id,
      post_id,
      parent_comment_id,
    });
    return res.status(201).json(comment);
  } catch (error) {
    return next(errorHandler(500, "Internal server error"));
  }
};

const buildCommentTree = (comments) => {
  const commentMap = {};
  comments.forEach((comment) => {
    commentMap[comment.comment_id] = { ...comment, subComments: [] };
  });

  const rootComments = [];
  comments.forEach((comment) => {
    if (comment.parent_comment_id) {
      const parentComment = commentMap[comment.parent_comment_id];
      if (parentComment) {
        parentComment.subComments.push(commentMap[comment.comment_id]);
      }
    } else {
      rootComments.push(commentMap[comment.comment_id]);
    }
  });
  return rootComments;
};

const extractComments = (comments) => {
  return comments.map((comment) => {
    // Extract the relevant data from `dataValues`
    const {
      comment_id,
      title,
      content,
      parent_comment_id,
      user_id,
      post_id,
      createdAt,
      updatedAt,
      deletedAt,
    } = comment.dataValues;

    // Recursively process sub-comments
    const subComments = extractComments(comment.subComments);

    return {
      comment_id,
      title,
      content,
      parent_comment_id,
      user_id,
      post_id,
      createdAt,
      updatedAt,
      deletedAt,
      subComments,
    };
  });
};

// Usage in your `getCommentsByPostId` function
const getCommentsByPostId = async (req, res, next) => {
  const { post_id } = req.params;
  const {
    page = paginationConfig.defaultPage,
    limit = paginationConfig.defaultLimit,
  } = req.query;
  try {
    // Validate pagination
    const pagination = validatePagination(page, limit);
    if (pagination.error) {
      return next(errorHandler(400, pagination.error));
    }
    const post = await db.Post.findByPk(post_id);
    if (!post) {
      return next(errorHandler(404, "Post not Found"));
    }
    // Fetch comments with pagination
    const comments = await db.Comment.findAndCountAll({
      where: { post_id },
      limit: pagination.pageSize,
      offset: (pagination.pageNumber - 1) * pagination.pageSize,
    });
    // Build the nested structure
    const rootComments = buildCommentTree(comments.rows);
    // Extract only the necessary data
    const filteredComments = extractComments(rootComments);
    // Calculate nextPage and generate URL
    const totalPages = Math.ceil(comments.count / pagination.pageSize);
    const nextPage =
      pagination.pageNumber < totalPages ? pagination.pageNumber + 1 : null;
    const nextPageUrl = generateNextPageUrl(nextPage, pagination.pageSize, req);

    return res.status(200).json({
      total: comments.count,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      nextPage: nextPageUrl,
      comments: filteredComments,
    });
  } catch (error) {
    return next(errorHandler(500, "Internal server error"));
  }
};

// Utility function to get comments by post ID for use in post.comment.controller.js
const getCommentsByPostIdData = async (post_id) => {
  try {
    const comments = await db.Comment.findAll({ where: { post_id } });
    const rootComments = buildCommentTree(comments);
    return extractComments(rootComments);
  } catch (error) {
    throw new Error("Internal server error");
  }
};

// Get a single comment by ID
const getCommentById = async (req, res, next) => {
  const { comment_id } = req.params;

  try {
    const comment = await db.Comment.findByPk(comment_id);
    if (!comment) {
      return next(errorHandler(404, "Comment not Found"));
    }
    return res.status(200).json(comment);
  } catch (error) {
    return next(errorHandler(500, "Internal server error"));
  }
};

// Update a comment
const updateComment = async (req, res, next) => {
  const { comment_id } = req.params;
  const { title, content } = req.body;
  const { user_id } = req.user;

  try {
    const comment = await db.Comment.findByPk(comment_id);
    if (!comment) {
      return next(errorHandler(404, "Comment not Found"));
    }
    if (comment.user_id !== user_id) {
      return next(errorHandler(403, "ForBidden"));
    }

    comment.title = title || comment.title;
    comment.content = content || comment.content;
    await comment.save();

    return res.status(200).json(comment);
  } catch (error) {
    return next(errorHandler(500, "Internal server error"));
  }
};

// Delete a comment
const deleteComment = async (req, res, next) => {
  const { comment_id } = req.params;
  const { user_id } = req.user;

  try {
    const comment = await db.Comment.findByPk(comment_id);
    if (!comment) {
      return next(errorHandler(404, "Comment not Found"));
    }
    if (comment.user_id !== user_id) {
      return next(errorHandler(403, "ForBidden"));
    }
    // await db.Comment.destroy({
    //   where: { parent_comment_id: comment_id },
    // });
    await comment.destroy();
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    return next(errorHandler(500, "Internal server error"));
  }
};

// Search comments by title or content
const searchCommentsByTitleOrContent = async (req, res, next) => {
  const {
    title,
    content,
    page = paginationConfig.defaultPage,
    limit = paginationConfig.defaultLimit,
  } = req.query;

  try {
    if (!title && !content) {
      return next(
        errorHandler(400, "Title or content query parameter is required")
      );
    }

    // Validate pagination
    const pagination = validatePagination(page, limit);
    if (pagination.error) {
      return next(errorHandler(400, pagination.error));
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

    return res.status(200).json({
      total: comments.count,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      nextPage: nextPageUrl,
      comments: comments.rows,
    });
  } catch (error) {
    return next(errorHandler(500, "Internal server error"));
  }
};

module.exports = {
  createComment,
  getCommentsByPostId,
  getCommentById,
  updateComment,
  deleteComment,
  getCommentsByPostIdData,
  searchCommentsByTitleOrContent,
};
