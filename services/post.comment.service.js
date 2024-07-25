import { Sequelize, Post } from "../models/index.js";
import { getCommentsByPostIdDataService } from "./comment.service.js";
import {
  validatePagination,
  generateNextPageUrl,
} from "../utils/pagination.js";

// Utility function to get posts with nested comments
const getPostsWithNestedCommentsService = async (posts) => {
  return await Promise.all(
    posts.map(async (post) => {
      const postId = post.id; // Adjust according to your actual post model
      const comments = await getCommentsByPostIdDataService(postId);
      return {
        ...post.toJSON(),
        comments: comments, // Adjust according to the response structure from getCommentsByPostIdData
      };
    })
  );
};

// Utility function to format pagination response
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

// Get posts with nested comments
const getPostsWithCommentsService = async (page, limit, req) => {
  const pagination = validatePagination(page, limit);
  if (pagination.error) {
    throw new Error(pagination.error);
  }

  const posts = await Post.findAll({
    limit: pagination.pageSize,
    offset: (pagination.pageNumber - 1) * pagination.pageSize,
  });

  const postsWithComments = await getPostsWithNestedCommentsService(posts);
  const totalPosts = await Post.count();

  return formatPaginationResponse(
    postsWithComments,
    totalPosts,
    pagination.pageNumber,
    pagination.pageSize,
    req
  );
};

// Get posts by user with nested comments
const getPostsByUserWithCommentsService = async (
  user_id,
  page,
  limit,
  req,
  authenticatedUserId
) => {
  if (parseInt(user_id) !== authenticatedUserId) {
    throw new Error("Forbidden");
  }

  const pagination = validatePagination(page, limit);
  if (pagination.error) {
    throw new Error(pagination.error);
  }

  const posts = await Post.findAll({
    where: { UserId: user_id },
    limit: pagination.pageSize,
    offset: (pagination.pageNumber - 1) * pagination.pageSize,
  });

  const postsWithComments = await getPostsWithNestedCommentsService(posts);
  const totalPosts = await Post.count({ where: { UserId: user_id } });

  return formatPaginationResponse(
    postsWithComments,
    totalPosts,
    pagination.pageNumber,
    pagination.pageSize,
    req
  );
};

// Search posts by title or content
const searchPostsByTitleOrContentService = async (
  title,
  content,
  page,
  limit,
  req
) => {
  if (!title && !content) {
    throw new Error("Title or content query parameter is required");
  }

  const pagination = validatePagination(page, limit);
  if (pagination.error) {
    throw new Error(pagination.error);
  }

  const posts = await Post.findAndCountAll({
    where: {
      [Sequelize.Op.or]: [
        { title: { [Sequelize.Op.iLike]: `%${title}%` } },
        { content: { [Sequelize.Op.iLike]: `%${content}%` } },
      ],
    },
    limit: pagination.pageSize,
    offset: (pagination.pageNumber - 1) * pagination.pageSize,
  });

  const postsWithComments = await getPostsWithNestedCommentsService(posts.rows);
  return formatPaginationResponse(
    postsWithComments,
    posts.count,
    pagination.pageNumber,
    pagination.pageSize,
    req
  );
};

export {
  getPostsWithCommentsService,
  getPostsByUserWithCommentsService,
  searchPostsByTitleOrContentService,
};
