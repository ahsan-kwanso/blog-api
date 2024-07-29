import { Post } from "../sequelize/models/index.js";
import {
  validatePagination,
  generateNextPageUrl,
} from "../utils/pagination.js";
import paginationConfig from "../sequelize/config/pagination.config.js";

const createPostService = async (title, content, userId) => {
  const post = await Post.create({ title, content, UserId: userId });
  return post;
};

const getPostsService = async (req) => {
  const {
    page = paginationConfig.defaultPage,
    limit = paginationConfig.defaultLimit,
  } = req.query;

  // Validate pagination parameters
  const pagination = validatePagination(page, limit);
  if (pagination.error) {
    return { success: false, message: pagination.error };
  }

  // Fetch posts with pagination
  const { count, rows } = await Post.findAndCountAll({
    limit: pagination.pageSize,
    offset: (pagination.pageNumber - 1) * pagination.pageSize,
  });

  // Calculate pagination details
  const totalPages = Math.ceil(count / pagination.pageSize);
  const nextPage =
    pagination.pageNumber < totalPages ? pagination.pageNumber + 1 : null;

  return {
    posts: rows,
    total: count,
    page: pagination.pageNumber,
    pageSize: pagination.pageSize,
    nextPage: generateNextPageUrl(nextPage, pagination.pageSize, req),
  };
};

const getPostByIdService = async (postId) => {
  const post = await Post.findByPk(postId);
  if (!post) {
    return { success: false, message: "Post not Found" };
  }
  return { success: true, post: post };
};

const updatePostService = async (postId, title, content, userId) => {
  const post = await Post.findByPk(postId);
  if (!post) {
    return { success: false, message: "Post not Found" };
  }
  if (post.UserId !== userId) {
    return { success: false, message: "ForBidden" };
  }

  post.title = title || post.title;
  post.content = content || post.content;
  await post.save();

  return { success: true, post: post };
};

const deletePostService = async (postId, userId) => {
  const post = await Post.findByPk(postId);
  if (!post) {
    return { success: false, message: "Post not Found" };
  }
  if (post.UserId !== userId) {
    return { success: false, message: "ForBidden" };
  }

  await post.destroy();
  return { success: true, message: "Post deleted successfully" };
};

export {
  createPostService,
  getPostsService,
  getPostByIdService,
  updatePostService,
  deletePostService,
};
