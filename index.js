import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.route.js";
import db from "./models/index.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import postCommentRoutes from "./routes/post.comment.route.js";

dotenv.config();

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

const dbSync = async () => {
  try {
    await db.sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

dbSync();
