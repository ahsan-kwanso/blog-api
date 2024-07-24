require("dotenv").config();
const express = require("express");
const { checkConnection } = require("./utils/checkConnection");
const authRoutes = require("./routes/auth.route.js");
const postRoutes = require("./routes/post.route.js");
const commentRoutes = require("./routes/comment.route.js");
const postCommentRoutes = require("./routes/post.comment.route.js");

const app = express();
const PORT = process.env.PORT;

app.use(express.json()); // Middleware to parse JSON bodies

app.get("/", (req, res) => {
  res.send("Server Started!");
});

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/posts-comments", postCommentRoutes);

checkConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

//adding the middleware to handle the errors
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
