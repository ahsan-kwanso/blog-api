import { check, validationResult } from "express-validator";

// Create Comment Validation Rules
const createCommentValidationRules = [
  check("PostId").isInt().withMessage("Valid PostId is required"),
  check("title").notEmpty().withMessage("Title is required"),
  check("content").notEmpty().withMessage("Content is required"),
];

// Update Comment Validation Rules
const updateCommentValidationRules = [
  check("comment_id").isInt().withMessage("Valid comment Id is required"),
  check("title").optional().notEmpty().withMessage("Title cannot be empty"),
  check("content").optional().notEmpty().withMessage("Content cannot be empty"),
];

// Delete Comment Validation Rules
const deleteCommentValidationRules = [
  check("comment_id").isInt().withMessage("Valid comment ID is required"),
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
  createCommentValidationRules,
  updateCommentValidationRules,
  deleteCommentValidationRules,
  validate,
};

//add separate method for body params and query params
