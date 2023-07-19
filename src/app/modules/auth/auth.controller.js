const { tryCatch } = require("../../../utilities/tryCatch");
const {
  signUpService,
  loginService,
  refreshTokenService,
} = require("./auth.services");
const { sendResponse } = require("../../../utilities/sendResponse");
const config = require("../../../config");

exports.signUp = tryCatch(async (req, res) => {
  const result = await signUpService(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Signup successfully",
    data: result,
  });
});

exports.login = tryCatch(async (req, res) => {
  const result = await loginService(req.body);
  const { refreshToken, ...others } = result;

  // Set Refresh Token in Cookies
  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
  };
  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User login successfully",
    data: others,
  });
});

exports.refreshToken = tryCatch(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await refreshTokenService(refreshToken);

  // Set Refresh Token in Cookies
  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
  };
  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendRes(res, {
    statusCode: 200,
    success: true,
    message: "Token refreshed successfully",
    data: result,
  });
});
