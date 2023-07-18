const colors = require("colors");
const mongoose = require("mongoose");
const { errorLogger, logger } = require("./logger");
const config = require("../config");
mongoose.set("strictQuery", false);
const app = require("../app");
let server;

const DBConnect = async () => {
  try {
    await mongoose.connect(config.db_url);
    logger.info("Connected to database🛢 successfully");
    server = app.listen(config.port, () => {
      logger.info(`Application listening on port ${config.port}`);
    });
  } catch (error) {
    errorLogger.error("Failed to connect database❌", error);
  }

  process.on("unhandledRejection", (error) => {
    console.log(error);
    if (server) {
      server.close(() => {
        errorLogger.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
};

module.exports = DBConnect;
