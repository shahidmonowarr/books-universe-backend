const express = require("express");
const router = express.Router();
const userRoute = require("../modules/user/user.route");
const authRoute = require("../modules/auth/auth.route");
const bookRoute = require("../modules/book/book.route");

const appRoutes = [
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/book",
    route: bookRoute,
  },
];

appRoutes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
