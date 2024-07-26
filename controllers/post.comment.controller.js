import {
  getPostsWithCommentsService,
  getPostsByUserWithCommentsService,
  searchPostsByTitleOrContentService,
} from "../services/post.comment.service.js";
import paginationConfig from "../config/pagination.config.js";

// Get posts with nested comments
const getPostsWithComments = async (req, res) => {
  try {
    const data = await getPostsWithCommentsService(req);
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Get posts by user with nested comments
const getPostsByUserWithComments = async (req, res) => {
  try {
    const data = await getPostsByUserWithCommentsService(req);
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Search posts by title or content
const searchPostsByTitleOrContent = async (req, res) => {
  try {
    const data = await searchPostsByTitleOrContentService(req);
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
