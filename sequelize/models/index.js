import { sequelize, Sequelize } from "../config/sequelize.js";
import userModel from "./user.model.js";
import postModel from "./post.model.js";
import commentModel from "./comment.model.js";

const db = {};

db.User = userModel(sequelize, Sequelize.DataTypes);
db.Post = postModel(sequelize, Sequelize.DataTypes);
db.Comment = commentModel(sequelize, Sequelize.DataTypes);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

const User = db.User;
const Post = db.Post;
const Comment = db.Comment;

export default db;

export { User, Post, Comment, Sequelize, sequelize };
