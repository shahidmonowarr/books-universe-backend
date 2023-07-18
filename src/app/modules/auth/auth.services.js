const httpStatus = require("http-status");
const bcrypt = require("bcrypt");
const User = require("../user/user.model");
const config = require("../../../config");
const { createToken, verifyToken } = require("../../../helpers/jwtHelpers");
const { ApiError } = require("../../../errors/apiError");

exports.signUpService = async (payload) => {
  const isExist = await User.isExist(payload.email);

  if (isExist) {
    throw new Error("Email already exist");
  }

  const user = await User.create(payload);
  if (!user) {
    throw new Error("Sign up failed");
  }

  const result = await User.findById(user._id);
  return result;
};

exports.signInService = async (payload) => {
  const { email: userEmail, password } = payload;

  //  check if email is exist
  const isExist = await User.isExist(userEmail);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Email is incorrect");
  }

  // check if password is matched
  if (
    isExist.password &&
    !(await User.isPasswordMatched(password, isExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect");
  }

  // Create Access Token
  const { _id, email } = isExist;
  const accessToken = createToken(
    { _id, email },
    config.jwt.secret,
    config.jwt.expires_in
  );

  // Create Refresh Token
  const refreshToken = createToken(
    { _id, email },
    config.jwt.refresh_secret,
    config.jwt.refresh_expires_in
  );

  return {
    accessToken,
    refreshToken,
  };
};

exports.refreshTokenService = async (token) => {
  let verifiedToken = null;
  try {
    verifiedToken = verifyToken(token, config.jwt.refresh_secret);
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token");
  }

  const { email } = verifiedToken;
  let isExist = null;

  isExist = await User.isExist(email);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  //Generate New Access Token
  const newAccessToken = createToken(
    {
      _id: isExist._id,
      id: isExist.id,
      role: isExist.role,
      email: isExist.email,
    },
    config.jwt.secret,
    config.jwt.expires_in
  );

  return {
    accessToken: newAccessToken,
  };
};
