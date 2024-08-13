import Comment from "../sequelize/models/comment.model.js";
import Post from "../sequelize/models/post.model.js";
import { Sequelize } from "sequelize";
import { validatePagination, generateNextPageUrl } from "../utils/pagination.js";
import paginationConfig from "../utils/pagination.config.js";

//for handling reply to comments
const getCommentDepth = async (commentId) => {
  let depth = 0;
  let currentCommentId = commentId;

  while (currentCommentId) {
    const comment = await Comment.findByPk(currentCommentId);
    if (!comment || !comment.ParentId) {
      break;
    }
    currentCommentId = comment.ParentId;
    depth += 1;
  }

  return depth;
};

// Create a new comment
const createComment = async (title, content, PostId, ParentId, UserId) => {
  const post = await Post.findByPk(PostId);
  if (!post) {
    return { success: false, message: "Post not Found" };
  }

  if (ParentId) {
    const parentComment = await Comment.findByPk(ParentId);
    if (parentComment && parentComment.PostId !== PostId) {
      return {
        success: false,
        message: `This comment is not on post ${PostId}`,
      };
    }
    if (!parentComment) {
      return {
        success: false,
        message: "You can't reply to a non-existing comment",
      };
    }
    // Calculate the depth of the comment thread
    const depth = await getCommentDepth(ParentId);
    if (depth >= 2) {
      ParentId = null; // Set ParentId to null if depth is 3 or more
    }
  }

  const comment = await Comment.create({
    title,
    content,
    UserId,
    PostId,
    ParentId,
  });
  return { success: true, comment: comment };
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
const getCommentsByPostId = async (req) => {
  const { post_id } = req.params;
  const { page = paginationConfig.defaultPage, limit = paginationConfig.defaultLimit } = req.query;
  const pagination = validatePagination(page, limit);
  if (pagination.error) {
    return { success: false, message: pagination.error };
  }

  const post = await Post.findByPk(post_id);
  if (!post) {
    return { success: false, message: "Post not Found" };
  }

  const comments = await Comment.findAndCountAll({
    where: { PostId: post_id },
    limit: pagination.pageSize,
    offset: (pagination.pageNumber - 1) * pagination.pageSize,
  });
  const commentsWithSubComments = buildCommentTree(comments.rows);
  const totalPages = Math.ceil(comments.count / pagination.pageSize);
  const nextPage = pagination.pageNumber < totalPages ? pagination.pageNumber + 1 : null;

  const data = {
    total: comments.count,
    page: pagination.pageNumber,
    pageSize: pagination.pageSize,
    nextPageUrl: generateNextPageUrl(nextPage, pagination.pageSize, req),
    comments: commentsWithSubComments,
  };
  return { success: true, data: data };
};

// Get a single comment by ID
const getCommentById = async (comment_id) => {
  const comment = await Comment.findByPk(comment_id);
  if (!comment) {
    return { success: false, message: "Comment not Found" };
  }
  return { success: true, comment: comment };
};

// Update a comment
const updateComment = async (comment_id, title, content, UserId) => {
  const comment = await Comment.findByPk(comment_id);
  if (!comment) {
    return { success: false, message: "Comment not Found" };
  }

  if (comment.UserId !== UserId) {
    return { success: false, message: "ForBidden" };
  }

  comment.title = title || comment.title;
  comment.content = content || comment.content;
  await comment.save();

  return { success: true, comment: comment };
};

// Delete a comment
const deleteComment = async (comment_id, UserId) => {
  const comment = await Comment.findByPk(comment_id);
  if (!comment) {
    return { success: false, message: "Comment not Found" };
  }

  if (comment.UserId !== UserId) {
    return { success: false, message: "ForBidden" };
  }

  await comment.destroy();
  return { success: true, message: "Comment deleted successfully" };
};

// Search comments by title or content
const searchCommentsByTitleOrContent = async (req) => {
  const { title = "", content = "", page = paginationConfig.defaultPage, limit = paginationConfig.defaultLimit } = req.query;

  const pagination = validatePagination(page, limit);
  if (pagination.error) {
    return { success: false, message: pagination.error };
  }

  if (!title && !content) {
    return {
      success: false,
      message: "Title or content query parameter is required",
    };
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
  const nextPage = pagination.pageNumber < totalPages ? pagination.pageNumber + 1 : null;

  const data = {
    total: comments.count,
    page: pagination.pageNumber,
    pageSize: pagination.pageSize,
    nextPageUrl: generateNextPageUrl(nextPage, pagination.pageSize, req),
    comments: comments.rows,
  };
  return { success: true, data: data };
};

const getCommentsByPostIdData = async (PostId) => {
  try {
    const comments = await Comment.findAll({ where: { PostId } });
    const rootComments = buildCommentTree(comments);
    return rootComments;
  } catch (error) {
    throw new Error("Internal server error!");
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
