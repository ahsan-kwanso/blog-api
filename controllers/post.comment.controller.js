import {
  getPostsWithCommentsService,
  getPostsByUserWithCommentsService,
  searchPostsByTitleOrContentService,
} from "../services/post.comment.service.js";

// Get posts with nested comments
const getPostsWithComments = async (req, res) => {
  try {
    const result = await getPostsWithCommentsService(req);
    if (!result.success)
      return res.status(400).json({ message: result.message });
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get posts by user with nested comments
const getPostsByUserWithComments = async (req, res) => {
  try {
    const result = await getPostsByUserWithCommentsService(req);
    if (!result.success) res.status(400).json({ message: result.message });
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Search posts by title or content
const searchPostsByTitleOrContent = async (req, res) => {
  try {
    const result = await searchPostsByTitleOrContentService(req);
    if (!result.success) res.status(400).json({ message: result.message });
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  getPostsWithComments,
  getPostsByUserWithComments,
  searchPostsByTitleOrContent,
};
