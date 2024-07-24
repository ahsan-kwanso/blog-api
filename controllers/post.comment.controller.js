const db = require("../models/sequelize");
const { getCommentsByPostIdData } = require("./comment.controller.js");
const errorHandler = require("../utils/error.js");
const {
  validatePagination,
  generateNextPageUrl,
} = require("../utils/pagination.js");
const paginationConfig = require("../config/pagination.config.js");

const getPostsWithNestedComments = async (posts) => {
  return await Promise.all(
    posts.map(async (post) => {
      const postId = post.post_id; // Adjust according to your actual post model
      const comments = await getCommentsByPostIdData(postId);
      return {
        ...post.toJSON(),
        comments: comments, // Adjust according to the response structure from getCommentsByPostIdData
      };
    })
  );
};

const formatPaginationResponse = (
  data,
  totalItems,
  pageNumber,
  pageSize,
  req
) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;
  const nextPageUrl = generateNextPageUrl(nextPage, pageSize, req);

  return {
    total: totalItems,
    page: pageNumber,
    pageSize: pageSize,
    nextPage: nextPageUrl,
    posts: data,
  };
};

// Utility function to get posts with nested comments
const getPostsWithComments = async (req, res, next) => {
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
    // Fetch paginated posts
    const posts = await db.Post.findAll({
      limit: pagination.pageSize,
      offset: (pagination.pageNumber - 1) * pagination.pageSize,
    });

    // Fetch and nest comments for each post
    const postsWithComments = await getPostsWithNestedComments(posts);

    // Calculate total number of posts
    const totalPosts = await db.Post.count();

    return res
      .status(200)
      .json(
        formatPaginationResponse(
          postsWithComments,
          totalPosts,
          pagination.pageNumber,
          pagination.pageSize,
          req
        )
      );
  } catch (error) {
    console.error(error.message); // Optional: log the error message
    return next(errorHandler(500, "Internal server error"));
  }
};

// Utility function to get posts by user with nested comments
const getPostsByUserWithComments = async (req, res, next) => {
  const { user_id } = req.params;
  const {
    page = paginationConfig.defaultPage,
    limit = paginationConfig.defaultLimit,
  } = req.query;

  try {
    if (parseInt(user_id) !== req.user.user_id) {
      return next(errorHandler(403, "Forbidden"));
    }

    // Validate pagination
    const pagination = validatePagination(page, limit);
    if (pagination.error) {
      return next(errorHandler(400, pagination.error));
    }
    // Fetch paginated posts specific to the user
    const posts = await db.Post.findAll({
      where: { user_id },
      limit: pagination.pageSize,
      offset: (pagination.pageNumber - 1) * pagination.pageSize,
    });

    // Fetch and nest comments for each post
    const postsWithComments = await getPostsWithNestedComments(posts);

    // Calculate total number of posts for the user
    const totalPosts = await db.Post.count({ where: { user_id } });

    return res
      .status(200)
      .json(
        formatPaginationResponse(
          postsWithComments,
          totalPosts,
          pagination.pageNumber,
          pagination.pageSize,
          req
        )
      );
  } catch (error) {
    return next(errorHandler(500, "Internal server error"));
  }
};

// Utility function to search posts by title or content
const searchPostsByTitleOrContent = async (req, res, next) => {
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
    // Fetch paginated posts that match the search criteria
    const posts = await db.Post.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { title: { [db.Sequelize.Op.iLike]: `%${title}%` } },
          { content: { [db.Sequelize.Op.iLike]: `%${content}%` } },
        ],
      },
      limit: pagination.pageSize,
      offset: (pagination.pageNumber - 1) * pagination.pageSize,
    });

    // Fetch and nest comments for each post
    const postsWithComments = await getPostsWithNestedComments(posts);

    // Calculate total number of posts matching the search criteria
    const totalPosts = posts.length;

    return res
      .status(200)
      .json(
        formatPaginationResponse(
          postsWithComments,
          totalPosts,
          pagination.pageNumber,
          pagination.pageSize,
          req
        )
      );
  } catch (error) {
    return next(errorHandler(500, "Internal server error"));
  }
};

module.exports = {
  getPostsWithComments,
  getPostsByUserWithComments,
  searchPostsByTitleOrContent,
};
