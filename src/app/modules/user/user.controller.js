const httpStatus = require("http-status");
const { tryCatch } = require("../../../utilities/tryCatch");
const {
  getUserProfileService,
  getAllUsersService,
  getSingleUserService,
  updateUserService,
  deleteUserService,
  addToWishlistService,
  removeFromWishlistService,
  addToReadListService,
  markAsCompletedService,
} = require("./user.services");
const { sendResponse } = require("../../../utilities/sendResponse");
const { pick } = require("../../../utilities/pick");
const { userFilterableFields } = require("./user.constant");
const { paginationFields } = require("../../../constants/pagination");

exports.getUserProfile = tryCatch(async (req, res) => {
  const { _id } = req.user;
  const result = await getUserProfileService(_id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

exports.getAllUsers = tryCatch(async (req, res) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filters = pick(req.query, userFilterableFields);

  const result = await getAllUsersService(paginationOptions, filters);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

exports.getSingleUser = tryCatch(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleUserService(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

exports.updateUser = tryCatch(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const result = await updateUserService(id, updatedData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User update successfully",
    data: result,
  });
});

exports.deleteUser = tryCatch(async (req, res) => {
  const { id } = req.params;
  const result = await deleteUserService(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User delete successfully",
    data: result,
  });
});

exports.addToWishlist = tryCatch(async (req, res) => {
  const { _id } = req.user;
  const { bookId } = req.body;
  const result = await addToWishlistService(_id, bookId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book added to wishlist successfully",
    data: result,
  });
});

exports.removeFromWishlist = tryCatch(async (req, res) => {
  const { _id } = req.user;
  const { bookId } = req.body;
  const result = await removeFromWishlistService(_id, bookId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book removed from wishlist successfully",
    data: result,
  });
});

exports.addToReadList = tryCatch(async (req, res) => {
  const { _id } = req?.user;
  const result = await addToReadListService(_id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book added to read list successfully",
    data: result,
  });
});

exports.markAsCompleted = tryCatch(async (req, res) => {
  const { _id } = req?.user;
  const result = await markAsCompletedService(_id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book marked as completed successfully",
    data: result,
  });
});
