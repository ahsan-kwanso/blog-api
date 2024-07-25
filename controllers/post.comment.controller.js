import db from "../models/index.js";
import { getCommentsByPostIdService as getCommentsByPostIdData } from "../services/comment.service.js";
import paginationConfig from "../config/pagination.config.js";
import {
  validatePagination,
  generateNextPageUrl,
} from "../utils/pagination.js";

const getPostsWithNestedComments = async (posts) => {
  return await Promise.all(
    posts.map(async (post) => {
      const postId = post.id; // Adjust according to your actual post model
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
const getPostsWithComments = async (req, res) => {
  const {
    page = paginationConfig.defaultPage,
    limit = paginationConfig.defaultLimit,
  } = req.query;
  try {
    // Validate pagination
    const pagination = validatePagination(page, limit);
    if (pagination.error) {
      return res.status(400).json({
        message: pagination.error,
      });
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
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Utility function to get posts by user with nested comments
const getPostsByUserWithComments = async (req, res) => {
  const { user_id } = req.params;
  const {
    page = paginationConfig.defaultPage,
    limit = paginationConfig.defaultLimit,
  } = req.query;
  const { id } = req.user;
  try {
    if (parseInt(user_id) !== id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    // Validate pagination
    const pagination = validatePagination(page, limit);
    if (pagination.error) {
      return res.status(400).json({
        message: pagination.error,
      });
    }
    // Fetch paginated posts specific to the user
    const posts = await db.Post.findAll({
      where: { UserId: user_id },
      limit: pagination.pageSize,
      offset: (pagination.pageNumber - 1) * pagination.pageSize,
    });
    // Fetch and nest comments for each post
    const postsWithComments = await getPostsWithNestedComments(posts);

    // Calculate total number of posts for the user
    const totalPosts = await db.Post.count({ where: { UserId: user_id } });

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
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Utility function to search posts by title or content
const searchPostsByTitleOrContent = async (req, res) => {
  const {
    title,
    content,
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
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export {
  getPostsWithComments,
  getPostsByUserWithComments,
  searchPostsByTitleOrContent,
};
