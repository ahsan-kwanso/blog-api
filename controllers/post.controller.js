import {
  createPostService,
  getPostsService,
  getPostByIdService,
  updatePostService,
  deletePostService,
} from "../services/post.service.js";

const createPost = async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.user; // Extract user_id from authenticated user

  try {
    const post = await createPostService(title, content, id);
    return res.status(201).json({ post });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

const getPosts = async (req, res) => {
  try {
    const data = await getPostsService(req);
    res.status(200).json({
      total: data.total,
      page: data.page,
      pageSize: data.pageSize,
      nextPage: data.nextPage,
      posts: data.posts,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

const getPostById = async (req, res) => {
  const { post_id } = req.params;

  try {
    const post = await getPostByIdService(post_id);
    return res.status(200).json({ post });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

const updatePost = async (req, res) => {
  const { post_id } = req.params;
  const { title, content } = req.body;
  const { id } = req.user;

  try {
    const post = await updatePostService(post_id, title, content, id);
    return res.status(200).json({ post });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

const deletePost = async (req, res) => {
  const { post_id } = req.params;
  const { id } = req.user;

  try {
    const message = await deletePostService(post_id, id);
    return res.status(200).json({ message });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

export { createPost, getPosts, getPostById, updatePost, deletePost };
