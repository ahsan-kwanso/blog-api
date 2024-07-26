import {
  createCommentService,
  getCommentsByPostIdService,
  getCommentByIdService,
  updateCommentService,
  deleteCommentService,
  searchCommentsByTitleOrContentService,
} from "../services/comment.service.js";
// Create a new comment
const createComment = async (req, res) => {
  const { title, content, PostId, ParentId } = req.body;
  const { id } = req.user; // Extract UserId from authenticated user

  try {
    const comment = await createCommentService(
      title,
      content,
      PostId,
      ParentId,
      id
    );
    return res.status(201).json(comment);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Get comments by post ID with optional pagination
const getCommentsByPostId = async (req, res) => {
  try {
    const data = await getCommentsByPostIdService(req);
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Get a single comment by ID
const getCommentById = async (req, res) => {
  const { comment_id } = req.params;

  try {
    const comment = await getCommentByIdService(comment_id);
    return res.status(200).json(comment);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  const { comment_id } = req.params;
  const { title, content } = req.body;
  const { id } = req.user;

  try {
    const updatedComment = await updateCommentService(
      comment_id,
      title,
      content,
      id
    );
    return res.status(200).json(updatedComment);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  const { comment_id } = req.params;
  const { id } = req.user;

  try {
    const response = await deleteCommentService(comment_id, id);
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Search comments by title or content
const searchCommentsByTitleOrContent = async (req, res) => {
  try {
    const data = await searchCommentsByTitleOrContentService(req);
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

export {
  createComment,
  getCommentsByPostId,
  getCommentById,
  updateComment,
  deleteComment,
  searchCommentsByTitleOrContent,
};
