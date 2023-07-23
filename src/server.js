const DBConnect = require("./utilities/dbConnect");
let server;

process.on("uncaughtException", (error) => {
  console.log(error);
  process.exit(1);
});

// Connect to DB
DBConnect();

process.on("SIGTERM", () => {
  console.log(`Sigterm is received`);
  if (server) {
    server.close();
  }
});
