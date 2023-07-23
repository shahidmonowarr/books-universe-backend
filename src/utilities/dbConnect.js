const mongoose = require("mongoose");
const config = require("../config");
mongoose.set("strictQuery", false);
const app = require("../app");
let server;

const DBConnect = async () => {
  try {
    await mongoose.connect(config.db_url);
    console.log("Connected to database🛢 successfully");
    server = app.listen(config.port, () => {
      console.log(`Application listening on port ${config.port}`);
    });
  } catch (error) {
    console.log("Failed to connect database❌", error);
  }

  process.on("unhandledRejection", (error) => {
    console.log(error);
    if (server) {
      server.close(() => {
        console.log(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
};

module.exports = DBConnect;
