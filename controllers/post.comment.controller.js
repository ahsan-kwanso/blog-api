import {
  getPostsWithCommentsService,
  getPostsByUserWithCommentsService,
  searchPostsByTitleOrContentService,
} from "../services/post.comment.service.js";
import { statusCodes } from "../utils/statusCodes.js";

// Get posts with nested comments
const getPostsWithComments = async (req, res) => {
  try {
    const result = await getPostsWithCommentsService(req);
    if (!result.success)
      return res.status(statusCodes.BAD_REQUEST).json({ message: result.message });
    return res.status(statusCodes.OK).json(result.data);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

// Get posts by user with nested comments
const getPostsByUserWithComments = async (req, res) => {
  try {
    const result = await getPostsByUserWithCommentsService(req);
    if (!result.success) res.status(statusCodes.UNAUTHORIZED).json({ message: result.message });
    return res.status(statusCodes.OK).json(result.data);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

// Search posts by title or content
const searchPostsByTitleOrContent = async (req, res) => {
  try {
    const result = await searchPostsByTitleOrContentService(req);
    if (!result.success) res.status(statusCodes.BAD_REQUEST).json({ message: result.message });
    return res.status(statusCodes.OK).json(result.data);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export { getPostsWithComments, getPostsByUserWithComments, searchPostsByTitleOrContent };
