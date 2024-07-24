"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, {
        foreignKey: "user_id",
      });
      Post.hasMany(models.Comment, {
        foreignKey: "post_id",
        onDelete: "CASCADE",
      });
    }
  }

  Post.init(
    {
      post_id: {
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
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "user_id",
        },
      },
    },
    {
      sequelize,
      //paranoid: true,
      freezeTableName: true,
      modelName: "Post",
    }
  );

  return Post;
};
