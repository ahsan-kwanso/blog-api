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
    if (!comment.success)
      return res.status(400).json({ message: comment.message });
    return res.status(201).json(comment);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get comments by post ID
const getCommentsByPostId = async (req, res) => {
  try {
    const comments = await getCommentsByPostIdService(req);
    if (!comments.success)
      return res.status(400).json({ message: comments.message });
    return res.status(200).json(comments.data);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error. " });
  }
};

// Get a single comment by ID
const getCommentById = async (req, res) => {
  const { comment_id } = req.params;

  try {
    const result = await getCommentByIdService(comment_id);
    if (!result.success) res.status(400).json({ message: result.message });
    return res.status(200).json(result.comment);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
// Update a comment
const updateComment = async (req, res) => {
  const { comment_id } = req.params;
  const { title, content } = req.body;
  const { id } = req.user;

  try {
    const result = await updateCommentService(comment_id, title, content, id);
    if (!result.success)
      return res.status(400).json({ message: result.message });
    return res.status(200).json(result.comment);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  const { comment_id } = req.params;
  const { id } = req.user;

  try {
    const result = await deleteCommentService(comment_id, id);
    if (!result.success)
      return res.status(400).json({ message: result.message });
    return res.status(200).json({ message: result.message });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Search comments by title or content
const searchCommentsByTitleOrContent = async (req, res) => {
  try {
    const result = await searchCommentsByTitleOrContentService(req);
    if (!result.success)
      return res.status(400).json({ message: result.message });
    return res.status(200).json(result.data);
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
