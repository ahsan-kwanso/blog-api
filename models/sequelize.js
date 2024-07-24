"use strict";
const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/db.config.js");

const env = process.env.NODE_ENV || "development";
const envConfig = config[env];

let sequelize;
if (env === "production") {
  sequelize = new Sequelize(envConfig.production_db_url, {
    dialect: envConfig.dialect,
    protocol: envConfig.dialect,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // For Heroku, you may need to adjust SSL settings
      },
    },
  });
} else {
  sequelize = new Sequelize(
    envConfig.database,
    envConfig.username,
    envConfig.password,
    {
      host: envConfig.host,
      dialect: envConfig.dialect,
    }
  );
}

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import models and assign them to the db object
db.User = require("./user.model.js")(sequelize, DataTypes);
db.Post = require("./post.model.js")(sequelize, DataTypes);
db.Comment = require("./comment.model.js")(sequelize, DataTypes);

// Set up associations after all models are defined
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
