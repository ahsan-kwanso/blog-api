import { Comment, Post, Sequelize } from "../models/index.js";
import {
  validatePagination,
  generateNextPageUrl,
} from "../utils/pagination.js";

// Create a new comment
const createCommentService = async (
  title,
  content,
  PostId,
  ParentId,
  UserId
) => {
  const post = await Post.findByPk(PostId);
  if (!post) {
    throw new Error("Post not Found");
  }

  if (ParentId) {
    const parentComment = await Comment.findByPk(ParentId);
    if (parentComment && parentComment.PostId !== PostId) {
      throw new Error(`This comment is not on post ${PostId}`);
    }
    if (!parentComment) {
      throw new Error("You can't reply to a non-existing comment");
    }
  }

  const comment = await Comment.create({
    title,
    content,
    UserId,
    PostId,
    ParentId,
  });

  return comment;
};

// Build comment tree for nested comments
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
const getCommentsByPostIdService = async (post_id, page, limit, req) => {
  const pagination = validatePagination(page, limit);
  if (pagination.error) {
    throw new Error(pagination.error);
  }

  const post = await Post.findByPk(post_id);
  if (!post) {
    throw new Error("Post not found");
  }

  const comments = await Comment.findAndCountAll({
    where: { PostId: post_id },
    limit: pagination.pageSize,
    offset: (pagination.pageNumber - 1) * pagination.pageSize,
  });
  const commentsWithSubComments = buildCommentTree(comments.rows);
  const totalPages = Math.ceil(comments.count / pagination.pageSize);
  const nextPage =
    pagination.pageNumber < totalPages ? pagination.pageNumber + 1 : null;

  return {
    total: comments.count,
    page: pagination.pageNumber,
    pageSize: pagination.pageSize,
    nextPageUrl: generateNextPageUrl(nextPage, pagination.pageSize, req),
    comments: commentsWithSubComments,
  };
};

// Get a single comment by ID
const getCommentByIdService = async (comment_id) => {
  const comment = await Comment.findByPk(comment_id);
  if (!comment) {
    throw new Error("Comment not Found");
  }
  return comment;
};

// Update a comment
const updateCommentService = async (comment_id, title, content, UserId) => {
  const comment = await Comment.findByPk(comment_id);
  if (!comment) {
    throw new Error("Comment not Found");
  }

  if (comment.UserId !== UserId) {
    throw new Error("Forbidden");
  }

  comment.title = title || comment.title;
  comment.content = content || comment.content;
  await comment.save();

  return comment;
};

// Delete a comment
const deleteCommentService = async (comment_id, UserId) => {
  const comment = await Comment.findByPk(comment_id);
  if (!comment) {
    throw new Error("Comment not Found");
  }

  if (comment.UserId !== UserId) {
    throw new Error("Forbidden");
  }

  await comment.destroy();
  return { message: "Comment deleted successfully" };
};

// Search comments by title or content
const searchCommentsByTitleOrContentService = async (
  title,
  content,
  page,
  limit,
  req
) => {
  const pagination = validatePagination(page, limit);
  if (pagination.error) {
    throw new Error(pagination.error);
  }

  if (!title && !content) {
    throw new Error("Title or content query parameter is required");
  }

  const comments = await Comment.findAndCountAll({
    where: {
      [Sequelize.Op.or]: [
        { title: { [Sequelize.Op.iLike]: `%${title}%` } },
        { content: { [Sequelize.Op.iLike]: `%${content}%` } },
      ],
    },
    limit: pagination.pageSize,
    offset: (pagination.pageNumber - 1) * pagination.pageSize,
  });

  const totalPages = Math.ceil(comments.count / pagination.pageSize);
  const nextPage =
    pagination.pageNumber < totalPages ? pagination.pageNumber + 1 : null;

  return {
    total: comments.count,
    page: pagination.pageNumber,
    pageSize: pagination.pageSize,
    nextPageUrl: generateNextPageUrl(nextPage, pagination.pageSize, req),
    comments: comments.rows,
  };
};

const getCommentsByPostIdDataService = async (PostId) => {
  try {
    const comments = await Comment.findAll({ where: { PostId } });
    const rootComments = buildCommentTree(comments);
    return rootComments;
  } catch (error) {
    throw new Error("Internal server error!");
  }
};

export {
  createCommentService,
  getCommentsByPostIdService,
  getCommentByIdService,
  updateCommentService,
  deleteCommentService,
  searchCommentsByTitleOrContentService,
  getCommentsByPostIdDataService,
};
