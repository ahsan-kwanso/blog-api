import { body, query, param, validationResult } from "express-validator";
import { statusCodes } from "../utils/statusCodes.js";
// Create Comment Validation Rules
const createCommentValidationRules = [
  body("PostId").isInt().withMessage("Valid PostId is required"),
  body("title").notEmpty().withMessage("Title is required"),
  body("content").notEmpty().withMessage("Content is required"),
];

// Update Comment Validation Rules
const updateCommentValidationRules = [
  param("comment_id").isInt().withMessage("Valid comment Id is required"),
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("content").optional().notEmpty().withMessage("Content cannot be empty"),
];

// Delete Comment Validation Rules
const deleteCommentValidationRules = [
  param("comment_id").isInt().withMessage("Valid comment ID is required"),
];

const getCommentByIdValidationRules = [
  param("comment_id").isInt().withMessage("Valid comment ID is required"),
];

const getCommentByPostIdValidationRules = [
  param("post_id").isInt().withMessage("Valid post ID is required"),
];

const searchByTitleOrContentValidator = [
  query("title").optional().isString().withMessage("Title must be a string"),
  query("content")
    .optional()
    .isString()
    .withMessage("Content must be a string"),
];

// Validate function
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(statusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }
  next();
};

export {
  createCommentValidationRules,
  updateCommentValidationRules,
  deleteCommentValidationRules,
  getCommentByIdValidationRules,
  getCommentByPostIdValidationRules,
  searchByTitleOrContentValidator,
  validate,
};

//add separate method for body params and query params
