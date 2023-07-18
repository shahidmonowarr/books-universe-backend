const express = require("express");
const app = express();
const cors = require("cors");
const httpStatus = require("http-status");
const cookieParser = require("cookie-parser");
const { sendResponse } = require("./utilities/sendResponse");
const { globalError } = require("./app/middleware/globalError");
const routes = require("./app/routes/index");

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Testing API
app.get("/", (req, res) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "+++ App Running Successfully +++",
    data: null,
  });
});

// Data Route
app.use("/api/v1", routes);

// Handle Error || Close App
app.use(globalError);

// Unknown API Handle
app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found",
    errorMessage: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
  next();
});

module.exports = app;
