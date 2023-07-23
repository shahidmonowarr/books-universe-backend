const httpStatus = require("http-status");
const { paginationFields } = require("../../../constants/pagination");
const { pick } = require("../../../utilities/pick");
const { sendResponse } = require("../../../utilities/sendResponse");
const { tryCatch } = require("../../../utilities/tryCatch");
const { bookFilterableFields } = require("./book.constant");
const {
  createBookService,
  getAllBooksService,
  getSingleBookService,
  updateBookService,
  deleteBookService,
  bookReviewService,
} = require("./book.services");

exports.createBook = tryCatch(async (req, res) => {
  const { _id } = req?.user;
  const result = await createBookService(req.body, _id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book created successfully",
    data: result,
  });
});

exports.getAllBooks = tryCatch(async (req, res) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filters = pick(req.query, bookFilterableFields);
  const result = await getAllBooksService(paginationOptions, filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Books retrieved successfully",
    data: result,
  });
});

exports.getSingleBook = tryCatch(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleBookService(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book retrieved successfully",
    data: result,
  });
});

exports.updateBook = tryCatch(async (req, res) => {
  const { id } = req.params;
  const { _id } = req?.user;
  const result = await updateBookService(_id, id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book update successfully",
    data: result,
  });
});

exports.deleteBook = tryCatch(async (req, res) => {
  const { _id } = req?.user;
  const { id } = req.params;
  const result = await deleteBookService(_id, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book deleted successfully",
    data: result,
  });
});

exports.bookReview = tryCatch(async (req, res) => {
  const { id } = req.params;
  const { _id } = req?.user;
  const result = await bookReviewService(_id, id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book review added successfully",
    data: result,
  });
});
