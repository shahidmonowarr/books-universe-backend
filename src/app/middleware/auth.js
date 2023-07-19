const httpStatus = require("http-status");
const { ApiError } = require("../../errors/apiError");
const config = require("../../config");
const { verifyToken } = require("../../helpers/jwtHelpers");

exports.auth = () => async (req, res, next) => {
  try {
    // Get Authorization Token
    const token = req.headers.authorization;
    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
    }

    // Verify Token check if it is valid
    let verifiedUser = null;
    verifiedUser = verifyToken(token, config.jwt.secret);
    req.user = verifiedUser;
    next();
  } catch (error) {
    next(error);
  }
};
