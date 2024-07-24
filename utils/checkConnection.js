const { sequelize } = require("../models/sequelize.js"); // Adjust the path as needed

const checkConnection = async () => {
  try {
    // Test the connection to the database
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // Sync all models
    await sequelize.sync({ force: false }); // if there are existing tables it will not drop them
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = {
  checkConnection,
};
