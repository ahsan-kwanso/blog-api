import { sequelize } from "../config/sequelize.js";
import { Sequelize } from "sequelize";
import User from "./user.model.js";
import Post from "./post.model.js";
import Comment from "./comment.model.js";

const db = {};

db.User = User;
db.Post = Post;
db.Comment = Comment;

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
