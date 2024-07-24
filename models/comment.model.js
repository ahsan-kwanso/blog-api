"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, { foreignKey: "user_id" });
      Comment.belongsTo(models.Post, {
        foreignKey: "post_id",
        onDelete: "CASCADE",
      });
      Comment.belongsTo(models.Comment, {
        foreignKey: "parent_comment_id",
        as: "ParentComment",
        onDelete: "CASCADE",
      });
      Comment.hasMany(models.Comment, {
        foreignKey: "parent_comment_id",
        as: "ChildComments",
        onDelete: "CASCADE",
      });
    }
  }

  Comment.init(
    {
      comment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      parent_comment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Comment",
          key: "comment_id",
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "user_id",
        },
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Post",
          key: "post_id",
        },
      },
    },
    {
      sequelize,
      //paranoid: true, //you have to add deletedAt table in migrations to get this working
      freezeTableName: true,
      modelName: "Comment",
    }
  );

  return Comment;
};
