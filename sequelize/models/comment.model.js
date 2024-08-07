import { sequelize } from "../config/sequelize.js";
import { DataTypes } from "sequelize";
import User from "./user.model.js";
import Post from "./post.model.js";

const Comment = sequelize.define("Comments", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  PostId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Posts",
      key: "id",
    },
  },
  ParentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "Comments",
      key: "id",
    },
  },
});

Comment.associate = (models) => {
  Comment.belongsTo(models.User, {
    foreignKey: "UserId",
  });

  Comment.belongsTo(models.Post, {
    foreignKey: "PostId",
    onDelete: "CASCADE",
  });

  Comment.belongsTo(models.Comment, {
    as: "parentComment",
    foreignKey: "ParentId",
    onDelete: "CASCADE",
  });

  Comment.hasMany(models.Comment, {
    as: "replies",
    foreignKey: "ParentId",
    onDelete: "CASCADE",
  });
};

export default Comment;
