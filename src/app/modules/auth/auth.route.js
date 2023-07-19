const express = require("express");
const { signUpZod, loginZod, refreshTokenZod } = require("./auth.validation");
const { signUp, login, refreshToken } = require("./auth.controller");
const { validateRequest } = require("../../middleware/validateRequest");

const router = express.Router();

router.route("/signup").post(validateRequest(signUpZod), signUp);
router.route("/login").post(validateRequest(loginZod), login);
router
  .route("/refresh-token")
  .post(validateRequest(refreshTokenZod), refreshToken);

module.exports = router;
