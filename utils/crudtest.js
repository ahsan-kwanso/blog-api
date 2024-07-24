// utils/crudtest.js

const db = require("../models/sequelize"); // Adjust the path to your sequelize file if necessary

async function testCRUDOperations() {
  try {
    // Create a new user
    const user = await db.User.create({
      user_name: "testuser",
      email: "testuser@example.com",
      password: "password123",
    });
    console.log("User created:", user.toJSON());

    // Create a new post
    const post = await db.Post.create({
      title: "Test Post",
      content: "This is a test post.",
      user_id: user.user_id,
    });
    console.log("Post created:", post.toJSON());

    // Create a new comment
    const comment = await db.Comment.create({
      title: "Test Comment",
      content: "This is a test comment.",
      user_id: user.user_id,
      post_id: post.post_id,
    });
    console.log("Comment created:", comment.toJSON());

    // Retrieve all users
    const users = await db.User.findAll();
    console.log(
      "All users:",
      users.map((user) => user.toJSON())
    );

    // Retrieve all posts
    const posts = await db.Post.findAll();
    console.log(
      "All posts:",
      posts.map((post) => post.toJSON())
    );

    // Retrieve all comments
    const comments = await db.Comment.findAll();
    console.log(
      "All comments:",
      comments.map((comment) => comment.toJSON())
    );

    // Update a user
    user.user_name = "updateduser";
    await user.save();
    console.log("User updated:", user.toJSON());

    // Update a post
    post.title = "Updated Post";
    await post.save();
    console.log("Post updated:", post.toJSON());

    // Update a comment
    comment.title = "Updated Comment";
    await comment.save();
    console.log("Comment updated:", comment.toJSON());

    // Delete a comment
    await comment.destroy();
    console.log("Comment deleted");

    // Delete a post
    await post.destroy();
    console.log("Post deleted");

    // Delete a user
    await user.destroy();
    console.log("User deleted");
  } catch (error) {
    console.error("Error testing CRUD operations:", error);
  }
}

module.exports = testCRUDOperations;
