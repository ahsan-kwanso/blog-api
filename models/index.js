"use strict";
import dotenv from "dotenv";
import pg from "pg";
import { Sequelize, DataTypes } from "sequelize";
import configFile from "../config/db.config.js";
import userModel from "./user.model.js";
import postModel from "./post.model.js";
import commentModel from "./comment.model.js";
const env = process.env.NODE_ENV || "development";
const db = {};
const config = configFile[env];
dotenv.config();
let sequelize;
if (env === "production") {
  sequelize = new Sequelize(config.production_db_url, {
    dialect: config.dialect,
    protocol: config.dialect,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // For Heroku, you may need to adjust SSL settings
      },
    },
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
  });
}
db.User = userModel(sequelize, DataTypes);
db.Post = postModel(sequelize, DataTypes);
db.Comment = commentModel(sequelize, DataTypes);
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

const User = db.User;
const Post = db.Post;
const Comment = db.Comment;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;

export { User, Post, Comment, Sequelize, sequelize };
