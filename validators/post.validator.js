import { check, validationResult } from "express-validator";

// Create Post Validation Rules
const createPostValidationRules = [
  check("title").notEmpty().withMessage("Title is required"),
  check("content").notEmpty().withMessage("Content is required"),
];

// Update Post Validation Rules
const updatePostValidationRules = [
  check("title").optional().notEmpty().withMessage("Title cannot be empty"),
  check("content").optional().notEmpty().withMessage("Content cannot be empty"),
];

// Delete Post Validation Rules
const deletePostValidationRules = [
  check("post_id").isInt().withMessage("Valid post ID is required"),
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
  validate,
};
