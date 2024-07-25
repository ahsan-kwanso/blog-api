import {
  getPostsWithCommentsService,
  getPostsByUserWithCommentsService,
  searchPostsByTitleOrContentService,
} from "../services/post.comment.service.js";
import paginationConfig from "../config/pagination.config.js";

// Get posts with nested comments
const getPostsWithComments = async (req, res) => {
  const {
    page = paginationConfig.defaultPage,
    limit = paginationConfig.defaultLimit,
  } = req.query;

  try {
    const data = await getPostsWithCommentsService(page, limit, req);
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Get posts by user with nested comments
const getPostsByUserWithComments = async (req, res) => {
  const { user_id } = req.params;
  const {
    page = paginationConfig.defaultPage,
    limit = paginationConfig.defaultLimit,
  } = req.query;
  const { id } = req.user;

  try {
    const data = await getPostsByUserWithCommentsService(
      user_id,
      page,
      limit,
      req,
      id
    );
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Search posts by title or content
const searchPostsByTitleOrContent = async (req, res) => {
  const {
    title = "",
    content = "",
    page = paginationConfig.defaultPage,
    limit = paginationConfig.defaultLimit,
  } = req.query;

  try {
    const data = await searchPostsByTitleOrContentService(
      title,
      content,
      page,
      limit,
      req
    );
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

export {
  getPostsWithComments,
  getPostsByUserWithComments,
  searchPostsByTitleOrContent,
};
