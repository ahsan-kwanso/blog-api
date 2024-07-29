import { body, check, param, validationResult } from "express-validator";

// Create Post Validation Rules
const createPostValidationRules = [
  body("title").notEmpty().withMessage("Title is required"),
  body("content").notEmpty().withMessage("Content is required"),
];

// Update Post Validation Rules
const updatePostValidationRules = [
  param("post_id").isInt().withMessage("Valid PostId is required"),
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("content").optional().notEmpty().withMessage("Content cannot be empty"),
];

// Delete Post Validation Rules
const deletePostValidationRules = [
  param("post_id").isInt().withMessage("Valid post ID is required"),
];

const getPostByIdValidationRules = [
  param("post_id").isInt().withMessage("Valid post ID is required"),
];

// Validate function
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export {
  createPostValidationRules,
  updatePostValidationRules,
  deletePostValidationRules,
  getPostByIdValidationRules,
  validate,
};
